import { Resolvers } from '@scrapper-gate/shared/schema';
import { BaseApolloContent } from '@scrapper-gate/shared-backend/server';
import { CreateUserCommand } from '@scrapper-gate/shared-backend/domain/user';

export const userResolver = (): Resolvers<BaseApolloContent> => ({
  Query: {
    me: () => ({
      id: 'id',
      email: 'test@test.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  },
  Mutation: {
    createUser: (_, args, ctx) =>
      ctx.unitOfWork.run(({ commandsBus }) => {
        return commandsBus.execute(
          new CreateUserCommand({
            input: args.input,
          })
        );
      }),
  },
});
