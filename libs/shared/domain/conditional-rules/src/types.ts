import { MaybePromise } from '@scrapper-gate/shared/common';
import {
  ConditionalRuleGroup,
  ConditionalRuleType,
  DateConditionalRule,
  HtmlConditionalRule,
  VariableConditionalRule,
} from '@scrapper-gate/shared/schema';

export interface ResolveConditionResult {
  result: boolean;
}

export interface RuleResolverContext {
  group: ConditionalRuleGroup;
  rules: ConditionalRuleGroup[];
}

export type ConditionalRulesMap = {
  [ConditionalRuleType.Date]: DateConditionalRule;
  [ConditionalRuleType.HtmlElement]: HtmlConditionalRule;
  [ConditionalRuleType.Variable]: VariableConditionalRule;
};

export type ConditionalRule =
  | ({
      type: ConditionalRuleType.Date;
    } & DateConditionalRule)
  | ({
      type: ConditionalRuleType.HtmlElement;
    } & HtmlConditionalRule)
  | ({
      type: ConditionalRuleType.Variable;
    } & VariableConditionalRule);

export type RuleResolvers = {
  [Key in ConditionalRuleType]?: RuleResolver<Key>;
};

export type RuleResolver<Type extends ConditionalRuleType> = (
  rule: ConditionalRulesMap[Type]
) => MaybePromise<boolean>;
