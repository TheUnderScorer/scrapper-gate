import { ErrorObject } from '@scrapper-gate/shared/schema';
import { AppError } from './AppError';

export class ErrorObjectDto implements ErrorObject {
  message?: string;

  name: string;

  date: Date;

  static createFromError(error: Error) {
    const obj = new this();

    obj.message = error.message;
    obj.name = error.name;
    obj.date = error instanceof AppError ? error.date : new Date();

    return obj;
  }
}
