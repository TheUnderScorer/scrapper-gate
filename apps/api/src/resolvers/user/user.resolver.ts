import { CreateUserCommand } from '@scrapper-gate/backend/domain/user';
import { Resolvers } from '@scrapper-gate/shared/schema';
import { ServerContext } from '../../context';

export const userResolver = (): Resolvers<ServerContext> => ({
  Query: {
    me: (_, args, ctx) => ctx.user || undefined,
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
