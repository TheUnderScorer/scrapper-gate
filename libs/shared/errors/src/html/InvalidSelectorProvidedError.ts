import { AppError } from '@scrapper-gate/shared/errors';

export class InvalidSelectorProvidedError extends AppError {
  constructor() {
    super('Invalid selector provided.', 'InvalidSelectorProviderError');
  }
}
