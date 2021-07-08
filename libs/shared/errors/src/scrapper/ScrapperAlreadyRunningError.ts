import { AppError } from '../AppError';
export class ScrapperAlreadyRunningError extends AppError {
  constructor() {
    super('This scrapper is already running', 'ScrapperAlreadyRunningError');
  }
}
