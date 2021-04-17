import { Resolvers } from '@scrapper-gate/shared/schema';
import { BaseApolloContext } from '@scrapper-gate/backend/server';
import { GetScrappersByUserQuery } from '@scrapper-gate/backend/domain/scrapper';

export const scrapperResolver = (): Resolvers<BaseApolloContext> => ({
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
});
