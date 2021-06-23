import {
  Variable,
  VariableInput,
  VariableScope,
  VariableType,
} from '@scrapper-gate/shared/schema';
import { string } from 'joiful';
import { BaseSchema } from '../../BaseSchema';
import { optionalEnum, requiredEnum } from '../../decorators/enum';
import { noSpecialChars } from '../../decorators/noSpecialChars';
import { unique } from '../../decorators/unique';
import { uuid } from '../../decorators/uuid';
import { variableValue } from '../../decorators/variableValue';

export class VariableInputDto
  extends BaseSchema<VariableInputDto>
  implements VariableInput {
  @variableValue()
  value?: unknown;

  @variableValue()
  defaultValue?: unknown;

  @uuid()
  id?: string;

  @optionalEnum(VariableType)
  type?: VariableType;

  @requiredEnum(VariableScope)
  scope: VariableScope;

  @(string()
    .required()
    .custom(noSpecialChars({ max: 40 }))
    .custom(
      unique({
        getValueFromContext: (context: { variables: Variable[] }) =>
          context.variables,
        getValue: (variable) => variable.key,
        isTarget: (parent, value) => parent.id === value.id,
      })
    ))
  key?: string;
}
