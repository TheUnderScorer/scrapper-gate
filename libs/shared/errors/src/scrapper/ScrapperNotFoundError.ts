import { HttpError } from '@scrapper-gate/shared/errors';
import { StatusCodes } from 'http-status-codes';

export class ScrapperNotFoundError extends HttpError {
  constructor() {
    super(
      'Provided scrapper does not exist.',
      StatusCodes.NOT_FOUND,
      'ScrapperNotFoundError'
    );
  }
}
