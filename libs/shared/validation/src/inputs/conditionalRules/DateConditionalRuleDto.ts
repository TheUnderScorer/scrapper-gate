import { DateConditionalRule } from '@scrapper-gate/shared/schema';
import { ConditionalRuleDto } from './ConditionalRuleDto';
import * as jf from 'joiful';

export class DateConditionalRuleDto
  extends ConditionalRuleDto
  implements DateConditionalRule
{
  @jf.date()
  expectedDate: Date;
}
