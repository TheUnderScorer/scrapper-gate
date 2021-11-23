import { ConditionalRule } from '@scrapper-gate/shared/domain/conditional-rules';
import {
  ConditionalRuleGroupInput,
  ConditionalRuleGroupMatchType,
  ConditionalRuleType,
} from '@scrapper-gate/shared/schema';
import { BaseSchema } from '../../BaseSchema';
import { conditionalRules } from '../../decorators/conditionalRules';
import { requiredEnum } from '../../decorators/enum';

export class ScrapperConditionalRuleGroupInputDto
  extends BaseSchema<ConditionalRuleGroupInput>
  implements ConditionalRuleGroupInput
{
  // TODO Extract this array to shared const
  @conditionalRules([
    ConditionalRuleType.Variable,
    ConditionalRuleType.Date,
    ConditionalRuleType.HtmlElement,
  ])
  rules: ConditionalRule[];

  @requiredEnum(ConditionalRuleGroupMatchType)
  matchType: ConditionalRuleGroupMatchType;
}
