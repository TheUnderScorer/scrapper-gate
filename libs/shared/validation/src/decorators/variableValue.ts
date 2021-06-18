import { VariableType } from '@scrapper-gate/shared/schema';
import * as jf from 'joiful';

export const variableValue = () => {
  return jf.any().custom(({ joi }) =>
    joi.any().when('type', {
      switch: [
        {
          is: VariableType.Text,
          then: joi.string().allow(null),
        },
        {
          is: VariableType.Number,
          then: joi.number().allow(null),
        },
        {
          is: VariableType.Date,
          then: joi.date().allow(null),
        },
      ],
    })
  );
};
