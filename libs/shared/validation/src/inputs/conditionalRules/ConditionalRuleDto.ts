import {
  ConditionalRule,
  ConditionalRuleCondition,
  ConditionalRuleType,
} from '@scrapper-gate/shared/schema';
import { BaseSchema } from '../../BaseSchema';
import { requiredEnum } from '../../decorators/enum';

export class ConditionalRuleDto
  extends BaseSchema<ConditionalRuleDto>
  implements ConditionalRule
{
  @requiredEnum(ConditionalRuleCondition)
  condition: ConditionalRuleCondition;

  @requiredEnum(ConditionalRuleType)
  ruleType: ConditionalRuleType;
}
