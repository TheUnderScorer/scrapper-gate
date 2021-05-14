import { Selector } from '@scrapper-gate/shared/schema';

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
  tag?: string;
}

export enum HtmlElementWhat {
  Attribute = 'Attribute',
  Tag = 'Tag',
}
