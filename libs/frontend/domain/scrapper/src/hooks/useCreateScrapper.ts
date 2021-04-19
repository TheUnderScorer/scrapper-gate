import { useCreateScrapperMutation } from '@scrapper-gate/frontend/schema';
import { v4 as uuid } from 'uuid';
import {
  CreateScrapperMutation,
  CreateScrapperMutationVariables,
} from '@scrapper-gate/shared/schema';
import { MutationHookOptions } from '@apollo/client';

export type UseCreateScrapperParams = Omit<
  MutationHookOptions<CreateScrapperMutation, CreateScrapperMutationVariables>,
  'refetchQueries' | 'optimisticResponse'
>;

export const useCreateScrapper = () => {
  return useCreateScrapperMutation({
    refetchQueries: ['MyScrappers'],
    optimisticResponse: (vars) => {
      return {
        __typename: 'Mutation',
        createScrapper: {
          id: uuid(),
          createdAt: new Date(),
          updatedAt: new Date(),
          name: vars.input?.name,
          __typename: 'Scrapper',
        },
      };
    },
  });
};
