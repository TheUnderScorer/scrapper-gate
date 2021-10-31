import {
  findEntitiesToRemove,
  nodeLikeItemsToModels,
} from '@scrapper-gate/backend/crud';
import {
  VariableModel,
  VariableRepository,
} from '@scrapper-gate/backend/domain/variables';
import { performUpdate } from '@scrapper-gate/shared/common';
import { ScrapperUpdatedEvent } from '@scrapper-gate/shared/domain/scrapper';
import { Variable, VariableScope } from '@scrapper-gate/shared/schema';
import { CommandContext } from 'functional-cqrs';
import { UpdateScrapperCommand } from '../commands/UpdateScrapper.command';
import { ScrapperStepModel } from '../models/ScrapperStep.model';
import { ScrapperRepository } from '../repositories/Scrapper.repository';
import { ScrapperStepRepository } from '../repositories/ScrapperStep.repository';

export interface UpdateScrapperHandlerDependencies {
  scrapperRepository: ScrapperRepository;
  scrapperStepRepository: ScrapperStepRepository;
  variableRepository: VariableRepository;
}

export const updateScrapperHandler =
  ({
    scrapperRepository,
    scrapperStepRepository,
    variableRepository,
  }: UpdateScrapperHandlerDependencies) =>
  async (
    { payload: { input, userId } }: UpdateScrapperCommand,
    { eventsBus }: CommandContext
  ) => {
    const scrapper = await scrapperRepository.getOneAggregateByUser(
      input.id,
      userId
    );

    const { result: updatedScrapper, didUpdate } = await performUpdate(
      scrapper,
      input,
      {
        steps: async (scrapper, steps) => {
          const stepsToRemove = findEntitiesToRemove(
            steps ?? [],
            scrapper.steps ?? []
          );

          if (stepsToRemove.length) {
            await scrapperStepRepository.detachAll(scrapper.steps ?? []);
            await scrapperStepRepository.remove(stepsToRemove);
          }

          const existingSteps =
            scrapper.steps?.filter(
              (step) =>
                !stepsToRemove.find(
                  (stepToRemove) => stepToRemove.id === step.id
                )
            ) ?? [];

          scrapper.steps = nodeLikeItemsToModels<ScrapperStepModel>({
            createModel: (payload) => ScrapperStepModel.create(payload),
            input: steps ?? [],
            existingSteps,
          });

          return scrapper;
        },
        variables: async (scrapper, variables) => {
          const variablesToRemove = findEntitiesToRemove(
            (variables as Variable[]) ?? [],
            scrapper.variables ?? []
          );

          if (variablesToRemove.length) {
            await variableRepository.delete(
              variablesToRemove.map((variable) => variable.id)
            );
          }

          const variableModels =
            variables?.map((variable) =>
              VariableModel.create({
                ...variable,
                id: variable.id ?? undefined,
                createdBy: scrapper.createdBy,
              })
            ) ?? [];

          scrapper.variables = variableModels.filter(
            (variable) => variable.scope === VariableScope.Scrapper
          );

          return scrapper;
        },
      }
    );

    if (didUpdate) {
      await scrapperRepository.save(updatedScrapper);

      await eventsBus.dispatch(
        new ScrapperUpdatedEvent({
          scrapper: updatedScrapper,
          userId,
        })
      );
    }

    return updatedScrapper;
  };
