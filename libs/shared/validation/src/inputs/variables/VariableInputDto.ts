import {
  VariableInput,
  VariableScope,
  VariableType,
} from '@scrapper-gate/shared/schema';
import { BaseSchema } from '../../BaseSchema';
import { optionalEnum, requiredEnum } from '../../decorators/enum';
import { noSpecialChars } from '../../decorators/noSpecialChars';
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

  @(noSpecialChars({ max: 40 }).allow(null, ''))
  key?: string;
}
