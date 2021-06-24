import { containsVariableKey } from '@scrapper-gate/shared/domain/variables';
import { JoiMessages } from '../types';
import { validationMessages } from '../validationMessages';
import { CustomCallback } from './decorators.types';

export interface NoSpecialCharsParams {
  // Using .max() from joiful causes the validation to always fail
  max: number;
  supportsVariables?: boolean;
}

// Note: in date group we should validate if selected variable type is "Date"
export const noSpecialChars = ({
  max,
  supportsVariables,
}: NoSpecialCharsParams): CustomCallback => ({ joi }) => {
  return joi.string().custom((value) => {
    if (!value) {
      return value;
    }

    const regex =
      supportsVariables && containsVariableKey(value)
        ? /^(\d|\w|{|})+$/
        : /^(\d|\w)+$/;

    const result = joi
      .string()
      .regex(regex, JoiMessages.NoSpecialChars)
      .message(validationMessages[JoiMessages.NoSpecialChars])
      .max(max)
      .validate(value);

    if (result.error) {
      throw result.error;
    }

    return value;
  });
};
