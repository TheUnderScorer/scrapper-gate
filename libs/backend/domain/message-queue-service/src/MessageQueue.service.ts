import { Message, MessageQueue } from '@scrapper-gate/backend/message-queue';
import { ScrapperRunnerMessagePayload } from '@scrapper-gate/shared/domain/scrapper';
import { BrowserType } from '@scrapper-gate/shared/schema';

export interface MessageQueueServiceDependencies {
  messageQueue: MessageQueue;
  chromiumScraperQueueUrl: string;
  mozillaScrapperQueueUrl: string;
  webkitScrapperQueueUrl: string;
}

export class MessageQueueService {
  private static groupIds = {
    scrapperRunner: 'scrapperRunner',
  };

  constructor(private readonly dependencies: MessageQueueServiceDependencies) {}

  async sendToScrapperQueue(
    message: Message<ScrapperRunnerMessagePayload>,
    type: BrowserType
  ) {
    const queueUrl = this.getScrapperQueueUrlByBrowser(type);

    await this.dependencies.messageQueue.push({
      message,
      queueUrl,
      groupId: MessageQueueService.groupIds.scrapperRunner,
    });
  }

  get queueUrls() {
    return [
      this.dependencies.chromiumScraperQueueUrl,
      this.dependencies.mozillaScrapperQueueUrl,
      this.dependencies.webkitScrapperQueueUrl,
    ];
  }

  private getScrapperQueueUrlByBrowser(type: BrowserType) {
    switch (type) {
      case BrowserType.Chrome:
        return this.dependencies.chromiumScraperQueueUrl;

      case BrowserType.Firefox:
        return this.dependencies.mozillaScrapperQueueUrl;

      case BrowserType.Safari:
        return this.dependencies.webkitScrapperQueueUrl;

      default:
        throw new TypeError('Invalid browser type provided.');
    }
  }
}
