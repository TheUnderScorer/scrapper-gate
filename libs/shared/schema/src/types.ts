import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
import { WhatValue, ConditionalRuleValue } from './scalars';
export type Maybe<T> = T | undefined | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  ConditionalMetaData: any;
  ConditionalRuleValue: ConditionalRuleValue;
  Date: Date;
  Record: any;
  ScrapperRunValueType: any;
  Url: any;
  VariableValue: any;
  WhatValue: WhatValue;
};

export type AuthTokens = {
  accessToken?: Maybe<Scalars['String']>;
  refreshToken?: Maybe<Scalars['String']>;
};

export type BaseEntity = {
  id: Scalars['ID'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  deletedAt?: Maybe<Scalars['Date']>;
};

export enum BrowserType {
  Firefox = 'Firefox',
  Chrome = 'Chrome',
  Safari = 'Safari',
}

export type ConditionalRule = {
  id: Scalars['ID'];
  when?: Maybe<Scalars['String']>;
  whatValue?: Maybe<Scalars['WhatValue']>;
  value?: Maybe<Scalars['ConditionalRuleValue']>;
  meta?: Maybe<Scalars['ConditionalMetaData']>;
  type?: Maybe<Scalars['String']>;
  what?: Maybe<Scalars['String']>;
};

export type ConditionalRuleGroup = {
  id: Scalars['ID'];
  rules: Array<ConditionalRule>;
  type: ConditionalRuleGroupType;
};

export type ConditionalRuleGroupInput = {
  id: Scalars['ID'];
  rules: Array<ConditionalRuleInput>;
  type: ConditionalRuleGroupType;
};

export enum ConditionalRuleGroupType {
  Any = 'Any',
  All = 'All',
}

export type ConditionalRuleInput = {
  id: Scalars['ID'];
  when?: Maybe<Scalars['String']>;
  whatValue?: Maybe<Scalars['WhatValue']>;
  value?: Maybe<Scalars['ConditionalRuleValue']>;
  meta?: Maybe<Scalars['ConditionalMetaData']>;
  what?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type CreateScrapperInput = {
  name?: Maybe<Scalars['String']>;
  type: ScrapperType;
};

export type CreateUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  acceptTerms: Scalars['Boolean'];
};

export type CreateUserResult = {
  user: User;
  tokens: AuthTokens;
};

export type CreatedBy = {
  createdBy: User;
};

export type Duration = {
  ms: Scalars['Float'];
  seconds: Scalars['Float'];
  minutes: Scalars['Float'];
  hours: Scalars['Float'];
  enteredUnit: DurationUnit;
};

export type DurationInput = {
  value: Scalars['Float'];
  unit: DurationUnit;
};

export enum DurationUnit {
  Milliseconds = 'Milliseconds',
  Seconds = 'Seconds',
  Minutes = 'Minutes',
  Hours = 'Hours',
}

export type ErrorObject = ErrorObjectInterface & {
  name: Scalars['String'];
  message?: Maybe<Scalars['String']>;
  date: Scalars['Date'];
};

export type ErrorObjectInterface = {
  name: Scalars['String'];
  message?: Maybe<Scalars['String']>;
  date: Scalars['Date'];
};

export type File = BaseEntity & {
  id: Scalars['ID'];
  createdAt: Scalars['Date'];
  deletedAt?: Maybe<Scalars['Date']>;
  updatedAt: Scalars['Date'];
  key: Scalars['String'];
  name: Scalars['String'];
  mimeType: Scalars['String'];
  type: FileType;
  kind: FileKind;
  access: FileAccess;
  url?: Maybe<Scalars['Url']>;
};

export enum FileAccess {
  Public = 'Public',
  Private = 'Private',
}

export enum FileKind {
  Image = 'Image',
  Video = 'Video',
  Document = 'Document',
  Other = 'Other',
}

export enum FileType {
  ScrapperScreenshot = 'ScrapperScreenshot',
}

export type ForgotPasswordInput = {
  username: Scalars['String'];
};

export type ForgotPasswordResponse = {
  error?: Maybe<Scalars['String']>;
  stack?: Maybe<Scalars['String']>;
};

export type HasStartNode = {
  startNodePosition?: Maybe<NodePosition>;
};

export type Indexable = {
  index: Scalars['Int'];
};

export type IsAutenthicatedResponse = {
  isAutenthicated?: Maybe<Scalars['Boolean']>;
};

export type LoginInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type LoginResponse = {
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
};

export enum MouseButton {
  Left = 'Left',
  Right = 'Right',
  Middle = 'Middle',
}

export type Mutation = {
  _?: Maybe<Scalars['Boolean']>;
  createScrapper: Scrapper;
  createUser: CreateUserResult;
  forgotPassword?: Maybe<ForgotPasswordResponse>;
  login?: Maybe<LoginResponse>;
  resetPassword?: Maybe<ResetPasswordResponse>;
  sendScrapperToRunnerQueue: SendScrapperToQueueResult;
  updateScrapper: Scrapper;
};

export type MutationCreateScrapperArgs = {
  input: CreateScrapperInput;
};

export type MutationCreateUserArgs = {
  input: CreateUserInput;
};

export type MutationForgotPasswordArgs = {
  input?: Maybe<ForgotPasswordInput>;
};

export type MutationLoginArgs = {
  input: LoginInput;
};

export type MutationResetPasswordArgs = {
  input?: Maybe<ResetPasswordInput>;
  token: Scalars['String'];
};

export type MutationSendScrapperToRunnerQueueArgs = {
  input: StartScrapperInput;
};

export type MutationUpdateScrapperArgs = {
  input: ScrapperInput;
};

export type NodePosition = {
  y: Scalars['Float'];
  x: Scalars['Float'];
};

export type NodePositionInput = {
  x: Scalars['Float'];
  y: Scalars['Float'];
};

export type Order = {
  direction: OrderDirection;
  column: Scalars['String'];
};

export enum OrderDirection {
  Asc = 'Asc',
  Desc = 'Desc',
}

export type Pagination = {
  take: Scalars['Int'];
  skip: Scalars['Int'];
};

export type Query = {
  _?: Maybe<Scalars['Boolean']>;
  getMyScrapper: Scrapper;
  getMyScrapperRun?: Maybe<ScrapperRun>;
  getMyScrapperRuns: ScrapperRunQueryResult;
  getMyScrappers: ScrapperQueryResult;
  isAutenthicated?: Maybe<IsAutenthicatedResponse>;
  me?: Maybe<User>;
};

export type QueryGetMyScrapperArgs = {
  id: Scalars['ID'];
};

export type QueryGetMyScrapperRunArgs = {
  id: Scalars['ID'];
};

export type QueryGetMyScrapperRunsArgs = {
  pagination?: Maybe<Pagination>;
  order?: Maybe<Order>;
};

export type QueryGetMyScrappersArgs = {
  pagination?: Maybe<Pagination>;
  order?: Maybe<Order>;
};

export type ResetPasswordInput = {
  newPassword: Scalars['String'];
};

export type ResetPasswordResponse = {
  error?: Maybe<Scalars['String']>;
  stack?: Maybe<Scalars['String']>;
};

export enum RunState {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Failed = 'Failed',
  Cancelled = 'Cancelled',
  Skipped = 'Skipped',
}

export type Runnable = {
  startedAt?: Maybe<Scalars['Date']>;
  endedAt?: Maybe<Scalars['Date']>;
  progress?: Maybe<Scalars['Float']>;
  error?: Maybe<RunnerError>;
};

export type RunnerError = ErrorObjectInterface & {
  name: Scalars['String'];
  message?: Maybe<Scalars['String']>;
  date: Scalars['Date'];
  stepId?: Maybe<Scalars['ID']>;
};

export type RunnerPerformanceEntry = {
  duration?: Maybe<Duration>;
};

export enum RunnerTrigger {
  Manual = 'Manual',
  Scheduled = 'Scheduled',
  Retry = 'Retry',
}

export type Scrapper = BaseEntity &
  CreatedBy &
  HasStartNode & {
    id: Scalars['ID'];
    createdAt: Scalars['Date'];
    updatedAt: Scalars['Date'];
    isRunning?: Maybe<Scalars['Boolean']>;
    name?: Maybe<Scalars['String']>;
    createdBy: User;
    deletedAt?: Maybe<Scalars['Date']>;
    steps?: Maybe<Array<ScrapperStep>>;
    variables?: Maybe<Array<Variable>>;
    type: ScrapperType;
    lastRun?: Maybe<ScrapperRun>;
    runSettings?: Maybe<ScrapperRunSettings>;
    startNodePosition?: Maybe<NodePosition>;
  };

export enum ScrapperAction {
  Click = 'Click',
  GoBack = 'GoBack',
  NavigateTo = 'NavigateTo',
  ReadText = 'ReadText',
  ReadAttribute = 'ReadAttribute',
  ReloadPage = 'ReloadPage',
  Type = 'Type',
  Screenshot = 'Screenshot',
  ChangeRunSettings = 'ChangeRunSettings',
  Wait = 'Wait',
  RunJavascript = 'RunJavascript',
  Condition = 'Condition',
}

export enum ScrapperDialogBehaviour {
  AlwaysConfirm = 'AlwaysConfirm',
  AlwaysReject = 'AlwaysReject',
}

export type ScrapperInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  steps?: Maybe<Array<ScrapperStepInput>>;
  variables?: Maybe<Array<VariableInput>>;
  runSettings?: Maybe<ScrapperRunSettingsInput>;
  startNodePosition?: Maybe<NodePositionInput>;
};

