import { validateAsClass } from 'joiful';
import { ValidationError } from './ValidationError';
import { Constructor } from '@scrapper-gate/shared/common';
import { JoiMessages } from './types';

export const validate = <T>(
  input: Partial<unknown>,
  classConstructor: Constructor<T>
) => {
  const result = validateAsClass(input, classConstructor, {
    abortEarly: false,
    messages: {
      [JoiMessages.Required]: 'This field is required.',
      [JoiMessages.Email]: 'Must be a valid e-mail.',
    },
  });

  if (result.error) {
    throw ValidationError.fromJoiError(result.error);
  }

  return result.value;
};
