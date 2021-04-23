import {
  BaseSchema,
  BaseSchemaConstructor,
  ValidationError as AppValidationError,
} from '@scrapper-gate/shared/validation';
import { logger } from '@scrapper-gate/frontend/logger';
import set from 'lodash.set';
import { ValidationErrors } from 'final-form';

export const joiValidationResolver = <T>(
  schema: BaseSchemaConstructor<BaseSchema<T>>
) => async (data: unknown): Promise<ValidationErrors> => {
  try {
    schema.validate(data);

    return {
      errors: {},
    };
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

    return result;
  }
};
