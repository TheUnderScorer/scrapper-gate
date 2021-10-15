import { AppError } from '../AppError';

export class NoElementsFoundError extends AppError {
  constructor() {
    super('No elements were found in this step.', 'NoElementsFoundError');
  }
}
