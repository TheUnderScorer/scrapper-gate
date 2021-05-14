import { ConditionalRuleInput } from '@scrapper-gate/shared/schema';
import { ConditionalRuleValue, WhatValue } from '@scrapper-gate/shared/schema';
import * as jf from 'joiful';
import { BaseSchema } from '../../BaseSchema';
import { uuid } from '../../decorators/uuid';

export class ConditionalRuleInputDto
  extends BaseSchema<ConditionalRuleInput>
  implements ConditionalRuleInput {
  @(uuid().required())
  id: string;

  @(jf.string().allow(null))
  type?: string;

  @jf.any()
  value?: ConditionalRuleValue;

  @jf.any()
  whatValue?: WhatValue;

  @(jf.string().allow(null))
  when?: string;

  @jf.any()
  meta?: unknown;

  @(jf.string().allow(null, ''))
  what?: string;
}