export enum ScrapperNoElementsFoundBehavior {
  Fail = 'Fail',
  Continue = 'Continue',
}

export type ScrapperQueryResult = {
  total: Scalars['Int'];
  items?: Maybe<Array<Scrapper>>;
};

export type ScrapperRun = BaseEntity &
  Runnable &
  CreatedBy &
  Indexable & {
    id: Scalars['ID'];
    deletedAt?: Maybe<Scalars['Date']>;
    updatedAt: Scalars['Date'];
    createdAt: Scalars['Date'];
    steps: Array<ScrapperStep>;
    state: RunState;
    endedAt?: Maybe<Scalars['Date']>;
    startedAt?: Maybe<Scalars['Date']>;
    progress?: Maybe<Scalars['Float']>;
    results?: Maybe<Array<ScrapperRunStepResult>>;
    keyPairValues?: Maybe<Scalars['Record']>;
    error?: Maybe<RunnerError>;
    key?: Maybe<Scalars['String']>;
    index: Scalars['Int'];
    name?: Maybe<Scalars['String']>;
    variables?: Maybe<Array<Variable>>;
    runSettings?: Maybe<ScrapperRunSettings>;
    scrapper?: Maybe<Scrapper>;
    createdBy: User;
  };

export type ScrapperRunQueryResult = {
  total: Scalars['Int'];
  items?: Maybe<Array<ScrapperRun>>;
};

export type ScrapperRunSettings = {
  dialogBehaviour?: Maybe<ScrapperDialogBehaviour>;
  noElementsFoundBehavior?: Maybe<ScrapperNoElementsFoundBehavior>;
  timeoutMs?: Maybe<Scalars['Float']>;
  initialUrl?: Maybe<Scalars['String']>;
  promptText?: Maybe<Scalars['String']>;
};

export type ScrapperRunSettingsInput = {
  dialogBehaviour?: Maybe<ScrapperDialogBehaviour>;
  noElementsFoundBehavior?: Maybe<ScrapperNoElementsFoundBehavior>;
  timeoutMs?: Maybe<Scalars['Float']>;
  initialUrl?: Maybe<Scalars['String']>;
  promptText?: Maybe<Scalars['String']>;
};

