import { logger } from '@scrapper-gate/shared/logger/console';
import { AnySchema, ValidationOptions } from 'joi';
import { ValidationError } from './ValidationError';
import { validationMessages } from './validationMessages';

export type ValidateParams = Omit<ValidationOptions, 'messages'>;

export const validate = <Input, Schema extends AnySchema>(
  input: Input,
  schema: Schema,
  joiOptions?: ValidateParams
) => {
  const result = schema.validate(input, {
    abortEarly: false,
    messages: validationMessages,
    ...joiOptions,
  });

  logger.debug('Validate result:', result);

  if (result.error) {
    throw ValidationError.fromJoiError(result.error);
  }

  return result.value as Input;
};
