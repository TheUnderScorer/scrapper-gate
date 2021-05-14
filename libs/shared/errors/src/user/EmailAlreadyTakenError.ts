import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../HttpError';

// TODO Don't use this error anywhere for security reasons
export class EmailAlreadyTakenError extends HttpError {
  constructor(email: string) {
    super(
      `Email ${email} is already taken.`,
      StatusCodes.BAD_REQUEST,
      'EmailAlreadyTakenError'
    );
  }
}