export type ScrapperRunStepResult = BaseEntity & {
  id: Scalars['ID'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  deletedAt?: Maybe<Scalars['Date']>;
  error?: Maybe<ErrorObject>;
  values?: Maybe<Array<ScrapperRunValue>>;
  performance?: Maybe<RunnerPerformanceEntry>;
  step: ScrapperStep;
  state: RunState;
  startedAt?: Maybe<Scalars['Date']>;
  endedAt?: Maybe<Scalars['Date']>;
  screenshots?: Maybe<Array<Maybe<File>>>;
};

export type ScrapperRunValue = BaseEntity & {
  id: Scalars['ID'];
  deletedAt?: Maybe<Scalars['Date']>;
  updatedAt: Scalars['Date'];
  createdAt: Scalars['Date'];
  value?: Maybe<Scalars['ScrapperRunValueType']>;
  sourceElement?: Maybe<ScrapperRunValueElement>;
  screenshot?: Maybe<File>;
};

export type ScrapperRunValueElement = {
  classNames?: Maybe<Array<Scalars['String']>>;
  id?: Maybe<Scalars['String']>;
  tag: Scalars['String'];
};

export type ScrapperStep = BaseEntity &
  CreatedBy & {
    id: Scalars['ID'];
    createdAt: Scalars['Date'];
    updatedAt: Scalars['Date'];
    deletedAt?: Maybe<Scalars['Date']>;
    createdBy: User;
    goBackSteps?: Maybe<Scalars['Int']>;
    nextStep?: Maybe<ScrapperStep>;
    previousSteps?: Maybe<Array<ScrapperStep>>;
    stepOnTrue?: Maybe<ScrapperStep>;
    stepOnFalse?: Maybe<ScrapperStep>;
    mouseButton?: Maybe<MouseButton>;
    url?: Maybe<Scalars['Url']>;
    navigateToUrl?: Maybe<Scalars['Url']>;
    reloadDelay?: Maybe<Scalars['Float']>;
    typeDelay?: Maybe<Scalars['Float']>;
    typeValue?: Maybe<Scalars['String']>;
    useUrlFromPreviousStep?: Maybe<Scalars['Boolean']>;
    action: ScrapperAction;
    selectors?: Maybe<Array<Selector>>;
    allSelectors?: Maybe<Array<Selector>>;
    clickTimes?: Maybe<Scalars['Int']>;
    position?: Maybe<NodePosition>;
    key?: Maybe<Scalars['String']>;
    conditionalRules?: Maybe<Array<ConditionalRuleGroup>>;
    isFirst?: Maybe<Scalars['Boolean']>;
    fullPageScreenshot?: Maybe<Scalars['Boolean']>;
    newRunSettings?: Maybe<ScrapperRunSettings>;
    attributeToRead?: Maybe<Scalars['String']>;
    valueType?: Maybe<VariableType>;
    waitType?: Maybe<ScrapperWaitType>;
    waitDuration?: Maybe<Duration>;
    waitIntervalCheck?: Maybe<Duration>;
    waitIntervalTimeout?: Maybe<Duration>;
    jsCode?: Maybe<Scalars['String']>;
  };

export type ScrapperStepInput = {
  id: Scalars['ID'];
  goBackSteps?: Maybe<Scalars['Int']>;
  nextStepId?: Maybe<Scalars['ID']>;
  mouseButton?: Maybe<MouseButton>;
  url?: Maybe<Scalars['Url']>;
  navigateToUrl?: Maybe<Scalars['Url']>;
  reloadDelay?: Maybe<Scalars['Float']>;
  typeDelay?: Maybe<Scalars['Float']>;
  useUrlFromPreviousStep?: Maybe<Scalars['Boolean']>;
  action?: Maybe<ScrapperAction>;
  selectors?: Maybe<Array<SelectorInput>>;
  clickTimes?: Maybe<Scalars['Int']>;
  position?: Maybe<NodePositionInput>;
  stepIdOnTrue?: Maybe<Scalars['ID']>;
  stepIdOnFalse?: Maybe<Scalars['ID']>;
  key?: Maybe<Scalars['String']>;
  conditionalRules?: Maybe<Array<ConditionalRuleGroupInput>>;
  isFirst?: Maybe<Scalars['Boolean']>;
  fullPageScreenshot?: Maybe<Scalars['Boolean']>;
  newRunSettings?: Maybe<ScrapperRunSettingsInput>;
  attributeToRead?: Maybe<Scalars['String']>;
  valueType?: Maybe<VariableType>;
  waitType?: Maybe<ScrapperWaitType>;
  waitDuration?: Maybe<DurationInput>;
  waitIntervalCheck?: Maybe<DurationInput>;
  waitIntervalTimeout?: Maybe<DurationInput>;
  jsCode?: Maybe<Scalars['String']>;
};

export enum ScrapperType {
  RealBrowser = 'RealBrowser',
  Simple = 'Simple',
}

export enum ScrapperWaitType {
  Condition = 'Condition',
  Time = 'Time',
}

export type Selector = {
  type?: Maybe<SelectorType>;
  value: Scalars['String'];
};

export type SelectorInput = {
  type?: Maybe<SelectorType>;
  value: Scalars['String'];
};

export enum SelectorType {
  Selector = 'Selector',
  TextContent = 'TextContent',
}

export type SendScrapperToQueueResult = {
  scrapper?: Maybe<Scrapper>;
  run?: Maybe<ScrapperRun>;
};

export type StartScrapperInput = {
  scrapperId: Scalars['ID'];
  browserType?: Maybe<BrowserType>;
  runSettings?: Maybe<ScrapperRunSettingsInput>;
};

export type Subscription = {
  _?: Maybe<Scalars['Boolean']>;
};

export type User = BaseEntity & {
  id: Scalars['ID'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  deletedAt?: Maybe<Scalars['Date']>;
  acceptTerms: Scalars['Boolean'];
};

export type Variable = BaseEntity & {
  id: Scalars['ID'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  deletedAt?: Maybe<Scalars['Date']>;
  defaultValue?: Maybe<Scalars['VariableValue']>;
  value?: Maybe<Scalars['VariableValue']>;
  key?: Maybe<Scalars['String']>;
  isBuiltIn?: Maybe<Scalars['Boolean']>;
  scope: VariableScope;
  type?: Maybe<VariableType>;
};

export type VariableInput = {
  id?: Maybe<Scalars['ID']>;
  defaultValue?: Maybe<Scalars['VariableValue']>;
  value?: Maybe<Scalars['VariableValue']>;
  key?: Maybe<Scalars['String']>;
  scope: VariableScope;
  type?: Maybe<VariableType>;
};

export enum VariableScope {
  Global = 'Global',
  Scrapper = 'Scrapper',
}

export enum VariableType {
  Text = 'Text',
  Number = 'Number',
  Date = 'Date',
}

export type GetScrapperForBuilderQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetScrapperForBuilderQuery = {
  getMyScrapper: ScrapperBuilderScrapperFragment;
};

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type GetCurrentUserQuery = {
  me?: Maybe<Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>>;
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;

export type LoginMutation = {
  login?: Maybe<Pick<LoginResponse, 'accessToken' | 'refreshToken'>>;
};

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;

export type CreateUserMutation = {
  createUser: {
    tokens: Pick<AuthTokens, 'accessToken' | 'refreshToken'>;
    user: Pick<
      User,
      'id' | 'email' | 'createdAt' | 'updatedAt' | 'acceptTerms'
    >;
  };
};

export type FileLinkFileFragment = Pick<File, 'id' | 'url' | 'name' | 'kind'>;

export type MyScrapperRunsQueryVariables = Exact<{
  pagination?: Maybe<Pagination>;
  order?: Maybe<Order>;
}>;

export type MyScrapperRunsQuery = {
  getMyScrapperRuns: Pick<ScrapperRunQueryResult, 'total'> & {
    items?: Maybe<Array<ScrapperRunListItemFragment>>;
  };
};

export type MyScrappersQueryVariables = Exact<{
  pagination?: Maybe<Pagination>;
  order?: Maybe<Order>;
}>;

export type MyScrappersQuery = {
  getMyScrappers: Pick<ScrapperQueryResult, 'total'> & {
    items?: Maybe<Array<ScrapperListItemFragment>>;
  };
};

export type SendScrapperToQueueMutationVariables = Exact<{
  input: StartScrapperInput;
}>;

export type SendScrapperToQueueMutation = {
  sendScrapperToRunnerQueue: {
    scrapper?: Maybe<ScrapperForRunFragment>;
    run?: Maybe<Pick<ScrapperRun, 'id' | 'endedAt' | 'state'>>;
  };
};

export type GetScrapperStateQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetScrapperStateQuery = { getMyScrapper: ScrapperForRunFragment };

export type ScrapperForRunFragment = Pick<
  Scrapper,
  'id' | 'isRunning' | 'name' | 'type'
> & {
  steps?: Maybe<Array<Pick<ScrapperStep, 'id'>>>;
  lastRun?: Maybe<Pick<ScrapperRun, 'id' | 'endedAt' | 'state'>>;
  runSettings?: Maybe<
    Pick<
      ScrapperRunSettings,
      | 'dialogBehaviour'
      | 'initialUrl'
      | 'noElementsFoundBehavior'
      | 'timeoutMs'
      | 'promptText'
    >
  >;
};

export type UpdateScrapperMutationVariables = Exact<{
  input: ScrapperInput;
}>;

export type UpdateScrapperMutation = {
  updateScrapper: ScrapperBuilderScrapperFragment;
};

export type ScrapperBuilderScrapperFragment = Pick<
  Scrapper,
  'id' | 'createdAt' | 'isRunning' | 'name' | 'updatedAt' | 'type'
> & {
  startNodePosition?: Maybe<Pick<NodePosition, 'x' | 'y'>>;
  lastRun?: Maybe<Pick<ScrapperRun, 'id' | 'endedAt' | 'state'>>;
  steps?: Maybe<Array<ScrapperBuilderStepFragment>>;
  runSettings?: Maybe<
    Pick<
      ScrapperRunSettings,
      | 'dialogBehaviour'
      | 'initialUrl'
      | 'noElementsFoundBehavior'
      | 'timeoutMs'
      | 'promptText'
    >
  >;
  variables?: Maybe<
    Array<
      Pick<
        Variable,
        | 'id'
        | 'createdAt'
        | 'defaultValue'
        | 'updatedAt'
        | 'isBuiltIn'
        | 'key'
        | 'scope'
        | 'type'
        | 'value'
      >
    >
  >;
};

export type ScrapperBuilderStepFragment = Pick<
  ScrapperStep,
  | 'id'
  | 'action'
  | 'key'
  | 'createdAt'
  | 'updatedAt'
  | 'mouseButton'
  | 'jsCode'
  | 'fullPageScreenshot'
  | 'isFirst'
  | 'navigateToUrl'
  | 'reloadDelay'
  | 'valueType'
  | 'url'
  | 'typeDelay'
  | 'useUrlFromPreviousStep'
  | 'attributeToRead'
  | 'waitType'
> & {
  nextStep?: Maybe<Pick<ScrapperStep, 'id'>>;
  previousSteps?: Maybe<Array<Pick<ScrapperStep, 'id'>>>;
  stepOnTrue?: Maybe<Pick<ScrapperStep, 'id'>>;
  stepOnFalse?: Maybe<Pick<ScrapperStep, 'id'>>;
  selectors?: Maybe<Array<Pick<Selector, 'type' | 'value'>>>;
  waitIntervalCheck?: Maybe<FullDurationFragment>;
  waitIntervalTimeout?: Maybe<FullDurationFragment>;
  waitDuration?: Maybe<FullDurationFragment>;
  newRunSettings?: Maybe<
    Pick<
      ScrapperRunSettings,
      'dialogBehaviour' | 'noElementsFoundBehavior' | 'promptText'
    >
  >;
  position?: Maybe<Pick<NodePosition, 'x' | 'y'>>;
  conditionalRules?: Maybe<
    Array<
      Pick<ConditionalRuleGroup, 'id' | 'type'> & {
        rules: Array<
          Pick<
            ConditionalRule,
            'id' | 'meta' | 'type' | 'value' | 'what' | 'whatValue' | 'when'
          >
        >;
      }
    >
  >;
};

export type ScrapperListItemFragment = Pick<
  Scrapper,
  'id' | 'name' | 'isRunning' | 'createdAt' | 'type'
> & {
  lastRun?: Maybe<Pick<ScrapperRun, 'id' | 'state' | 'endedAt' | 'startedAt'>>;
};

export type ScrapperRunScrapperFragment = Pick<Scrapper, 'id' | 'name'> & {
  steps?: Maybe<Array<Pick<ScrapperStep, 'id'>>>;
};

export type GetMyScrapperRunQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetMyScrapperRunQuery = {
  getMyScrapperRun?: Maybe<
    Pick<
      ScrapperRun,
      'id' | 'createdAt' | 'endedAt' | 'name' | 'state' | 'keyPairValues'
    > & {
      scrapper?: Maybe<ScrapperRunScrapperFragment>;
      error?: Maybe<Pick<RunnerError, 'date' | 'message' | 'name' | 'stepId'>>;
      steps: Array<ScrapperBuilderStepFragment>;
      results?: Maybe<
        Array<
          Pick<
            ScrapperRunStepResult,
            'id' | 'endedAt' | 'startedAt' | 'state'
          > & {
            performance?: Maybe<{ duration?: Maybe<FullDurationFragment> }>;
            step: ScrapperBuilderStepFragment;
            screenshots?: Maybe<Array<Maybe<FileLinkFileFragment>>>;
            error?: Maybe<Pick<ErrorObject, 'date' | 'message' | 'name'>>;
            values?: Maybe<
              Array<
                Pick<ScrapperRunValue, 'id' | 'value'> & {
                  screenshot?: Maybe<FileLinkFileFragment>;
                  sourceElement?: Maybe<
                    Pick<ScrapperRunValueElement, 'id' | 'classNames' | 'tag'>
                  >;
                }
              >
            >;
          }
        >
      >;
    }
  >;
};

export type ScrapperRunListItemFragment = Pick<
  ScrapperRun,
  | 'id'
  | 'createdAt'
  | 'startedAt'
  | 'endedAt'
  | 'index'
  | 'name'
  | 'state'
  | 'progress'
> & { scrapper?: Maybe<Pick<Scrapper, 'id' | 'name' | 'type'>> };

export type CreateScrapperMutationVariables = Exact<{
  input: CreateScrapperInput;
}>;

export type CreateScrapperMutation = {
  createScrapper: Pick<
    Scrapper,
    'id' | 'name' | 'createdAt' | 'updatedAt' | 'isRunning'
  >;
};

export type FullDurationFragment = Pick<
  Duration,
  'enteredUnit' | 'hours' | 'minutes' | 'ms' | 'seconds'
>;

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AuthTokens: ResolverTypeWrapper<AuthTokens>;
  String: ResolverTypeWrapper<Scalars['String']>;
  BaseEntity:
    | ResolversTypes['File']
    | ResolversTypes['Scrapper']
    | ResolversTypes['ScrapperRun']
    | ResolversTypes['ScrapperRunStepResult']
    | ResolversTypes['ScrapperRunValue']
    | ResolversTypes['ScrapperStep']
    | ResolversTypes['User']
    | ResolversTypes['Variable'];
  ID: ResolverTypeWrapper<Scalars['ID']>;
  BrowserType: BrowserType;
  ConditionalMetaData: ResolverTypeWrapper<Scalars['ConditionalMetaData']>;
  ConditionalRule: ResolverTypeWrapper<ConditionalRule>;
  ConditionalRuleGroup: ResolverTypeWrapper<ConditionalRuleGroup>;
  ConditionalRuleGroupInput: ConditionalRuleGroupInput;
  ConditionalRuleGroupType: ConditionalRuleGroupType;
  ConditionalRuleInput: ConditionalRuleInput;
  ConditionalRuleValue: ResolverTypeWrapper<Scalars['ConditionalRuleValue']>;
  CreateScrapperInput: CreateScrapperInput;
  CreateUserInput: CreateUserInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateUserResult: ResolverTypeWrapper<CreateUserResult>;
  CreatedBy:
    | ResolversTypes['Scrapper']
    | ResolversTypes['ScrapperRun']
    | ResolversTypes['ScrapperStep'];
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Duration: ResolverTypeWrapper<Duration>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  DurationInput: DurationInput;
  DurationUnit: DurationUnit;
  ErrorObject: ResolverTypeWrapper<ErrorObject>;
  ErrorObjectInterface:
    | ResolversTypes['ErrorObject']
    | ResolversTypes['RunnerError'];
  File: ResolverTypeWrapper<File>;
  FileAccess: FileAccess;
  FileKind: FileKind;
  FileType: FileType;
  ForgotPasswordInput: ForgotPasswordInput;
  ForgotPasswordResponse: ResolverTypeWrapper<ForgotPasswordResponse>;
  HasStartNode: ResolversTypes['Scrapper'];
  Indexable: ResolversTypes['ScrapperRun'];
  Int: ResolverTypeWrapper<Scalars['Int']>;
  IsAutenthicatedResponse: ResolverTypeWrapper<IsAutenthicatedResponse>;
  LoginInput: LoginInput;
  LoginResponse: ResolverTypeWrapper<LoginResponse>;
  MouseButton: MouseButton;
  Mutation: ResolverTypeWrapper<{}>;
  NodePosition: ResolverTypeWrapper<NodePosition>;
  NodePositionInput: NodePositionInput;
  Order: Order;
  OrderDirection: OrderDirection;
  Pagination: Pagination;
  Query: ResolverTypeWrapper<{}>;
  Record: ResolverTypeWrapper<Scalars['Record']>;
  ResetPasswordInput: ResetPasswordInput;
  ResetPasswordResponse: ResolverTypeWrapper<ResetPasswordResponse>;
  RunState: RunState;
  Runnable: ResolversTypes['ScrapperRun'];
  RunnerError: ResolverTypeWrapper<RunnerError>;
  RunnerPerformanceEntry: ResolverTypeWrapper<RunnerPerformanceEntry>;
  RunnerTrigger: RunnerTrigger;
  Scrapper: ResolverTypeWrapper<Scrapper>;
  ScrapperAction: ScrapperAction;
  ScrapperDialogBehaviour: ScrapperDialogBehaviour;
  ScrapperInput: ScrapperInput;
  ScrapperNoElementsFoundBehavior: ScrapperNoElementsFoundBehavior;
  ScrapperQueryResult: ResolverTypeWrapper<ScrapperQueryResult>;
  ScrapperRun: ResolverTypeWrapper<ScrapperRun>;
  ScrapperRunQueryResult: ResolverTypeWrapper<ScrapperRunQueryResult>;
  ScrapperRunSettings: ResolverTypeWrapper<ScrapperRunSettings>;
  ScrapperRunSettingsInput: ScrapperRunSettingsInput;
  ScrapperRunStepResult: ResolverTypeWrapper<ScrapperRunStepResult>;
  ScrapperRunValue: ResolverTypeWrapper<ScrapperRunValue>;
  ScrapperRunValueElement: ResolverTypeWrapper<ScrapperRunValueElement>;
  ScrapperRunValueType: ResolverTypeWrapper<Scalars['ScrapperRunValueType']>;
  ScrapperStep: ResolverTypeWrapper<ScrapperStep>;
  ScrapperStepInput: ScrapperStepInput;
  ScrapperType: ScrapperType;
  ScrapperWaitType: ScrapperWaitType;
  Selector: ResolverTypeWrapper<Selector>;
  SelectorInput: SelectorInput;
  SelectorType: SelectorType;
  SendScrapperToQueueResult: ResolverTypeWrapper<SendScrapperToQueueResult>;
  StartScrapperInput: StartScrapperInput;
  Subscription: ResolverTypeWrapper<{}>;
  Url: ResolverTypeWrapper<Scalars['Url']>;
  User: ResolverTypeWrapper<User>;
  Variable: ResolverTypeWrapper<Variable>;
  VariableInput: VariableInput;
  VariableScope: VariableScope;
  VariableType: VariableType;
  VariableValue: ResolverTypeWrapper<Scalars['VariableValue']>;
  WhatValue: ResolverTypeWrapper<Scalars['WhatValue']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthTokens: AuthTokens;
  String: Scalars['String'];
  BaseEntity:
    | ResolversParentTypes['File']
    | ResolversParentTypes['Scrapper']
    | ResolversParentTypes['ScrapperRun']
    | ResolversParentTypes['ScrapperRunStepResult']
    | ResolversParentTypes['ScrapperRunValue']
    | ResolversParentTypes['ScrapperStep']
    | ResolversParentTypes['User']
    | ResolversParentTypes['Variable'];
  ID: Scalars['ID'];
  ConditionalMetaData: Scalars['ConditionalMetaData'];
  ConditionalRule: ConditionalRule;
  ConditionalRuleGroup: ConditionalRuleGroup;
  ConditionalRuleGroupInput: ConditionalRuleGroupInput;
  ConditionalRuleInput: ConditionalRuleInput;
  ConditionalRuleValue: Scalars['ConditionalRuleValue'];
  CreateScrapperInput: CreateScrapperInput;
  CreateUserInput: CreateUserInput;
  Boolean: Scalars['Boolean'];
  CreateUserResult: CreateUserResult;
  CreatedBy:
    | ResolversParentTypes['Scrapper']
    | ResolversParentTypes['ScrapperRun']
    | ResolversParentTypes['ScrapperStep'];
  Date: Scalars['Date'];
  Duration: Duration;
  Float: Scalars['Float'];
  DurationInput: DurationInput;
  ErrorObject: ErrorObject;
  ErrorObjectInterface:
    | ResolversParentTypes['ErrorObject']
    | ResolversParentTypes['RunnerError'];
  File: File;
  ForgotPasswordInput: ForgotPasswordInput;
  ForgotPasswordResponse: ForgotPasswordResponse;
  HasStartNode: ResolversParentTypes['Scrapper'];
  Indexable: ResolversParentTypes['ScrapperRun'];
  Int: Scalars['Int'];
  IsAutenthicatedResponse: IsAutenthicatedResponse;
  LoginInput: LoginInput;
  LoginResponse: LoginResponse;
  Mutation: {};
  NodePosition: NodePosition;
  NodePositionInput: NodePositionInput;
  Order: Order;
  Pagination: Pagination;
  Query: {};
  Record: Scalars['Record'];
  ResetPasswordInput: ResetPasswordInput;
  ResetPasswordResponse: ResetPasswordResponse;
  Runnable: ResolversParentTypes['ScrapperRun'];
  RunnerError: RunnerError;
  RunnerPerformanceEntry: RunnerPerformanceEntry;
  Scrapper: Scrapper;
  ScrapperInput: ScrapperInput;
  ScrapperQueryResult: ScrapperQueryResult;
  ScrapperRun: ScrapperRun;
  ScrapperRunQueryResult: ScrapperRunQueryResult;
  ScrapperRunSettings: ScrapperRunSettings;
  ScrapperRunSettingsInput: ScrapperRunSettingsInput;
  ScrapperRunStepResult: ScrapperRunStepResult;
  ScrapperRunValue: ScrapperRunValue;
  ScrapperRunValueElement: ScrapperRunValueElement;
  ScrapperRunValueType: Scalars['ScrapperRunValueType'];
  ScrapperStep: ScrapperStep;
  ScrapperStepInput: ScrapperStepInput;
  Selector: Selector;
  SelectorInput: SelectorInput;
  SendScrapperToQueueResult: SendScrapperToQueueResult;
  StartScrapperInput: StartScrapperInput;
  Subscription: {};
  Url: Scalars['Url'];
  User: User;
  Variable: Variable;
  VariableInput: VariableInput;
  VariableValue: Scalars['VariableValue'];
  WhatValue: Scalars['WhatValue'];
}>;

export type AuthDirectiveArgs = {};

export type AuthDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = AuthDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type RestDirectiveArgs = {
  type?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  method?: Maybe<Scalars['String']>;
  endpoint?: Maybe<Scalars['String']>;
};

export type RestDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = RestDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ValidateDtoDirectiveArgs = {
  dto: Scalars['String'];
  key: Scalars['String'];
};

export type ValidateDtoDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = ValidateDtoDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AuthTokensResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AuthTokens'] = ResolversParentTypes['AuthTokens']
> = ResolversObject<{
  accessToken?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  refreshToken?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BaseEntityResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['BaseEntity'] = ResolversParentTypes['BaseEntity']
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | 'File'
    | 'Scrapper'
    | 'ScrapperRun'
    | 'ScrapperRunStepResult'
    | 'ScrapperRunValue'
    | 'ScrapperStep'
    | 'User'
    | 'Variable',
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
}>;

export interface ConditionalMetaDataScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['ConditionalMetaData'], any> {
  name: 'ConditionalMetaData';
}

export type ConditionalRuleResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ConditionalRule'] = ResolversParentTypes['ConditionalRule']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  when?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  whatValue?: Resolver<
    Maybe<ResolversTypes['WhatValue']>,
    ParentType,
    ContextType
  >;
  value?: Resolver<
    Maybe<ResolversTypes['ConditionalRuleValue']>,
    ParentType,
    ContextType
  >;
  meta?: Resolver<
    Maybe<ResolversTypes['ConditionalMetaData']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  what?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ConditionalRuleGroupResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ConditionalRuleGroup'] = ResolversParentTypes['ConditionalRuleGroup']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  rules?: Resolver<
    Array<ResolversTypes['ConditionalRule']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<
    ResolversTypes['ConditionalRuleGroupType'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface ConditionalRuleValueScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['ConditionalRuleValue'], any> {
  name: 'ConditionalRuleValue';
}

export type CreateUserResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CreateUserResult'] = ResolversParentTypes['CreateUserResult']
> = ResolversObject<{
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  tokens?: Resolver<ResolversTypes['AuthTokens'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreatedByResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CreatedBy'] = ResolversParentTypes['CreatedBy']
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    'Scrapper' | 'ScrapperRun' | 'ScrapperStep',
    ParentType,
    ContextType
  >;
  createdBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
}>;

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type DurationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Duration'] = ResolversParentTypes['Duration']
> = ResolversObject<{
  ms?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  seconds?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  minutes?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  hours?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  enteredUnit?: Resolver<
    ResolversTypes['DurationUnit'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ErrorObjectResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ErrorObject'] = ResolversParentTypes['ErrorObject']
> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ErrorObjectInterfaceResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ErrorObjectInterface'] = ResolversParentTypes['ErrorObjectInterface']
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    'ErrorObject' | 'RunnerError',
    ParentType,
    ContextType
  >;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
}>;

export type FileResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['File'] = ResolversParentTypes['File']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mimeType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['FileType'], ParentType, ContextType>;
  kind?: Resolver<ResolversTypes['FileKind'], ParentType, ContextType>;
  access?: Resolver<ResolversTypes['FileAccess'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['Url']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ForgotPasswordResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ForgotPasswordResponse'] = ResolversParentTypes['ForgotPasswordResponse']
> = ResolversObject<{
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stack?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HasStartNodeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['HasStartNode'] = ResolversParentTypes['HasStartNode']
> = ResolversObject<{
  __resolveType: TypeResolveFn<'Scrapper', ParentType, ContextType>;
  startNodePosition?: Resolver<
    Maybe<ResolversTypes['NodePosition']>,
    ParentType,
    ContextType
  >;
}>;

export type IndexableResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Indexable'] = ResolversParentTypes['Indexable']
> = ResolversObject<{
  __resolveType: TypeResolveFn<'ScrapperRun', ParentType, ContextType>;
  index?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type IsAutenthicatedResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['IsAutenthicatedResponse'] = ResolversParentTypes['IsAutenthicatedResponse']
> = ResolversObject<{
  isAutenthicated?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LoginResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['LoginResponse'] = ResolversParentTypes['LoginResponse']
> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  createScrapper?: Resolver<
    ResolversTypes['Scrapper'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateScrapperArgs, 'input'>
  >;
  createUser?: Resolver<
    ResolversTypes['CreateUserResult'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateUserArgs, 'input'>
  >;
  forgotPassword?: Resolver<
    Maybe<ResolversTypes['ForgotPasswordResponse']>,
    ParentType,
    ContextType,
    RequireFields<MutationForgotPasswordArgs, never>
  >;
  login?: Resolver<
    Maybe<ResolversTypes['LoginResponse']>,
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, 'input'>
  >;
  resetPassword?: Resolver<
    Maybe<ResolversTypes['ResetPasswordResponse']>,
    ParentType,
    ContextType,
    RequireFields<MutationResetPasswordArgs, 'token'>
  >;
  sendScrapperToRunnerQueue?: Resolver<
    ResolversTypes['SendScrapperToQueueResult'],
    ParentType,
    ContextType,
    RequireFields<MutationSendScrapperToRunnerQueueArgs, 'input'>
  >;
  updateScrapper?: Resolver<
    ResolversTypes['Scrapper'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateScrapperArgs, 'input'>
  >;
}>;

export type NodePositionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['NodePosition'] = ResolversParentTypes['NodePosition']
> = ResolversObject<{
  y?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  x?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  getMyScrapper?: Resolver<
    ResolversTypes['Scrapper'],
    ParentType,
    ContextType,
    RequireFields<QueryGetMyScrapperArgs, 'id'>
  >;
  getMyScrapperRun?: Resolver<
    Maybe<ResolversTypes['ScrapperRun']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetMyScrapperRunArgs, 'id'>
  >;
  getMyScrapperRuns?: Resolver<
    ResolversTypes['ScrapperRunQueryResult'],
    ParentType,
    ContextType,
    RequireFields<QueryGetMyScrapperRunsArgs, never>
  >;
  getMyScrappers?: Resolver<
    ResolversTypes['ScrapperQueryResult'],
    ParentType,
    ContextType,
    RequireFields<QueryGetMyScrappersArgs, never>
  >;
  isAutenthicated?: Resolver<
    Maybe<ResolversTypes['IsAutenthicatedResponse']>,
    ParentType,
    ContextType
  >;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
}>;

export interface RecordScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Record'], any> {
  name: 'Record';
}

export type ResetPasswordResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ResetPasswordResponse'] = ResolversParentTypes['ResetPasswordResponse']
> = ResolversObject<{
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stack?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RunnableResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Runnable'] = ResolversParentTypes['Runnable']
> = ResolversObject<{
  __resolveType: TypeResolveFn<'ScrapperRun', ParentType, ContextType>;
  startedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  endedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  progress?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  error?: Resolver<
    Maybe<ResolversTypes['RunnerError']>,
    ParentType,
    ContextType
  >;
}>;

export type RunnerErrorResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RunnerError'] = ResolversParentTypes['RunnerError']
> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  stepId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RunnerPerformanceEntryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RunnerPerformanceEntry'] = ResolversParentTypes['RunnerPerformanceEntry']
> = ResolversObject<{
  duration?: Resolver<
    Maybe<ResolversTypes['Duration']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ScrapperResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Scrapper'] = ResolversParentTypes['Scrapper']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  isRunning?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  steps?: Resolver<
    Maybe<Array<ResolversTypes['ScrapperStep']>>,
    ParentType,
    ContextType
  >;
  variables?: Resolver<
    Maybe<Array<ResolversTypes['Variable']>>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['ScrapperType'], ParentType, ContextType>;
  lastRun?: Resolver<
    Maybe<ResolversTypes['ScrapperRun']>,
    ParentType,
    ContextType
  >;
  runSettings?: Resolver<
    Maybe<ResolversTypes['ScrapperRunSettings']>,
    ParentType,
    ContextType
  >;
  startNodePosition?: Resolver<
    Maybe<ResolversTypes['NodePosition']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ScrapperQueryResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ScrapperQueryResult'] = ResolversParentTypes['ScrapperQueryResult']
> = ResolversObject<{
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<
    Maybe<Array<ResolversTypes['Scrapper']>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ScrapperRunResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ScrapperRun'] = ResolversParentTypes['ScrapperRun']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  steps?: Resolver<
    Array<ResolversTypes['ScrapperStep']>,
    ParentType,
    ContextType
  >;
  state?: Resolver<ResolversTypes['RunState'], ParentType, ContextType>;
  endedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  startedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  progress?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  results?: Resolver<
    Maybe<Array<ResolversTypes['ScrapperRunStepResult']>>,
    ParentType,
    ContextType
  >;
  keyPairValues?: Resolver<
    Maybe<ResolversTypes['Record']>,
    ParentType,
    ContextType
  >;
  error?: Resolver<
    Maybe<ResolversTypes['RunnerError']>,
    ParentType,
    ContextType
  >;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  index?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  variables?: Resolver<
    Maybe<Array<ResolversTypes['Variable']>>,
    ParentType,
    ContextType
  >;
  runSettings?: Resolver<
    Maybe<ResolversTypes['ScrapperRunSettings']>,
    ParentType,
    ContextType
  >;
  scrapper?: Resolver<
    Maybe<ResolversTypes['Scrapper']>,
    ParentType,
    ContextType
  >;
  createdBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ScrapperRunQueryResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ScrapperRunQueryResult'] = ResolversParentTypes['ScrapperRunQueryResult']
> = ResolversObject<{
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<
    Maybe<Array<ResolversTypes['ScrapperRun']>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ScrapperRunSettingsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ScrapperRunSettings'] = ResolversParentTypes['ScrapperRunSettings']
> = ResolversObject<{
  dialogBehaviour?: Resolver<
    Maybe<ResolversTypes['ScrapperDialogBehaviour']>,
    ParentType,
    ContextType
  >;
  noElementsFoundBehavior?: Resolver<
    Maybe<ResolversTypes['ScrapperNoElementsFoundBehavior']>,
    ParentType,
    ContextType
  >;
  timeoutMs?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  initialUrl?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  promptText?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ScrapperRunStepResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ScrapperRunStepResult'] = ResolversParentTypes['ScrapperRunStepResult']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  error?: Resolver<
    Maybe<ResolversTypes['ErrorObject']>,
    ParentType,
    ContextType
  >;
  values?: Resolver<
    Maybe<Array<ResolversTypes['ScrapperRunValue']>>,
    ParentType,
    ContextType
  >;
  performance?: Resolver<
    Maybe<ResolversTypes['RunnerPerformanceEntry']>,
    ParentType,
    ContextType
  >;
  step?: Resolver<ResolversTypes['ScrapperStep'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['RunState'], ParentType, ContextType>;
  startedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  endedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  screenshots?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['File']>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ScrapperRunValueResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ScrapperRunValue'] = ResolversParentTypes['ScrapperRunValue']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  value?: Resolver<
    Maybe<ResolversTypes['ScrapperRunValueType']>,
    ParentType,
    ContextType
  >;
  sourceElement?: Resolver<
    Maybe<ResolversTypes['ScrapperRunValueElement']>,
    ParentType,
    ContextType
  >;
  screenshot?: Resolver<Maybe<ResolversTypes['File']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ScrapperRunValueElementResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ScrapperRunValueElement'] = ResolversParentTypes['ScrapperRunValueElement']
> = ResolversObject<{
  classNames?: Resolver<
    Maybe<Array<ResolversTypes['String']>>,
    ParentType,
    ContextType
  >;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tag?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface ScrapperRunValueTypeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['ScrapperRunValueType'], any> {
  name: 'ScrapperRunValueType';
}

export type ScrapperStepResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ScrapperStep'] = ResolversParentTypes['ScrapperStep']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  goBackSteps?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  nextStep?: Resolver<
    Maybe<ResolversTypes['ScrapperStep']>,
    ParentType,
    ContextType
  >;
  previousSteps?: Resolver<
    Maybe<Array<ResolversTypes['ScrapperStep']>>,
    ParentType,
    ContextType
  >;
  stepOnTrue?: Resolver<
    Maybe<ResolversTypes['ScrapperStep']>,
    ParentType,
    ContextType
  >;
  stepOnFalse?: Resolver<
    Maybe<ResolversTypes['ScrapperStep']>,
    ParentType,
    ContextType
  >;
  mouseButton?: Resolver<
    Maybe<ResolversTypes['MouseButton']>,
    ParentType,
    ContextType
  >;
  url?: Resolver<Maybe<ResolversTypes['Url']>, ParentType, ContextType>;
  navigateToUrl?: Resolver<
    Maybe<ResolversTypes['Url']>,
    ParentType,
    ContextType
  >;
  reloadDelay?: Resolver<
    Maybe<ResolversTypes['Float']>,
    ParentType,
    ContextType
  >;
  typeDelay?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  typeValue?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  useUrlFromPreviousStep?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  action?: Resolver<ResolversTypes['ScrapperAction'], ParentType, ContextType>;
  selectors?: Resolver<
    Maybe<Array<ResolversTypes['Selector']>>,
    ParentType,
    ContextType
  >;
  allSelectors?: Resolver<
    Maybe<Array<ResolversTypes['Selector']>>,
    ParentType,
    ContextType
  >;
  clickTimes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  position?: Resolver<
    Maybe<ResolversTypes['NodePosition']>,
    ParentType,
    ContextType
  >;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  conditionalRules?: Resolver<
    Maybe<Array<ResolversTypes['ConditionalRuleGroup']>>,
    ParentType,
    ContextType
  >;
  isFirst?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  fullPageScreenshot?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  newRunSettings?: Resolver<
    Maybe<ResolversTypes['ScrapperRunSettings']>,
    ParentType,
    ContextType
  >;
  attributeToRead?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  valueType?: Resolver<
    Maybe<ResolversTypes['VariableType']>,
    ParentType,
    ContextType
  >;
  waitType?: Resolver<
    Maybe<ResolversTypes['ScrapperWaitType']>,
    ParentType,
    ContextType
  >;
  waitDuration?: Resolver<
    Maybe<ResolversTypes['Duration']>,
    ParentType,
    ContextType
  >;
  waitIntervalCheck?: Resolver<
    Maybe<ResolversTypes['Duration']>,
    ParentType,
    ContextType
  >;
  waitIntervalTimeout?: Resolver<
    Maybe<ResolversTypes['Duration']>,
    ParentType,
    ContextType
  >;
  jsCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SelectorResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Selector'] = ResolversParentTypes['Selector']
> = ResolversObject<{
  type?: Resolver<
    Maybe<ResolversTypes['SelectorType']>,
    ParentType,
    ContextType
  >;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SendScrapperToQueueResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SendScrapperToQueueResult'] = ResolversParentTypes['SendScrapperToQueueResult']
> = ResolversObject<{
  scrapper?: Resolver<
    Maybe<ResolversTypes['Scrapper']>,
    ParentType,
    ContextType
  >;
  run?: Resolver<Maybe<ResolversTypes['ScrapperRun']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']
> = ResolversObject<{
  _?: SubscriptionResolver<
    Maybe<ResolversTypes['Boolean']>,
    '_',
    ParentType,
    ContextType
  >;
}>;

export interface UrlScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Url'], any> {
  name: 'Url';
}

export type UserResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  firstName?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  acceptTerms?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VariableResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Variable'] = ResolversParentTypes['Variable']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  defaultValue?: Resolver<
    Maybe<ResolversTypes['VariableValue']>,
    ParentType,
    ContextType
  >;
  value?: Resolver<
    Maybe<ResolversTypes['VariableValue']>,
    ParentType,
    ContextType
  >;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isBuiltIn?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  scope?: Resolver<ResolversTypes['VariableScope'], ParentType, ContextType>;
  type?: Resolver<
    Maybe<ResolversTypes['VariableType']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface VariableValueScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['VariableValue'], any> {
  name: 'VariableValue';
}

export interface WhatValueScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['WhatValue'], any> {
  name: 'WhatValue';
}

export type Resolvers<ContextType = any> = ResolversObject<{
  AuthTokens?: AuthTokensResolvers<ContextType>;
  BaseEntity?: BaseEntityResolvers<ContextType>;
  ConditionalMetaData?: GraphQLScalarType;
  ConditionalRule?: ConditionalRuleResolvers<ContextType>;
  ConditionalRuleGroup?: ConditionalRuleGroupResolvers<ContextType>;
  ConditionalRuleValue?: GraphQLScalarType;
  CreateUserResult?: CreateUserResultResolvers<ContextType>;
  CreatedBy?: CreatedByResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Duration?: DurationResolvers<ContextType>;
  ErrorObject?: ErrorObjectResolvers<ContextType>;
  ErrorObjectInterface?: ErrorObjectInterfaceResolvers<ContextType>;
  File?: FileResolvers<ContextType>;
  ForgotPasswordResponse?: ForgotPasswordResponseResolvers<ContextType>;
  HasStartNode?: HasStartNodeResolvers<ContextType>;
  Indexable?: IndexableResolvers<ContextType>;
  IsAutenthicatedResponse?: IsAutenthicatedResponseResolvers<ContextType>;
  LoginResponse?: LoginResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NodePosition?: NodePositionResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Record?: GraphQLScalarType;
  ResetPasswordResponse?: ResetPasswordResponseResolvers<ContextType>;
  Runnable?: RunnableResolvers<ContextType>;
  RunnerError?: RunnerErrorResolvers<ContextType>;
  RunnerPerformanceEntry?: RunnerPerformanceEntryResolvers<ContextType>;
  Scrapper?: ScrapperResolvers<ContextType>;
  ScrapperQueryResult?: ScrapperQueryResultResolvers<ContextType>;
  ScrapperRun?: ScrapperRunResolvers<ContextType>;
  ScrapperRunQueryResult?: ScrapperRunQueryResultResolvers<ContextType>;
  ScrapperRunSettings?: ScrapperRunSettingsResolvers<ContextType>;
  ScrapperRunStepResult?: ScrapperRunStepResultResolvers<ContextType>;
  ScrapperRunValue?: ScrapperRunValueResolvers<ContextType>;
  ScrapperRunValueElement?: ScrapperRunValueElementResolvers<ContextType>;
  ScrapperRunValueType?: GraphQLScalarType;
  ScrapperStep?: ScrapperStepResolvers<ContextType>;
  Selector?: SelectorResolvers<ContextType>;
  SendScrapperToQueueResult?: SendScrapperToQueueResultResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Url?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  Variable?: VariableResolvers<ContextType>;
  VariableValue?: GraphQLScalarType;
  WhatValue?: GraphQLScalarType;
}>;

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = any> = ResolversObject<{
  auth?: AuthDirectiveResolver<any, any, ContextType>;
  rest?: RestDirectiveResolver<any, any, ContextType>;
  validateDto?: ValidateDtoDirectiveResolver<any, any, ContextType>;
}>;

/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<ContextType = any> =
  DirectiveResolvers<ContextType>;
