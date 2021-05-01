import { commandHandler, EventsBus } from 'functional-cqrs';
import { UpdateScrapperCommand } from '../commands/UpdateScrapper.command';
import {
  ScrapperRepository,
  ScrapperStepModel,
  ScrapperStepRepository,
} from '@scrapper-gate/backend/domain/scrapper';
import { ScrapperUpdatedEvent } from '../events/ScrapperUpdated.event';
import { ScrapperStepInput } from '@scrapper-gate/shared/schema';

export interface UpdateScrapperHandlerDependencies {
  scrapperRepository: ScrapperRepository;
  scrapperStepRepository: ScrapperStepRepository;
  eventsBus: EventsBus;
}

const propertiesToOverwrite: Array<
  [keyof ScrapperStepInput, 'nextStep' | 'stepOnFalse' | 'stepOnTrue']
> = [
  ['nextStepId', 'nextStep'],
  ['stepIdOnFalse', 'stepOnFalse'],
  ['stepIdOnTrue', 'stepOnTrue'],
];

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
            stepIdOnTrue: step.stepIdOnTrue,
            stepIdOnFalse: step.stepIdOnFalse,
          };
        })
        .map(({ model }, index, array) => {
          const oldId = model.id;

          // Ensure that we won't use client generated id
          delete model.id;
          model.generateId();

          // Setup relations using this model
          propertiesToOverwrite.forEach(([key, targetKey]) => {
            const relatedSteps = array.filter(
              (arrayItem) => arrayItem[key] === oldId
            );

            relatedSteps.forEach((item) => {
              item.model[targetKey] = model;
            });
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
