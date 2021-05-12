import * as Types from '@scrapper-gate/shared/schema';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {};

export const GetScrapperForBuilderDocument = gql`
  query GetScrapperForBuilder($id: ID!) {
    getMyScrapper(id: $id) {
      id
      createdAt
      isRunning
      name
      state
      updatedAt
      steps {
        id
        action
        key
        createdAt
        updatedAt
        mouseButton
        navigateToUrl
        nextStep {
          id
        }
        previousSteps {
          id
        }
        stepOnTrue {
          id
        }
        stepOnFalse {
          id
        }
        reloadDelay
        selectors {
          type
          value
        }
        url
        typeDelay
        useUrlFromPreviousStep
        position {
          x
          y
        }
        conditionalRules {
          id
          type
          rules {
            id
            meta
            type
            value
            what
            whatValue
            when
          }
        }
      }
    }
  }
`;

/**
 * __useGetScrapperForBuilderQuery__
 *
 * To run a query within a React component, call `useGetScrapperForBuilderQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetScrapperForBuilderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetScrapperForBuilderQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetScrapperForBuilderQuery(
  baseOptions: Apollo.QueryHookOptions<
    Types.GetScrapperForBuilderQuery,
    Types.GetScrapperForBuilderQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.GetScrapperForBuilderQuery,
    Types.GetScrapperForBuilderQueryVariables
  >(GetScrapperForBuilderDocument, options);
}
export function useGetScrapperForBuilderLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.GetScrapperForBuilderQuery,
    Types.GetScrapperForBuilderQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.GetScrapperForBuilderQuery,
    Types.GetScrapperForBuilderQueryVariables
  >(GetScrapperForBuilderDocument, options);
}
export type GetScrapperForBuilderQueryHookResult = ReturnType<
  typeof useGetScrapperForBuilderQuery
>;
export type GetScrapperForBuilderLazyQueryHookResult = ReturnType<
  typeof useGetScrapperForBuilderLazyQuery
>;
export type GetScrapperForBuilderQueryResult = Apollo.QueryResult<
  Types.GetScrapperForBuilderQuery,
  Types.GetScrapperForBuilderQueryVariables
>;
export const GetCurrentUserDocument = gql`
  query GetCurrentUser {
    me {
      id
      email
      firstName
      lastName
    }
  }
`;

/**
 * __useGetCurrentUserQuery__
 *
 * To run a query within a React component, call `useGetCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentUserQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Types.GetCurrentUserQuery,
    Types.GetCurrentUserQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.GetCurrentUserQuery,
    Types.GetCurrentUserQueryVariables
  >(GetCurrentUserDocument, options);
}
export function useGetCurrentUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.GetCurrentUserQuery,
    Types.GetCurrentUserQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.GetCurrentUserQuery,
    Types.GetCurrentUserQueryVariables
  >(GetCurrentUserDocument, options);
}
export type GetCurrentUserQueryHookResult = ReturnType<
  typeof useGetCurrentUserQuery
>;
export type GetCurrentUserLazyQueryHookResult = ReturnType<
  typeof useGetCurrentUserLazyQuery
>;
export type GetCurrentUserQueryResult = Apollo.QueryResult<
  Types.GetCurrentUserQuery,
  Types.GetCurrentUserQueryVariables
>;
export const LoginDocument = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input)
      @rest(
        type: "LoginResponse"
        path: "/api/public/auth/login"
        method: "POST"
        endpoint: "default"
      ) {
      accessToken
      refreshToken
    }
  }
`;
export type LoginMutationFn = Apollo.MutationFunction<
  Types.LoginMutation,
  Types.LoginMutationVariables
>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.LoginMutation,
    Types.LoginMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<Types.LoginMutation, Types.LoginMutationVariables>(
    LoginDocument,
    options
  );
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<Types.LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<
  Types.LoginMutation,
  Types.LoginMutationVariables
>;
export const CreateUserDocument = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      tokens {
        accessToken
        refreshToken
      }
      user {
        id
        email
        createdAt
        updatedAt
        acceptTerms
      }
    }
  }
`;
export type CreateUserMutationFn = Apollo.MutationFunction<
  Types.CreateUserMutation,
  Types.CreateUserMutationVariables
>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.CreateUserMutation,
    Types.CreateUserMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Types.CreateUserMutation,
    Types.CreateUserMutationVariables
  >(CreateUserDocument, options);
}
export type CreateUserMutationHookResult = ReturnType<
  typeof useCreateUserMutation
>;
export type CreateUserMutationResult = Apollo.MutationResult<Types.CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<
  Types.CreateUserMutation,
  Types.CreateUserMutationVariables
>;
export const MyScrappersDocument = gql`
  query MyScrappers($pagination: Pagination, $order: Order) {
    getMyScrappers(order: $order, pagination: $pagination) {
      total
      items {
        id
        name
        state
        isRunning
        createdAt
      }
    }
  }
`;

/**
 * __useMyScrappersQuery__
 *
 * To run a query within a React component, call `useMyScrappersQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyScrappersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyScrappersQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      order: // value for 'order'
 *   },
 * });
 */
