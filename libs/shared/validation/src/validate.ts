import { Constructor } from '@scrapper-gate/shared/constructor';
import { validateAsClass } from 'joiful';
import { ValidationOptions } from 'joiful/validation';
import { ValidationError } from './ValidationError';
import { validationMessages } from './validationMessages';

export const validate = <T>(
  input: Partial<unknown>,
  classConstructor: Constructor<T>,
  joiOptions?: ValidationOptions
) => {
  const result = validateAsClass(input, classConstructor, {
    abortEarly: false,

    messages: validationMessages,
    ...joiOptions,
  });

  if (result.error) {
    throw ValidationError.fromJoiError(result.error);
  }

  return result.value;
};
