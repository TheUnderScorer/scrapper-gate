/* eslint-disable @typescript-eslint/no-explicit-any */
import { asValueObject } from '@scrapper-gate/backend/awilix';
import { RepositoriesProvider } from '@scrapper-gate/backend/database';
import { MessageQueue } from '@scrapper-gate/backend/message-queue';
import { Disposable } from '@scrapper-gate/shared/common';
import { Logger } from '@scrapper-gate/shared/logger';
import { asValue, AwilixContainer } from 'awilix';
import { Typed } from 'emittery';
import { CqrsResult } from 'functional-cqrs';
import { Connection, EntityManager } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';
import { UnitOfWorkCallback } from './types';

export interface UnitOfWorkRunParams {
  isolationLevel?: IsolationLevel;
  runInTransaction?: boolean;
}

export interface UnitOfWorkDependencies {
  connection: Connection;

  // Note - container passed to unit of work should not be scoped
  container: AwilixContainer;
  logger: Logger;
  repositoriesProvider: RepositoriesProvider;
  messageQueue: MessageQueue;
}

export class UnitOfWork<
  Cqrs extends CqrsResult<any, any> = CqrsResult<any, any>
> implements Disposable
{
  readonly events = new Typed<{
    finished: UnitOfWork<Cqrs>;
    failed: {
      error: Error;
      service: UnitOfWork<Cqrs>;
    };
    start: {
      container: AwilixContainer;
    };
  }>();

  constructor(private readonly dependencies: UnitOfWorkDependencies) {}

  async run<ReturnType>(
    callback: UnitOfWorkCallback<ReturnType, Cqrs['buses']>,
    {
      isolationLevel = 'READ UNCOMMITTED',
      runInTransaction = true,
    }: UnitOfWorkRunParams = {}
  ) {
    const { connection, container, logger } = this.dependencies;

    const scopedContainer = container.createScope();

    const messageQueue = scopedContainer.resolve<MessageQueue>('messageQueue');

    try {
      const result = runInTransaction
        ? await connection.transaction(isolationLevel, async (t) => {
            return await this.callCallback(scopedContainer, t, callback);
          })
        : await this.callCallback(scopedContainer, connection, callback);

      await messageQueue.commit();

      await this.events.emit('finished', this);

      return result;
    } catch (e) {
      await messageQueue.flush();

      logger.error('Unit of work failed:', e.message);

      await this.events.emit('failed', {
        error: e,
        service: this,
      });

      throw e;
    } finally {
      await scopedContainer.dispose();
    }
  }

  private async callCallback<ReturnType>(
    scopedContainer: AwilixContainer,
    connection: EntityManager | Connection,
    callback: (
      context: Cqrs['buses'] & { container: AwilixContainer }
    ) => Promise<ReturnType> | ReturnType
  ) {
    const { repositoriesProvider } = this.dependencies;
    scopedContainer.register(asValueObject(repositoriesProvider(connection)));

    const {
      buses: { eventsBus, commandsBus, queriesBus },
    } = scopedContainer.resolve<Cqrs>('cqrsFactory');

    scopedContainer.register({
      eventsBus: asValue(eventsBus),
      commandsBus: asValue(commandsBus),
      queriesBus: asValue(queriesBus),
    });

    await this.events.emit('start', {
      container: scopedContainer,
    });

    const callbackContext = {
      eventsBus,
      queriesBus,
      commandsBus,
      container: scopedContainer,
    };

    return callback(callbackContext);
  }

  dispose() {
    this.events.clearListeners();
  }
}