export function useMyScrappersQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Types.MyScrappersQuery,
    Types.MyScrappersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.MyScrappersQuery,
    Types.MyScrappersQueryVariables
  >(MyScrappersDocument, options);
}
export function useMyScrappersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.MyScrappersQuery,
    Types.MyScrappersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.MyScrappersQuery,
    Types.MyScrappersQueryVariables
  >(MyScrappersDocument, options);
}
export type MyScrappersQueryHookResult = ReturnType<typeof useMyScrappersQuery>;
export type MyScrappersLazyQueryHookResult = ReturnType<
  typeof useMyScrappersLazyQuery
>;
export type MyScrappersQueryResult = Apollo.QueryResult<
  Types.MyScrappersQuery,
  Types.MyScrappersQueryVariables
>;
export const UpdateScrapperDocument = gql`
  mutation UpdateScrapper($input: ScrapperInput!) {
    updateScrapper(input: $input) {
      id
      name
    }
  }
`;
export type UpdateScrapperMutationFn = Apollo.MutationFunction<
  Types.UpdateScrapperMutation,
  Types.UpdateScrapperMutationVariables
>;

/**
 * __useUpdateScrapperMutation__
 *
 * To run a mutation, you first call `useUpdateScrapperMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateScrapperMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateScrapperMutation, { data, loading, error }] = useUpdateScrapperMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateScrapperMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.UpdateScrapperMutation,
    Types.UpdateScrapperMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Types.UpdateScrapperMutation,
    Types.UpdateScrapperMutationVariables
  >(UpdateScrapperDocument, options);
}
export type UpdateScrapperMutationHookResult = ReturnType<
  typeof useUpdateScrapperMutation
>;
export type UpdateScrapperMutationResult = Apollo.MutationResult<Types.UpdateScrapperMutation>;
export type UpdateScrapperMutationOptions = Apollo.BaseMutationOptions<
  Types.UpdateScrapperMutation,
  Types.UpdateScrapperMutationVariables
>;
export const CreateScrapperDocument = gql`
  mutation CreateScrapper($input: CreateScrapperInput) {
    createScrapper(input: $input) {
      id
      name
      createdAt
      updatedAt
      isRunning
      state
    }
  }
`;
export type CreateScrapperMutationFn = Apollo.MutationFunction<
  Types.CreateScrapperMutation,
  Types.CreateScrapperMutationVariables
>;

/**
 * __useCreateScrapperMutation__
 *
 * To run a mutation, you first call `useCreateScrapperMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateScrapperMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createScrapperMutation, { data, loading, error }] = useCreateScrapperMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateScrapperMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.CreateScrapperMutation,
    Types.CreateScrapperMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Types.CreateScrapperMutation,
    Types.CreateScrapperMutationVariables
  >(CreateScrapperDocument, options);
}
export type CreateScrapperMutationHookResult = ReturnType<
  typeof useCreateScrapperMutation
>;
export type CreateScrapperMutationResult = Apollo.MutationResult<Types.CreateScrapperMutation>;
export type CreateScrapperMutationOptions = Apollo.BaseMutationOptions<
  Types.CreateScrapperMutation,
  Types.CreateScrapperMutationVariables
>;
