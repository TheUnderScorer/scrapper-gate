import {
  findEntitiesToRemove,
  nodeLikeItemsToModels,
} from '@scrapper-gate/backend/crud';
import {
  VariableModel,
  VariableRepository,
} from '@scrapper-gate/backend/domain/variables';
import { ScrapperUpdatedEvent } from '@scrapper-gate/shared/domain/scrapper';
import { VariableScope } from '@scrapper-gate/shared/schema';
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

export const updateScrapperHandler = ({
  scrapperRepository,
  scrapperStepRepository,
  variableRepository,
}: UpdateScrapperHandlerDependencies) => async (
  { payload: { input, userId } }: UpdateScrapperCommand,
  { eventsBus }: CommandContext
) => {
  let didUpdate = false;
  let variableModels: VariableModel[] = [];

  const scrapper = await scrapperRepository.getOneByUser(input.id, userId);

  if ('name' in input) {
    scrapper.name = input.name;

    didUpdate = true;
  }

  if ('steps' in input) {
    const stepsToRemove = findEntitiesToRemove(
      input.steps ?? [],
      scrapper.steps
    );

    if (stepsToRemove.length) {
      await scrapperStepRepository.remove(stepsToRemove);
    }

    scrapper.steps = nodeLikeItemsToModels({
      createModel: (payload) => ScrapperStepModel.create(payload),
      input: input.steps ?? [],
      existingSteps: scrapper.steps,
    });

    didUpdate = true;
  }

  if ('variables' in input) {
    const variablesToRemove = findEntitiesToRemove(
      input.variables ?? [],
      scrapper.variables
    );

    if (variablesToRemove.length) {
      await variableRepository.delete(
        variablesToRemove.map((variable) => variable.id)
      );
    }

    variableModels =
      input.variables?.map((variable) =>
        VariableModel.create({
          ...variable,
          createdBy: scrapper.createdBy,
        })
      ) ?? [];

    scrapper.variables = variableModels.filter(
      (variable) => variable.scope === VariableScope.Scrapper
    );

    didUpdate = true;
  }

  if (didUpdate) {
    await scrapperRepository.save(scrapper);

    await eventsBus.dispatch(
      new ScrapperUpdatedEvent({
        scrapper,
        userId,
      })
    );
  }

  return scrapper;
};
