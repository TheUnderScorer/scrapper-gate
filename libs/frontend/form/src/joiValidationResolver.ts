import { logger } from '@scrapper-gate/shared/logger/console';
import {
  BaseSchemaConstructor,
  ValidationError as AppValidationError,
} from '@scrapper-gate/shared/validation';
import { ValidationErrors } from 'final-form';
import { ValidationOptions } from 'joiful/validation';
import set from 'lodash.set';

export const joiValidationResolver = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: BaseSchemaConstructor<any>,
  joiOptions?: ValidationOptions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => (data: any): ValidationErrors => {
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
