import {
  Variable,
  VariableInput,
  VariableScope,
  VariableType,
} from '@scrapper-gate/shared/schema';
import joi from 'joi';
import { enumField } from '../../modifiers/enum';
import { keyField } from '../../modifiers/key';
import { uuid } from '../../modifiers/uuid';
import { variableValue } from '../../modifiers/variableValue';

export const VariableInputSchema = joi.object<VariableInput>({
  id: uuid(),
  value: variableValue(),
  defaultValue: variableValue(),
  type: enumField(VariableType).required(),
  scope: enumField(VariableScope).required(),
  key: keyField({
    getValuesFromContext: (context: { variables: Variable[] }) =>
      context.variables,
    getUniqueValue: (variable) => variable.key,
    isTargetValue: (parent, value) => parent.id === value.id,
  }),
});
