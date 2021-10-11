import gql from 'graphql-tag';

export const scrapperSchema = gql`
  type Scrapper implements BaseEntity & CreatedBy & HasStartNode {
    id: ID!
    createdAt: Date!
    updatedAt: Date!
    isRunning: Boolean
    name: String
    createdBy: User
    deletedAt: Date
    steps: [ScrapperStep!]
    variables: [Variable!]
    type: ScrapperType!
    lastRun: ScrapperRun
    runSettings: ScrapperRunSettings
    startNodePosition: NodePosition
  }

  input ScrapperInput {
    id: ID!
    name: String
    steps: [ScrapperStepInput!]
    variables: [VariableInput!]
    runSettings: ScrapperRunSettingsInput
    startNodePosition: NodePositionInput
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
    action: ScrapperAction!
    selectors: [Selector!]
    # Aggregate of all selectors (selectors + selectors from conditional rules)
    allSelectors: [Selector!]
    clickTimes: Int
    position: NodePosition
    key: String
    conditionalRules: [ConditionalRuleGroup!]
    isFirst: Boolean
    fullPageScreenshot: Boolean
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
    isFirst: Boolean
    fullPageScreenshot: Boolean
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
    state: RunState!
    startedAt: Date
    endedAt: Date
    screenshots: [File]
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
    screenshot: File
  }

  type ScrapperRun implements BaseEntity & Runnable & CreatedBy & Indexable {
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
    keyPairValues: Record
    error: RunnerError
    key: String
    index: Int!
    name: String
    variables: [Variable!]
    runSettings: ScrapperRunSettings
    scrapper: Scrapper
    createdBy: User
  }

  enum ScrapperDialogBehaviour {
    AlwaysConfirm
    AlwaysReject
  }

  enum ScrapperNoElementsFoundBehavior {
    Fail
    Continue
  }

  type ScrapperRunSettings {
    dialogBehaviour: ScrapperDialogBehaviour
    noElementsFoundBehavior: ScrapperNoElementsFoundBehavior
    timeoutMs: Float
    initialUrl: String
  }

  input ScrapperRunSettingsInput {
    dialogBehaviour: ScrapperDialogBehaviour
    noElementsFoundBehavior: ScrapperNoElementsFoundBehavior
    timeoutMs: Float
    initialUrl: String
  }

  enum ScrapperAction {
    Click
    Condition
    GoBack
    NavigateTo
    ReadText
    ReloadPage
    Type
    Screenshot
  }

  enum ScrapperType {
    RealBrowser
    Simple
  }

  enum MouseButton {
    Left
    Right
    Middle
  }

  input CreateScrapperInput {
    name: String
    type: ScrapperType!
  }

  input StartScrapperInput {
    scrapperId: ID!
    browserType: BrowserType
  }

  type SendScrapperToQueueResult {
    scrapper: Scrapper
    run: ScrapperRun
  }

  extend type Mutation {
    createScrapper(input: CreateScrapperInput!): Scrapper! @auth
    sendScrapperToRunnerQueue(
      input: StartScrapperInput!
    ): SendScrapperToQueueResult! @auth
    updateScrapper(input: ScrapperInput!): Scrapper!
      @auth
      @validateDto(dto: "ScrapperInputDto", key: "input")
  }

  extend type Query {
    getMyScrappers(pagination: Pagination, order: Order): ScrapperQueryResult!
      @auth
    getMyScrapper(id: ID!): Scrapper! @auth
    getMyScrapperRun(id: ID!): ScrapperRun @auth
    getMyScrapperRuns(
      pagination: Pagination
      order: Order
    ): ScrapperRunQueryResult!
  }
`;
