export interface SendMessageParams<T> {
  message: Message<T>;
  groupId: string;
  queueUrl: string;
}

export interface MessageQueueClient {
  send: (params: SendMessageParams<unknown>) => Promise<void>;
  healthCheck: (expectedQueueUrls: string[]) => Promise<void>;
}

export interface Message<T> {
  payload: T;
  traceId: string;
  date: string;
}
