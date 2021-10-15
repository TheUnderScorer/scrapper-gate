import { ErrorObject } from '@scrapper-gate/shared/schema';
import { AppError } from './AppError';

export class ErrorObjectDto implements ErrorObject {
  constructor(
    public name: string,
    public date: Date,
    public message?: string
  ) {}

  static createFromError(error: Error) {
    return new this(
      error.name,
      error instanceof AppError ? error.date : new Date(),
      error.message
    );
  }
}
