import { RunnerPerformanceEntry } from '@scrapper-gate/shared/schema';
import { AppError } from '../AppError';

export interface ScrapperRunErrorParams {
  message: string;
  performance: RunnerPerformanceEntry;
}

export class ScrapperRunError extends AppError {
  readonly performance: RunnerPerformanceEntry;

  constructor({ message, performance }: ScrapperRunErrorParams) {
    super(message, 'ScrapperRunError');

    this.performance = performance;
  }
}
