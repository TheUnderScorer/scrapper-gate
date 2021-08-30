import { StatusCodes } from 'http-status-codes';
import { HttpError } from './HttpError';

export class OperationTimeoutError extends HttpError {
  constructor(operation: string) {
    super(
      `Operation "${operation}" timeout.`,
      StatusCodes.REQUEST_TIMEOUT,
      'OperationTimeoutError'
    );
  }
}
