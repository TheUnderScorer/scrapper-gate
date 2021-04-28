import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
export type Maybe<T> = T | undefined;
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
  Date: any;
  Url: any;
};

export type AuthTokens = {
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
};

export type BaseEntity = {
  id: Scalars['ID'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  deletedAt?: Maybe<Scalars['Date']>;
};

export type CreateScrapperInput = {
  name?: Maybe<Scalars['String']>;
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
  createdBy?: Maybe<User>;
};

export type ForgotPasswordInput = {
  username: Scalars['String'];
};

export type ForgotPasswordResponse = {
  error?: Maybe<Scalars['String']>;
  stack?: Maybe<Scalars['String']>;
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
};

export type MutationCreateScrapperArgs = {
  input?: Maybe<CreateScrapperInput>;
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
  getMyScrappers: ScrapperQueryResult;
  isAutenthicated?: Maybe<IsAutenthicatedResponse>;
  me?: Maybe<User>;
};

export type QueryGetMyScrapperArgs = {
  id: Scalars['ID'];
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
  Completed = 'Completed',
  Error = 'Error',
  InProgress = 'InProgress',
  Pending = 'Pending',
  Stopped = 'Stopped',
}

export type Scrapper = BaseEntity &
  CreatedBy & {
    id: Scalars['ID'];
    createdAt: Scalars['Date'];
    updatedAt: Scalars['Date'];
    isRunning?: Maybe<Scalars['Boolean']>;
    name?: Maybe<Scalars['String']>;
    state?: Maybe<RunState>;
    createdBy?: Maybe<User>;
    deletedAt?: Maybe<Scalars['Date']>;
    steps?: Maybe<Array<ScrapperStep>>;
  };

export enum ScrapperAction {
  Click = 'Click',
  Condition = 'Condition',
  GoBack = 'GoBack',
  NavigateTo = 'NavigateTo',
  ReadText = 'ReadText',
  ReloadPage = 'ReloadPage',
  Type = 'Type',
}

export type ScrapperQueryResult = {
  total: Scalars['Int'];
  items?: Maybe<Array<Scrapper>>;
};

export type ScrapperStep = BaseEntity &
  CreatedBy & {
    id: Scalars['ID'];
    createdAt: Scalars['Date'];
    updatedAt: Scalars['Date'];
    deletedAt?: Maybe<Scalars['Date']>;
    createdBy?: Maybe<User>;
    goBackSteps?: Maybe<Scalars['Int']>;
    nextStep?: Maybe<ScrapperStep>;
    mouseButton?: Maybe<MouseButton>;
    url?: Maybe<Scalars['Url']>;
    navigateToUrl?: Maybe<Scalars['Url']>;
    reloadDelay?: Maybe<Scalars['Float']>;
    typeDelay?: Maybe<Scalars['Float']>;
    useUrlFromPreviousStep?: Maybe<Scalars['Boolean']>;
    action?: Maybe<ScrapperAction>;
    selectors?: Maybe<Array<Selector>>;
  };

export type ScrapperStepInput = {
  id?: Maybe<Scalars['ID']>;
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
};

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

export type MyScrappersQueryVariables = Exact<{
  pagination?: Maybe<Pagination>;
  order?: Maybe<Order>;
}>;

export type MyScrappersQuery = {
  getMyScrappers: Pick<ScrapperQueryResult, 'total'> & {
    items?: Maybe<
      Array<Pick<Scrapper, 'id' | 'name' | 'state' | 'isRunning' | 'createdAt'>>
    >;
  };
};

export type GetScrapperForBuilderQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetScrapperForBuilderQuery = {
  getMyScrapper: Pick<
    Scrapper,
    'id' | 'createdAt' | 'isRunning' | 'name' | 'state' | 'updatedAt'
  > & {
    steps?: Maybe<
      Array<
        Pick<
          ScrapperStep,
          | 'id'
          | 'action'
          | 'createdAt'
          | 'updatedAt'
          | 'mouseButton'
          | 'navigateToUrl'
          | 'reloadDelay'
          | 'url'
          | 'useUrlFromPreviousStep'
        > & {
          nextStep?: Maybe<Pick<ScrapperStep, 'id'>>;
          selectors?: Maybe<Array<Pick<Selector, 'type' | 'value'>>>;
        }
      >
    >;
  };
};

export type CreateScrapperMutationVariables = Exact<{
  input?: Maybe<CreateScrapperInput>;
}>;

export type CreateScrapperMutation = {
  createScrapper: Pick<
    Scrapper,
    'id' | 'name' | 'createdAt' | 'updatedAt' | 'isRunning' | 'state'
  >;
};

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
    | ResolversTypes['Scrapper']
    | ResolversTypes['ScrapperStep']
    | ResolversTypes['User'];
  ID: ResolverTypeWrapper<Scalars['ID']>;
  CreateScrapperInput: CreateScrapperInput;
  CreateUserInput: CreateUserInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateUserResult: ResolverTypeWrapper<CreateUserResult>;
  CreatedBy: ResolversTypes['Scrapper'] | ResolversTypes['ScrapperStep'];
  Date: ResolverTypeWrapper<Scalars['Date']>;
  ForgotPasswordInput: ForgotPasswordInput;
  ForgotPasswordResponse: ResolverTypeWrapper<ForgotPasswordResponse>;
  IsAutenthicatedResponse: ResolverTypeWrapper<IsAutenthicatedResponse>;
  LoginInput: LoginInput;
  LoginResponse: ResolverTypeWrapper<LoginResponse>;
  MouseButton: MouseButton;
  Mutation: ResolverTypeWrapper<{}>;
  Order: Order;
  OrderDirection: OrderDirection;
  Pagination: Pagination;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Query: ResolverTypeWrapper<{}>;
  ResetPasswordInput: ResetPasswordInput;
  ResetPasswordResponse: ResolverTypeWrapper<ResetPasswordResponse>;
  RunState: RunState;
  Scrapper: ResolverTypeWrapper<Scrapper>;
  ScrapperAction: ScrapperAction;
  ScrapperQueryResult: ResolverTypeWrapper<ScrapperQueryResult>;
  ScrapperStep: ResolverTypeWrapper<ScrapperStep>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ScrapperStepInput: ScrapperStepInput;
  Selector: ResolverTypeWrapper<Selector>;
  SelectorInput: SelectorInput;
  SelectorType: SelectorType;
  Subscription: ResolverTypeWrapper<{}>;
  Url: ResolverTypeWrapper<Scalars['Url']>;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthTokens: AuthTokens;
  String: Scalars['String'];
  BaseEntity:
    | ResolversParentTypes['Scrapper']
    | ResolversParentTypes['ScrapperStep']
    | ResolversParentTypes['User'];
  ID: Scalars['ID'];
  CreateScrapperInput: CreateScrapperInput;
  CreateUserInput: CreateUserInput;
  Boolean: Scalars['Boolean'];
  CreateUserResult: CreateUserResult;
  CreatedBy:
    | ResolversParentTypes['Scrapper']
    | ResolversParentTypes['ScrapperStep'];
  Date: Scalars['Date'];
  ForgotPasswordInput: ForgotPasswordInput;
  ForgotPasswordResponse: ForgotPasswordResponse;
  IsAutenthicatedResponse: IsAutenthicatedResponse;
  LoginInput: LoginInput;
  LoginResponse: LoginResponse;
  Mutation: {};
  Order: Order;
  Pagination: Pagination;
  Int: Scalars['Int'];
  Query: {};
  ResetPasswordInput: ResetPasswordInput;
  ResetPasswordResponse: ResetPasswordResponse;
  Scrapper: Scrapper;
  ScrapperQueryResult: ScrapperQueryResult;
  ScrapperStep: ScrapperStep;
  Float: Scalars['Float'];
  ScrapperStepInput: ScrapperStepInput;
  Selector: Selector;
  SelectorInput: SelectorInput;
  Subscription: {};
  Url: Scalars['Url'];
  User: User;
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

export type AuthTokensResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AuthTokens'] = ResolversParentTypes['AuthTokens']
> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BaseEntityResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['BaseEntity'] = ResolversParentTypes['BaseEntity']
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    'Scrapper' | 'ScrapperStep' | 'User',
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
}>;

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
    'Scrapper' | 'ScrapperStep',
    ParentType,
    ContextType
  >;
  createdBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
}>;

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type ForgotPasswordResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ForgotPasswordResponse'] = ResolversParentTypes['ForgotPasswordResponse']
> = ResolversObject<{
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stack?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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
    RequireFields<MutationCreateScrapperArgs, never>
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

export type ResetPasswordResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ResetPasswordResponse'] = ResolversParentTypes['ResetPasswordResponse']
> = ResolversObject<{
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stack?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  state?: Resolver<Maybe<ResolversTypes['RunState']>, ParentType, ContextType>;
  createdBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  steps?: Resolver<
    Maybe<Array<ResolversTypes['ScrapperStep']>>,
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

export type ScrapperStepResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ScrapperStep'] = ResolversParentTypes['ScrapperStep']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  createdBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  goBackSteps?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  nextStep?: Resolver<
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
  useUrlFromPreviousStep?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  action?: Resolver<
    Maybe<ResolversTypes['ScrapperAction']>,
    ParentType,
    ContextType
  >;
  selectors?: Resolver<
    Maybe<Array<ResolversTypes['Selector']>>,
    ParentType,
    ContextType
  >;
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

export type Resolvers<ContextType = any> = ResolversObject<{
  AuthTokens?: AuthTokensResolvers<ContextType>;
  BaseEntity?: BaseEntityResolvers<ContextType>;
  CreateUserResult?: CreateUserResultResolvers<ContextType>;
  CreatedBy?: CreatedByResolvers<ContextType>;
  Date?: GraphQLScalarType;
  ForgotPasswordResponse?: ForgotPasswordResponseResolvers<ContextType>;
  IsAutenthicatedResponse?: IsAutenthicatedResponseResolvers<ContextType>;
  LoginResponse?: LoginResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  ResetPasswordResponse?: ResetPasswordResponseResolvers<ContextType>;
  Scrapper?: ScrapperResolvers<ContextType>;
  ScrapperQueryResult?: ScrapperQueryResultResolvers<ContextType>;
  ScrapperStep?: ScrapperStepResolvers<ContextType>;
  Selector?: SelectorResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Url?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
}>;

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = any> = ResolversObject<{
  auth?: AuthDirectiveResolver<any, any, ContextType>;
  rest?: RestDirectiveResolver<any, any, ContextType>;
}>;

/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<
  ContextType = any
> = DirectiveResolvers<ContextType>;
