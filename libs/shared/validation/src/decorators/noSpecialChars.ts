import { isVariableKey } from '@scrapper-gate/shared/domain/variables';
import * as jf from 'joiful';
import { JoiMessages } from '../types';
import { validationMessages } from '../validationMessages';

export interface NoSpecialCharsParams {
  // Using .max() from joiful causes the validation to always fail
  max?: number;
}

export const noSpecialChars = ({ max }: NoSpecialCharsParams = {}) =>
  jf.string().custom(({ joi }) => {
    return joi.string().custom((value) => {
      if (isVariableKey(value)) {
        return value;
      }

      const result = joi
        .string()
        .regex(/^(\d|\w)+$/, JoiMessages.NoSpecialChars)
        .message(validationMessages[JoiMessages.NoSpecialChars])
        .max(max)
        .validate(value);

      if (result.error) {
        throw result.error;
      }

      return value;
    });
  });
