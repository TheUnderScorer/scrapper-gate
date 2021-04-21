import { ResolverResult, set } from 'react-hook-form';
import {
  BaseSchema,
  BaseSchemaConstructor,
  ValidationError,
} from '@scrapper-gate/shared/validation';
import { logger } from '@scrapper-gate/frontend/logger';

export const joiValidationResolver = <T>(
  schema: BaseSchemaConstructor<BaseSchema<T>>
) => async (data: unknown): Promise<ResolverResult<T>> => {
  try {
    const values = schema.validate(data);

    return {
      values,
      errors: {},
    };
  } catch (error) {
    const result = {
      values: {},
      errors: {},
    };

    if (!(error instanceof ValidationError)) {
      throw error;
    }

    logger.error(`Validation error:`, error);

    error.details.forEach((detail) => {
      const path = Array.isArray(detail.path)
        ? detail.path.join('.')
        : detail.path;

      set(result.errors, path, {
        type: detail.type ?? 'validation',
        message: detail.message,
      });
    });

    console.log({ error, result });

    return result;
  }
};
