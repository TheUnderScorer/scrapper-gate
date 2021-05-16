import {
  ConditionalRule,
  ConditionalRuleGroup,
  ConditionalRuleGroupType,
  Selector,
} from '@scrapper-gate/shared/schema';

export enum ConditionalRuleTypes {
  Date = 'Date',
  HtmlElement = 'HtmlElement',
}

export enum BaseConditionalRuleWhen {
  Exists = 'Exists',
  NotExists = 'NotExists',
  Equals = 'Equals',
  NotEqual = 'NotEqual',
  LessThan = 'LessThan',
  LessThanOrEqual = 'LessThanOrEqual',
  MoreThan = 'MoreThan',
  MoreThanOrEqual = 'MoreThanOrEqual',
  Empty = 'Empty',
  NotEmpty = 'NotEmpty',
  Includes = 'Includes',
  NotIncludes = 'NotIncludes',
}

export interface HtmlElementRuleMeta {
  selectors: Selector[];
  attribute?: string;
  type: ConditionalRuleGroupType;
}

export enum HtmlElementWhat {
  Attribute = 'Attribute',
  Tag = 'Tag',
}

export interface ResolveConditionResult {
  result: boolean;
}

export interface RuleResolverContext {
  group: ConditionalRuleGroup;
  rules: ConditionalRuleGroup[];
}

export type RuleResolvers = Record<string, RuleResolver>;

export type RuleResolver = (
  rule: ConditionalRule
) => boolean | Promise<boolean>;
