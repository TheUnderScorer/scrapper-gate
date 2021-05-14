import gql from 'graphql-tag';

export const conditionalRulesSchema = gql`
  scalar WhatValue
  scalar ConditionalRuleValue
  scalar ConditionalMetaData

  type ConditionalRule {
    id: ID!
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
    id: ID!
    rules: [ConditionalRule!]!
    type: ConditionalRuleGroupType!
  }

  input ConditionalRuleInput {
    id: ID!
    when: String
    whatValue: WhatValue
    value: ConditionalRuleValue
    meta: ConditionalMetaData
    what: String
    type: String
  }

  input ConditionalRuleGroupInput {
    id: ID!
    rules: [ConditionalRuleInput!]!
    type: ConditionalRuleGroupType!
  }
`;
