import gql from 'graphql-tag';

export const conditionalRulesSchema = gql`
  scalar ConditionalRuleInput
  scalar ConditionalValue

  enum ConditionalRuleCondition {
    Exists
    NotExists
    Equals
    NotEqual
    LessThan
    LessThanOrEqual
    MoreThan
    MoreThanOrEqual
    Empty
    NotEmpty
    Includes
    NotIncludes
  }

  enum HtmlConditionalRuleType {
    Tag
    Attribute
    Element
  }

  interface ConditionalRule {
    condition: ConditionalRuleCondition!
    ruleType: ConditionalRuleType!
  }

  enum ConditionalRuleType {
    Date
    HtmlElement
    Variable
  }

  type DateConditionalRule implements ConditionalRule {
    expectedDate: Date!
    condition: ConditionalRuleCondition!
    ruleType: ConditionalRuleType!
  }

  type HtmlConditionalRuleAttribute {
    attribute: String!
    value: String
  }

  type HtmlConditionalRule implements ConditionalRule {
    type: HtmlConditionalRuleType
    condition: ConditionalRuleCondition!
    selectors: [Selector!]
    attribute: HtmlConditionalRuleAttribute
    tagName: String
    ruleType: ConditionalRuleType!
    matchType: ConditionalRuleGroupMatchType
    expectedTextContent: String
  }

  type VariableConditionalRule implements ConditionalRule {
    variableKey: String!
    condition: ConditionalRuleCondition!
    ruleType: ConditionalRuleType!
    expectedValue: ConditionalValue
  }

  union ConditionalRuleUnion =
      DateConditionalRule
    | HtmlConditionalRule
    | VariableConditionalRule

  type ConditionalRuleGroup {
    rules: [ConditionalRuleUnion!]
    matchType: ConditionalRuleGroupMatchType!
  }

  enum ConditionalRuleGroupMatchType {
    Any
    All
  }

  input ConditionalRuleGroupInput {
    rules: [ConditionalRuleInput!]!
    type: ConditionalRuleGroupMatchType!
  }
`;
