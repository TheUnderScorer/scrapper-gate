import { MaybePromise } from '@scrapper-gate/shared/common';

export interface SendMessageParams<T> {
  message: Message<T>;
  groupId: string;
  queueUrl: string;
}

export type ReceiveMessagesCallback<T> = (
  messages: Message<T>[]
) => MaybePromise<void>;

export interface ReceiveParams<T> {
  callback: ReceiveMessagesCallback<T>;
  queueUrl: string;
  ms?: number;
  maxMessages?: number;
  removeAfter?: boolean;
}

export interface MessageQueueClient {
  send: (params: SendMessageParams<unknown>) => Promise<void>;
  receive: <T>(params: ReceiveParams<T>) => Promise<() => Promise<void>>;
  healthCheck: (expectedQueueUrls: string[]) => Promise<void>;
}

export interface Message<T> {
  payload: T;
  traceId: string;
  date: string;
}
