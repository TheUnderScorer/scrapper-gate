import {
  CreateScrapperCommand,
  GetScrapperByUserQuery,
  GetScrappersByUserQuery,
  UpdateScrapperCommand,
} from '@scrapper-gate/backend/domain/scrapper';
import { Resolvers } from '@scrapper-gate/shared/schema';
import { SendScrapperToRunnerQueueCommand } from '../../../../../libs/backend/domain/scrapper/src/commands/SendScrapperToRunnerQueue.command';
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
    name: (root) => root.name ?? 'Unnamed scrapper',
  },
});
