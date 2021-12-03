import { logger } from '@scrapper-gate/shared/logger/console';
import {
  validate,
  ValidateParams,
  ValidationError as AppValidationError,
} from '@scrapper-gate/shared/validation';
import { ValidationErrors } from 'final-form';
import { AnySchema } from 'joi';
import set from 'lodash.set';

export const joiValidationResolver =
  <Schema extends AnySchema>(schema: Schema, joiOptions?: ValidateParams) =>
  (data: unknown): ValidationErrors => {
    try {
      logger.debug('Validating:', data);

      validate(data, schema, joiOptions);

      return {};
    } catch (error) {
      const result = {};

      if (!(error instanceof AppValidationError)) {
        throw error;
      }

      error.details.forEach((detail) => {
        const path = Array.isArray(detail.path)
          ? detail.path.join('.')
          : detail.path;

        set(result, path, {
          type: detail.type ?? 'validation',
          message: detail.message,
        });
      });

      logger.debug(`Validation error:`, error);
      logger.debug('Result:', result);
      logger.debug('Values:', data);

      return result;
    }
  };
