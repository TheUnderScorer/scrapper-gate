import { AppError } from './AppError';

export class HttpError extends AppError {
  constructor(
    message: string,
    public readonly statusCode: number,
    name = 'HttpError'
  ) {
    super(message, name);
  }
}
