import { HttpError } from '@scrapper-gate/shared/errors';
import { StatusCodes } from 'http-status-codes';

export class PageMissingError extends HttpError {
  constructor() {
    super(
      'Page was closed or was not initialized properly.',
      StatusCodes.BAD_REQUEST,
      'PageMissingError'
    );
  }
}
