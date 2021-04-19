import { Resolvers } from '@scrapper-gate/shared/schema';
import { BaseApolloContext } from '@scrapper-gate/backend/server';
import {
  CreateScrapperCommand,
  GetScrappersByUserQuery,
} from '@scrapper-gate/backend/domain/scrapper';
import { UserModel } from '@scrapper-gate/backend/domain/user';

export const scrapperResolver = (): Resolvers<
  BaseApolloContext<UserModel>
> => ({
  Query: {
    getMyScrappers: (_, args, ctx) =>
      ctx.unitOfWork.run(({ queriesBus }) =>
        queriesBus.query(
          new GetScrappersByUserQuery({
            ...args,
            userId: ctx.user.id,
          })
        )
      ),
  },
  Mutation: {
    createScrapper: (_, args, ctx) =>
      ctx.unitOfWork.run(({ commandsBus }) =>
        commandsBus.execute(
          new CreateScrapperCommand({
            input: args.input,
            user: ctx.user,
          })
        )
      ),
  },
  Scrapper: {
    name: (root) => root.name ?? 'Unnamed scrapper',
  },
});
