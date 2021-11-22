import {
  ConditionalRuleGroup,
  ConditionalRuleGroupMatchType,
} from '@scrapper-gate/shared/schema';
import { ResolveConditionResult, RuleResolver, RuleResolvers } from './types';

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
    if (!group.rules) {
      continue;
    }

    if (result) {
      return {
        result,
      };
    }

    for (const rule of group.rules) {
      const resolver = resolvers[rule.ruleType] as RuleResolver<
        typeof rule.ruleType
      >;

      if (!resolver) {
        continue;
      }

      result = await resolver(rule);

      if (
        (result && group.matchType === ConditionalRuleGroupMatchType.Any) ||
        (!result && group.matchType === ConditionalRuleGroupMatchType.All)
      ) {
        break;
      }
    }
  }

  return {
    result,
  };
};
