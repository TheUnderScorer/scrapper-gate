import {
  ConditionalRuleGroup,
  ConditionalRuleGroupType,
} from '@scrapper-gate/shared/schema';
import { ResolveConditionResult, RuleResolvers } from './types';

export interface ResolveRulesParams {
  resolvers: RuleResolvers;
  ruleGroups: ConditionalRuleGroup[];
}

export const resolveRules = async ({
  resolvers,
  ruleGroups,
}: ResolveRulesParams): Promise<ResolveConditionResult> => {
  let result = false;

  for (const group of ruleGroups) {
    for (const rule of group.rules) {
      const resolver = resolvers[rule.type];

      if (!resolver) {
        continue;
      }

      result = await resolver(rule);

      if (
        (result && group.type === ConditionalRuleGroupType.Any) ||
        (!result && group.type === ConditionalRuleGroupType.All)
      ) {
        break;
      }
    }
  }

  return {
    result,
  };
};
