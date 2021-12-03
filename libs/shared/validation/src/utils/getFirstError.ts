import { first } from '@scrapper-gate/shared/common';
import Joi from 'joi';

export const getFirstError = (
  helpers: Joi.CustomHelpers,
  result: Joi.ValidationResult
) => {
  if (!result.error) {
    throw new TypeError('Validation errors are not present.');
  }

  return helpers.error(first(result.error.details).type);
};
