import { containsVariableKey } from '@scrapper-gate/shared/domain/variables';
import * as jf from 'joiful';
import { JoiMessages } from '../types';
import { validationMessages } from '../validationMessages';

export interface NoSpecialCharsParams {
  // Using .max() from joiful causes the validation to always fail
  max: number;
  supportsVariables?: boolean;
}

// TODO What's left - add variable support to remaining scrapper fields (especially conditional ones)
// Note: in date group we should validate if selected variable type is "Date"
// Also probably some tests will need to be adjusted ;)
export const noSpecialChars = ({
  max,
  supportsVariables,
}: NoSpecialCharsParams) =>
  jf.string().custom(({ joi }) => {
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
  });
