import { RunnerPerformanceEntry } from '@scrapper-gate/shared/schema';
import { AppError } from '../AppError';

export interface ScrapperRunErrorParams {
  message: string;
  performance: RunnerPerformanceEntry;
  url: string;
  browserVersion: string;
}

export class ScrapperRunError extends AppError {
  readonly performance: RunnerPerformanceEntry;
  readonly url: string;
  readonly browserVersion: string;

  constructor({
    message,
    performance,
    url,
    browserVersion,
  }: ScrapperRunErrorParams) {
    super(message, 'ScrapperRunError');

    this.performance = performance;
    this.url = url;
    this.browserVersion = browserVersion;
  }
}
