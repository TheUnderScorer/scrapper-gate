import { Resolvers } from '@scrapper-gate/shared/schema';
import { BaseApolloContext } from '@scrapper-gate/backend/server';
import { CreateUserCommand } from '@scrapper-gate/backend/domain/user';

export const userResolver = (): Resolvers<BaseApolloContext> => ({
  Query: {
    me: (_, args, ctx) => ctx.user,
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
