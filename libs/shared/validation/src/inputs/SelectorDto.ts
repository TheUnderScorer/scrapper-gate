import { Selector, SelectorType } from '@scrapper-gate/shared/schema';
import { optionalEnum } from '../decorators/enum';
import * as jf from 'joiful';
import { BaseSchema } from '../BaseSchema';

export class SelectorDto extends BaseSchema<Selector> implements Selector {
  @optionalEnum(SelectorType)
  type?: SelectorType;

  @(jf.string().required())
  value: string;
}
