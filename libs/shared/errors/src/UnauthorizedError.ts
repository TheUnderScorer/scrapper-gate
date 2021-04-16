import { HttpError } from './HttpError';
import { StatusCodes } from 'http-status-codes';

export class UnauthorizedError extends HttpError {
  constructor() {
    super(
      'You must be authorized to do that.',
      StatusCodes.UNAUTHORIZED,
      'UnauthorizedError'
    );
  }
}
