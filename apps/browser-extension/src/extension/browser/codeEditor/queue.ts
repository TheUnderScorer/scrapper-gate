import PQueue from 'p-queue';

const queues = new Map<string, PQueue>();

export const forSession = (sessionId: string) => {
  if (!queues.has(sessionId)) {
    queues.set(sessionId, new PQueue({ autoStart: true, concurrency: 1 }));
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return queues.get(sessionId)!;
};

export const push = async (
  sessionId: string,
  operation: () => Promise<unknown>
) => {
  const queue = forSession(sessionId);

  return queue.add(operation);
};

export const remove = (sessionId: string) => {
  const queue = forSession(sessionId);

  queue.clear();

  queues.delete(sessionId);
};
