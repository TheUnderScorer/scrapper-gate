import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../HttpError';

export class ScrapperNotFoundError extends HttpError {
  constructor() {
    super(
      'Provided scrapper does not exist.',
      StatusCodes.NOT_FOUND,
      'ScrapperNotFoundError'
    );
  }
}
