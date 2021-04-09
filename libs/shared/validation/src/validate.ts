import { validateAsClass } from 'joiful';
import { ValidationError } from './ValidationError';
import { Constructor } from '@scrapper-gate/shared/common';

export const validate = <T>(
  input: Partial<unknown>,
  classConstructor: Constructor<T>
) => {
  const result = validateAsClass(input, classConstructor, {
    abortEarly: false,
    messages: {
      'any.required': 'This field is required.',
      'string.email': 'Must be a valid e-mail.',
    },
  });

  if (result.error) {
    throw ValidationError.fromJoiError(result.error);
  }

  return result.value;
};
