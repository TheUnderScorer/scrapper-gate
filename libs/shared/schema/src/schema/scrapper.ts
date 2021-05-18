import gql from 'graphql-tag';

export const scrapperSchema = gql`
  type Scrapper implements BaseEntity & CreatedBy {
    id: ID!
    createdAt: Date!
    updatedAt: Date!
    isRunning: Boolean
    name: String
    state: RunState
    createdBy: User
    deletedAt: Date
    steps: [ScrapperStep!]
  }

  input ScrapperInput {
    id: ID!
    name: String
    steps: [ScrapperStepInput!]
  }

  type ScrapperQueryResult {
    total: Int!
    items: [Scrapper!]
  }

  type ScrapperRunQueryResult {
    total: Int!
    items: [ScrapperRun!]
  }

  type ScrapperStep implements BaseEntity & CreatedBy {
    id: ID!
    createdAt: Date!
    updatedAt: Date!
    deletedAt: Date
    createdBy: User
    goBackSteps: Int
    nextStep: ScrapperStep
    previousSteps: [ScrapperStep!]
    stepOnTrue: ScrapperStep
    stepOnFalse: ScrapperStep
    mouseButton: MouseButton
    url: Url
    navigateToUrl: Url
    reloadDelay: Float
    typeDelay: Float
    typeValue: String
    useUrlFromPreviousStep: Boolean
    action: ScrapperAction
    selectors: [Selector!]
    clickTimes: Int
    position: NodePosition
    key: String
    conditionalRules: [ConditionalRuleGroup!]
    runs(pagination: Pagination, order: Order): ScrapperRunQueryResult
  }

  input ScrapperStepInput {
    id: ID!
    goBackSteps: Int
    nextStepId: ID
    mouseButton: MouseButton
    url: Url
    navigateToUrl: Url
    reloadDelay: Float
    typeDelay: Float
    useUrlFromPreviousStep: Boolean
    action: ScrapperAction
    selectors: [SelectorInput!]
    clickTimes: Int
    position: NodePositionInput
    stepIdOnTrue: ID
    stepIdOnFalse: ID
    key: String
    conditionalRules: [ConditionalRuleGroupInput!]
  }

  type ScrapperRunStepResult implements BaseEntity {
    id: ID!
    createdAt: Date!
    updatedAt: Date!
    deletedAt: Date
    error: ErrorObject
    values: [ScrapperRunValue!]
    performance: RunnerPerformanceEntry
    step: ScrapperStep!
  }

  scalar ScrapperRunValueType

  enum BrowserType {
    Firefox
    Chrome
    Safari
  }

  type ScrapperRunValueElement {
    classNames: [String!]
    id: String
    tag: String!
  }

  type ScrapperRunValue implements BaseEntity {
    id: ID!
    deletedAt: Date
    updatedAt: Date!
    createdAt: Date!
    value: ScrapperRunValueType
    sourceElement: ScrapperRunValueElement
  }

  type ScrapperRun implements BaseEntity & Runnable {
    id: ID!
    deletedAt: Date
    updatedAt: Date!
    createdAt: Date!
    steps: [ScrapperStep!]
    state: RunState!
    endedAt: Date
    startedAt: Date
    progress: Float
    results: [ScrapperRunStepResult!]
    error: RunnerError
    key: String
  }

  enum ScrapperAction {
    Click
    Condition
    GoBack
    NavigateTo
    ReadText
    ReloadPage
    Type
  }

  enum MouseButton {
    Left
    Right
    Middle
  }

  input CreateScrapperInput {
    name: String
  }

  extend type Mutation {
    createScrapper(input: CreateScrapperInput): Scrapper! @auth
    updateScrapper(input: ScrapperInput!): Scrapper! @auth
  }

  extend type Query {
    getMyScrappers(pagination: Pagination, order: Order): ScrapperQueryResult!
      @auth
    getMyScrapper(id: ID!): Scrapper! @auth
  }
`;
