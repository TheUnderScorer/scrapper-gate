import {
  BaseSchema,
  BaseSchemaConstructor,
  ValidationError as AppValidationError,
} from '@scrapper-gate/shared/validation';
import { logger } from '@scrapper-gate/frontend/logger';
import set from 'lodash.set';
import { ValidationErrors } from 'final-form';
import { ValidationOptions } from 'joiful/validation';

export const joiValidationResolver = <T>(
  schema: BaseSchemaConstructor<BaseSchema<T>>,
  joiOptions?: ValidationOptions
) => (data: unknown): ValidationErrors => {
  try {
    logger.debug('Validating:', data);

    schema.validate(data, joiOptions);

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
