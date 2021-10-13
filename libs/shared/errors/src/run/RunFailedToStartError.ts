import { AppError } from '../AppError';

export class RunFailedToStartError extends AppError {
  constructor() {
    super(
      'This error failed to run due to unknown reason, please try again.',
      'RunFailedToStartError'
    );
  }
}
