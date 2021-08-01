import {
  CreateScrapperCommand,
  GetScrapperByUserQuery,
  GetScrapperLastRunQuery,
  GetScrappersByUserQuery,
  SendScrapperToRunnerQueueCommand,
  UpdateScrapperCommand,
} from '@scrapper-gate/backend/domain/scrapper';
import { Resolvers } from '@scrapper-gate/shared/schema';
import { ServerContext } from '../../context';

export const scrapperResolver = (): Resolvers<ServerContext> => ({
  Query: {
    getMyScrappers: (_, args, ctx) =>
      ctx.unitOfWork.run(({ queriesBus }) =>
        queriesBus.query(
          new GetScrappersByUserQuery({
            ...args,
            userId: ctx.user!.id,
          })
        )
      ),
    getMyScrapper: (_, args, ctx) =>
      ctx.unitOfWork.run(({ queriesBus }) =>
        queriesBus.query(
          new GetScrapperByUserQuery({
            scrapperId: args.id,
            userId: ctx.user!.id,
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
            user: ctx.user!,
          })
        )
      ),
    updateScrapper: (_, args, ctx) =>
      ctx.unitOfWork.run(({ commandsBus }) =>
        commandsBus.execute(
          new UpdateScrapperCommand({
            input: args.input,
            userId: ctx.user!.id,
          })
        )
      ),
    sendScrapperToRunnerQueue: (_, args, ctx) =>
      ctx.unitOfWork.run(({ commandsBus }) =>
        commandsBus.execute(
          new SendScrapperToRunnerQueueCommand({
            userId: ctx.user!.id,
            input: args.input,
          })
        )
      ),
  },
  Scrapper: {
    name: (root) => root.name || 'Unnamed scrapper',
    lastRun: async (root, _, { unitOfWork }) =>
      unitOfWork.run(
        ({ queriesBus }) =>
          queriesBus.query(
            new GetScrapperLastRunQuery({
              scrapperId: root.id,
            })
          ),
        {
          runInTransaction: false,
        }
      ),
  },
});
