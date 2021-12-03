import {
  ConditionalRuleCondition,
  ConditionalRuleType,
} from '@scrapper-gate/shared/schema';
import { ConditionalRuleDefinition } from './conditionalRuleDefinitions';

export const ruleSupportsValue = <RuleType extends ConditionalRuleType>(
  definition: ConditionalRuleDefinition<RuleType>,
  condition: ConditionalRuleCondition
) => {
  if (!definition.valueSupportedConditions) {
    return true;
  }

  return definition.valueSupportedConditions.includes(condition);
};
