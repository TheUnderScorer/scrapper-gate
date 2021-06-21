/* eslint-disable @typescript-eslint/no-explicit-any */
import { asValueObject } from '@scrapper-gate/backend/awilix';
import { Handlers } from '@scrapper-gate/backend/cqrs';
import { RepositoriesProvider } from '@scrapper-gate/backend/database';
import { Logger } from '@scrapper-gate/shared/logger';
import { asValue, AwilixContainer } from 'awilix';
import { Typed } from 'emittery';
import { CqrsResult } from 'functional-cqrs';

import { Connection } from 'typeorm';
import { UnitOfWorkCallback } from './types';

export interface UnitOfWorkDependencies {
  connection: Connection;
  handlers: Handlers;
  // Note - container passed to unit of work should not be scoped
  container: AwilixContainer;
  logger: Logger;
  repositoriesProvider: RepositoriesProvider;
}

export class UnitOfWork<
  Cqrs extends CqrsResult<any, any> = CqrsResult<any, any>
> {
  readonly events = new Typed<{
    finished: UnitOfWork<Cqrs>;
    failed: {
      error: Error;
      service: UnitOfWork<Cqrs>;
    };
  }>();

  constructor(private readonly dependencies: UnitOfWorkDependencies) {}

  async run<ReturnType>(
    callback: UnitOfWorkCallback<ReturnType, Cqrs['buses']>
  ) {
    const {
      connection,
      container,
      logger,
      repositoriesProvider,
    } = this.dependencies;

    const scopedContainer = container.createScope();

    // const messageQueue = scopedContainer.resolve<MessageQueue>('messageQueue');

    try {
      const result = await connection.transaction(async (t) => {
        const scopedContainer = container.createScope();

        scopedContainer.register(asValueObject(repositoriesProvider(t)));

        const {
          buses: { eventsBus, commandsBus, queriesBus },
        } = scopedContainer.resolve<Cqrs>('cqrsFactory');

        scopedContainer.register({
          eventsBus: asValue(eventsBus),
          commandsBus: asValue(commandsBus),
          queriesBus: asValue(queriesBus),
        });

        const callbackContext = {
          eventsBus,
          queriesBus,
          commandsBus,
        };

        return callback(callbackContext);
      });

      // await messageQueue.commit();

      await this.events.emit('finished', this);

      return result;
    } catch (e) {
      logger.error('Unit of work failed:', e);

      await this.events.emit('failed', {
        error: e,
        service: this,
      });

      throw e;
    } finally {
      await scopedContainer.dispose();
    }
  }
}
