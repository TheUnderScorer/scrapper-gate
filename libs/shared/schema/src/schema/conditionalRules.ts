import gql from 'graphql-tag';

export const conditionalRulesSchema = gql`
  scalar WhatValue
  scalar ConditionalRuleValue
  scalar ConditionalMetaData

  type ConditionalRule {
    when: String
    whatValue: WhatValue
    value: ConditionalRuleValue
    meta: ConditionalMetaData
    type: String
    what: String
  }

  enum ConditionalRuleGroupType {
    Any
    All
  }

  type ConditionalRuleGroup {
    rules: [ConditionalRule!]!
    type: ConditionalRuleGroupType!
  }

  input ConditionalRuleInput {
    when: String
    whatValue: WhatValue
    value: ConditionalRuleValue
    meta: ConditionalMetaData
    type: String
  }

  input ConditionalRuleGroupInput {
    rules: [ConditionalRuleInput!]!
    type: ConditionalRuleGroupType!
  }
`;
