/* eslint-disable @typescript-eslint/no-explicit-any */
import '../../../../typings/global';
import { MessageQueue } from '@scrapper-gate/backend/message-queue';
import { asFunction, asValue, AwilixContainer, createContainer } from 'awilix';
import { Buses, CommandsBus, EventsBus, QueriesBus } from 'functional-cqrs';
import { createMockProxy } from 'jest-mock-proxy';
import { UnitOfWork } from './UnitOfWork';

const mockBuses: Buses<any, any> = {
  eventsBus: createMockProxy<EventsBus>(),
  commandsBus: createMockProxy<CommandsBus>(),
  queriesBus: createMockProxy<QueriesBus>(),
};

const mockDisposable = {
  callback: jest.fn(),
  dispose: jest.fn(),
};

const disposableProvider = jest.fn(() => mockDisposable);
const messageQueue = createMockProxy<MessageQueue>();

describe('Unit of work', () => {
  const create = () => {
    const container = createContainer();

    container.register({
      cqrsFactory: asValue({ buses: mockBuses }),
      disposable: asFunction(disposableProvider)
        .scoped()
        .disposer((value) => value.dispose()),
      messageQueue: asValue(messageQueue),
    });

    const repositoriesProvider = jest.fn(() => ({}));

    const unitOfWork = new UnitOfWork({
      container,
      logger: createMockProxy(),
      connection: global.connection,
      repositoriesProvider,
      messageQueue,
    });

    return {
      unitOfWork,
      repositoriesProvider,
      container,
    };
  };

  it('should create context and dispose it after run', async () => {
    const callback = jest.fn(
      ({ container }: { container: AwilixContainer }) => {
        (container.resolve('disposable') as typeof mockDisposable).callback();
      }
    );
    const { unitOfWork, repositoriesProvider } = create();

    await unitOfWork.run(callback);

    expect(messageQueue.commit).toHaveBeenCalledTimes(1);

    expect(callback).toBeCalledTimes(1);

    expect(repositoriesProvider).toHaveBeenCalledTimes(1);

    expect(mockDisposable.dispose).toHaveBeenCalledTimes(1);
    expect(disposableProvider).toHaveBeenCalledTimes(1);

    await unitOfWork.run(callback);

    expect(mockDisposable.dispose).toHaveBeenCalledTimes(2);
    expect(disposableProvider).toHaveBeenCalledTimes(2);
  });
});
