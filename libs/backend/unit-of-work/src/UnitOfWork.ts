import { UnitOfWorkCallback } from './types';
import { asValue, AwilixContainer } from 'awilix';
import { asValueObject } from '@scrapper-gate/backend/awilix';
import { Connection } from 'typeorm';
import { Handlers } from '@scrapper-gate/backend/cqrs';
import { createCqrs } from 'functional-cqrs';
import { Logger } from '@scrapper-gate/shared/logger';
import { Typed } from 'emittery';
import { RepositoriesProvider } from '@scrapper-gate/backend/database';
import { Buses } from 'functional-cqrs/build/typings/buses';

export interface UnitOfWorkDependencies {
  connection: Connection;
  handlers: Handlers;
  // Note - container passed to unit of work should not be scoped
  container: AwilixContainer;
  logger: Logger;
  repositoriesProvider: RepositoriesProvider;
}

export class UnitOfWork {
  readonly events = new Typed<{
    finished: UnitOfWork;
    failed: {
      error: Error;
      service: UnitOfWork;
    };
  }>();

  constructor(private readonly dependencies: UnitOfWorkDependencies) {}

  async run<ReturnType>(callback: UnitOfWorkCallback<ReturnType>) {
    const {
      connection,
      handlers,
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
        } = await createCqrs({
          context: (buses) => {
            scopedContainer.register({
              eventsBus: asValue(buses.eventsBus),
              commandsBus: asValue(buses.commandsBus),
              queriesBus: asValue(buses.queriesBus),
            });

            return scopedContainer.cradle;
          },
          ...handlers,
        });

        const callbackContext: Buses = {
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
