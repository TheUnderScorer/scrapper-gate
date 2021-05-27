import * as jf from 'joiful';
import { JoiMessages } from '../types';
import { validationMessages } from '../validationMessages';

export const noSpecialChars = () =>
  jf.string().custom(({ joi }) => {
    return joi
      .string()
      .regex(/^(\d|\w)+$/, JoiMessages.NoSpecialChars)
      .message(validationMessages[JoiMessages.NoSpecialChars]);
  });
