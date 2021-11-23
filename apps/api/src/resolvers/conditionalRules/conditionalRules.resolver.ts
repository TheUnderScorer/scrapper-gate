import { ConditionalRuleType, Resolvers } from '@scrapper-gate/shared/schema';

export const conditionalRulesResolver: Resolvers = {
  ConditionalRuleUnion: {
    __resolveType: (rule) => {
      switch (rule.ruleType) {
        case ConditionalRuleType.Date:
          return 'DateConditionalRule';

        case ConditionalRuleType.Variable:
          return 'VariableConditionalRule';

        case ConditionalRuleType.HtmlElement:
          return 'HtmlConditionalRule';

        default:
          throw new TypeError(`Invalid ruleType: ${rule.ruleType}`);
      }
    },
  },
};
