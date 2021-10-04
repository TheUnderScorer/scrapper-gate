import {
  CreateScrapperCommand,
  GetMyScrapperRunQuery,
  GetScrapperByUserQuery,
  GetScrapperLastRunQuery,
  GetScrapperRunsByUserQuery,
  GetScrappersByUserQuery,
  SendScrapperToRunnerQueueCommand,
  UpdateScrapperCommand,
} from '@scrapper-gate/backend/domain/scrapper';
import { ExcludeFalsy } from '@scrapper-gate/shared/common';
import { ScrapperRunResultKeyPairValues } from '@scrapper-gate/shared/domain/scrapper';
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
    getMyScrapperRuns: (_, args, ctx) =>
      ctx.unitOfWork.run(({ queriesBus }) =>
        queriesBus.query(
          new GetScrapperRunsByUserQuery({
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
    getMyScrapperRun: (_, args, ctx) =>
      ctx.unitOfWork.run(
        ({ queriesBus }) =>
          queriesBus.query(
            new GetMyScrapperRunQuery({
              id: args.id,
              userId: ctx.user!.id,
            })
          ),
        {
          runInTransaction: false,
        }
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
  ScrapperRun: {
    name: (root) => `Run #${root.index}`,
    keyPairValues: (root) => {
      if (!root.results?.length) {
        return null;
      }

      const result = root.results.reduce<ScrapperRunResultKeyPairValues>(
        (acc, result) => {
          const key = result.step?.key;

          if (!key) {
            return acc;
          }

          const values = result.values
            ?.map((value) => value.value)
            .filter(ExcludeFalsy);

          if (values?.length) {
            acc[key] = values;
          }

          return acc;
        },
        {}
      );

      const isEmpty = Object.values(result).every((item) => !item.length);

      return isEmpty ? null : result;
    },
  },
  ScrapperRunStepResult: {
    screenshots: (result) =>
      result.values?.map((value) => value.screenshot).filter(ExcludeFalsy),
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
