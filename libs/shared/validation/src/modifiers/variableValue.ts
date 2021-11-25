import { VariableType } from '@scrapper-gate/shared/schema';
import joi from 'joi';

export const variableValue = () => {
  return joi.any().when('type', {
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
  });
};
