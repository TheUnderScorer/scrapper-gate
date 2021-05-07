import { validateAsClass } from 'joiful';
import { ValidationError } from './ValidationError';
import { Constructor } from '@scrapper-gate/shared/constructor';
import { JoiMessages } from './types';
import { ValidationOptions } from 'joiful/validation';

export const validate = <T>(
  input: Partial<unknown>,
  classConstructor: Constructor<T>,
  joiOptions?: ValidationOptions
) => {
  const result = validateAsClass(input, classConstructor, {
    abortEarly: false,
    messages: {
      [JoiMessages.Required]: 'This field is required.',
      [JoiMessages.Email]: 'Must be a valid e-mail.',
      [JoiMessages.Uri]: 'Must be a valid url.',
    },
    ...joiOptions,
  });

  if (result.error) {
    throw ValidationError.fromJoiError(result.error);
  }

  return result.value;
};
