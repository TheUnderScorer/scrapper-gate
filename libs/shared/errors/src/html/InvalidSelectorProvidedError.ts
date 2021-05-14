import { AppError } from '../AppError';

export class InvalidSelectorProvidedError extends AppError {
  constructor() {
    super('Invalid selector provided.', 'InvalidSelectorProviderError');
  }
}
