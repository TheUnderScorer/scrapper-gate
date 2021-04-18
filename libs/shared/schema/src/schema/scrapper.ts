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

  type ScrapperQueryResult {
    total: Int!
    items: [Scrapper!]
  }

  type ScrapperStep implements BaseEntity & CreatedBy {
    id: ID!
    createdAt: Date!
    updatedAt: Date!
    deletedAt: Date
    createdBy: User
    goBackSteps: Int
    nextStep: ScrapperStep
    mouseButton: MouseButton
    url: Url
    navigateToUrl: Url
    reloadDelay: Float
    typeDelay: Float
    useUrlFromPreviousStep: Boolean
    action: ScrapperAction
    selectors: [Selector!]
  }

  input ScrapperStepInput {
    id: ID
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
  }

  extend type Query {
    getMyScrappers(pagination: Pagination, order: Order): ScrapperQueryResult!
      @auth
  }
`;
