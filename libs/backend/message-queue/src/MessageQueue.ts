import { castAsArray } from '@scrapper-gate/shared/common';
import { Logger } from '@scrapper-gate/shared/logger';
import { MessageQueueClient, SendMessageParams } from './types';

export interface MessageQueueDependencies {
  messageQueueClient: MessageQueueClient;
  logger: Logger;
}

export class MessageQueue {
  private queue: SendMessageParams<unknown>[] = [];

  constructor(private readonly dependencies: MessageQueueDependencies) {}

  async push(
    message: SendMessageParams<unknown> | SendMessageParams<unknown>[],
    sendImmediately?: boolean
  ) {
    const messages = castAsArray(message);

    if (sendImmediately) {
      await this.sendMessages(messages);

      return;
    }

    this.queue.push(...messages);
  }

  async flush() {
    if (!this.queue.length) {
      this.dependencies.logger.warn('No messages to clean.');

      return;
    }

    this.queue = [];
  }

  async commit() {
    await this.sendMessages(this.queue);
  }

  private async sendMessages(messages: SendMessageParams<unknown>[]) {
    for (const message of messages) {
      const stringMessage = `${JSON.stringify(message)}`;

      this.dependencies.logger.info(`Sending message: ${stringMessage}`);

      await this.dependencies.messageQueueClient.send(message);

      this.dependencies.logger.info(`Message sent: ${stringMessage}`);
    }
  }
}
