import {
  ConditionalRuleCondition,
  ConditionalRuleType,
} from '@scrapper-gate/shared/schema';
import { enumField } from '../../modifiers/enum';

export const getBaseConditionalRuleMap = (type?: ConditionalRuleType) => {
  let ruleType = enumField(ConditionalRuleType).required();

  if (type) {
    ruleType = ruleType.valid(type);
  }

  return {
    ruleType,
    condition: enumField(ConditionalRuleCondition).required(),
  };
};
