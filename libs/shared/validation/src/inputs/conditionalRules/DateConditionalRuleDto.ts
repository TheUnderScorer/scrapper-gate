import { DateConditionalRule } from '@scrapper-gate/shared/schema';
import * as jf from 'joiful';
import { supportsVariables } from '../../decorators/supportsVariables';
import { ConditionalRuleDto } from './ConditionalRuleDto';

export class DateConditionalRuleDto
  extends ConditionalRuleDto
  implements DateConditionalRule
{
  @supportsVariables({
    baseSchema: jf.any().required(),
    onIncludesVariableKey: (joi) => joi.string().required(),
    onNotIncludesVariableKey: (joi) => joi.date().required(),
  })
  expectedDate: Date;
}
