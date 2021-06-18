import { AppError } from '../AppError';

export class NoActiveTabFoundError extends AppError {
  constructor() {
    super('No active tab found.', 'NoActiveTabFoundError');
  }
}
