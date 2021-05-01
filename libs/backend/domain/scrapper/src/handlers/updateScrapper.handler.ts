import { commandHandler, EventsBus } from 'functional-cqrs';
import { UpdateScrapperCommand } from '../commands/UpdateScrapper.command';
import {
  ScrapperRepository,
  ScrapperStepModel,
  ScrapperStepRepository,
} from '@scrapper-gate/backend/domain/scrapper';
import { ScrapperUpdatedEvent } from '../events/ScrapperUpdated.event';

export interface UpdateScrapperHandlerDependencies {
  scrapperRepository: ScrapperRepository;
  scrapperStepRepository: ScrapperStepRepository;
  eventsBus: EventsBus;
}

export const updateScrapperHandler = commandHandler.asFunction<
  UpdateScrapperCommand,
  UpdateScrapperHandlerDependencies
>(
  UpdateScrapperCommand.name,
  async ({
    context: { scrapperRepository, eventsBus, scrapperStepRepository },
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
      await scrapperStepRepository.remove(scrapper.steps);

      scrapper.steps = input.steps
        .map((step) => {
          return {
            model: ScrapperStepModel.create(step),
            nextStepId: step.nextStepId,
          };
        })
        .map(({ model, nextStepId }, index, array) => {
          // Find previous steps for this step
          const previousSteps = array.filter(
            (arrayItem) => arrayItem.nextStepId === model.id
          );

          // Ensure that we won't use client generated id
          delete model.id;
          model.generateId();

          previousSteps.forEach((prevStep) => {
            prevStep.model.nextStep = model;
          });

          return model;
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
