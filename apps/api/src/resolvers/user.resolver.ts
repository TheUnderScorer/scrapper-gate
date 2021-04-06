import { Resolvers } from '@scrapper-gate/shared/schema';

export const userResolver = (): Resolvers => ({
  Query: {
    me: () => ({
      id: 'id',
      email: 'test@test.com',
    }),
  },
});
