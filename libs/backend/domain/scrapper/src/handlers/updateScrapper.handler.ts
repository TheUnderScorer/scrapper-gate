import { nodeLikeItemsToModels } from '@scrapper-gate/backend/crud';
import {
  VariableModel,
  VariableRepository,
} from '@scrapper-gate/backend/domain/variables';
import { findEntitiesToRemove } from '@scrapper-gate/shared/common';
import { commandHandler, EventsBus } from 'functional-cqrs';
import { UpdateScrapperCommand } from '../commands/UpdateScrapper.command';
import { ScrapperUpdatedEvent } from '../events/ScrapperUpdated.event';
import { ScrapperStepModel } from '../models/ScrapperStep.model';
import { ScrapperRepository } from '../repositories/Scrapper.repository';
import { ScrapperStepRepository } from '../repositories/ScrapperStep.repository';

export interface UpdateScrapperHandlerDependencies {
  scrapperRepository: ScrapperRepository;
  scrapperStepRepository: ScrapperStepRepository;
  eventsBus: EventsBus;
  variableRepository: VariableRepository;
}

export const updateScrapperHandler = commandHandler.asFunction<
  UpdateScrapperCommand,
  UpdateScrapperHandlerDependencies
>(
  UpdateScrapperCommand.name,
  async ({
    context: {
      scrapperRepository,
      eventsBus,
      scrapperStepRepository,
      variableRepository,
    },
    command: {
      payload: { input, userId },
    },
  }) => {
    let didUpdate = false;

    const scrapper = await scrapperRepository.getOneByUser(input.id, userId);

    if ('name' in input) {
      scrapper.name = input.name;

      didUpdate = true;
    }

    if ('steps' in input) {
      const stepsToRemove = findEntitiesToRemove(input.steps, scrapper.steps);

      await scrapperStepRepository.remove(stepsToRemove);

      scrapper.steps = nodeLikeItemsToModels({
        createModel: (payload) => ScrapperStepModel.create(payload),
        input: input.steps,
        existingSteps: scrapper.steps,
      });

      didUpdate = true;
    }

    if ('variables' in input) {
      const variablesToRemove = findEntitiesToRemove(
        input.variables,
        scrapper.variables
      );

      await variableRepository.delete(
        variablesToRemove.map((variable) => variable.id)
      );

      scrapper.variables = input.variables.map((variable) => {
        return VariableModel.create({
          ...variable,
        });
      });

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
  }
);
