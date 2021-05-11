export enum ConditionalRuleTypes {
  Date = 'Date',
  HtmlElement = 'HtmlElement',
}

export enum BaseConditionalRuleWhen {
  Exists = 'Exists',
  NotExists = 'NotExists',
  Equal = 'Equal',
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
