import { isError } from '@scrapper-gate/shared/common';
import {
  ValidationErrorItem,
  ValidationError as JoiValidationError,
} from 'joi';
import { JoiMessages } from './types';

export class ValidationError extends Error {
  constructor(message: string, readonly details: ValidationErrorItem[]) {
    super(message);
  }

  static isValidationError(error: unknown): error is ValidationError {
    return isError(error) && error instanceof ValidationError;
  }

  static fromJoiError(error: JoiValidationError) {
    return new ValidationError(
      error.message,
      error.details.flatMap((detail) => {
        if (
          detail.type === JoiMessages.Custom &&
          detail.context?.error?.details
        ) {
          const actualDetails = detail.context.error
            .details as ValidationErrorItem[];

          return actualDetails.map((actualDetail) => ({
            ...actualDetail,
            path: [...detail.path, ...actualDetail.path],
          }));
        }

        return detail;
      })
    );
  }
}
