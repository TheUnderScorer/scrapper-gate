import {
  VariableInput,
  VariableScope,
  VariableType,
} from '@scrapper-gate/shared/schema';
import { BaseSchema } from '@scrapper-gate/shared/validation';
import * as jf from 'joiful';
import { optionalEnum, requiredEnum } from '../../decorators/enum';
import { noSpecialChars } from '../../decorators/noSpecialChars';
import { uuid } from '../../decorators/uuid';

export class VariableInputDto
  extends BaseSchema<VariableInputDto>
  implements VariableInput {
  @jf.any()
  value?: unknown;

  @jf.any()
  defaultValue?: unknown;

  @uuid()
  id?: string;

  @optionalEnum(VariableType)
  type?: VariableType;

  @requiredEnum(VariableScope)
  scope: VariableScope;

  @noSpecialChars({ max: 40 })
  key: string;
}
