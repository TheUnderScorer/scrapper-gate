import { HttpError } from '@scrapper-gate/shared/errors';
import { StatusCodes } from 'http-status-codes';

export class EmailAlreadyTakenError extends HttpError {
  constructor(email: string) {
    super(
      `Email ${email} is already taken.`,
      StatusCodes.BAD_REQUEST,
      'EmailAlreadyTakenError'
    );
  }
}
