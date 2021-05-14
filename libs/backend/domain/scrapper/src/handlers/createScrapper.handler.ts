import { commandHandler, EventsBus } from 'functional-cqrs';
import { CreateScrapperCommand } from '../commands/CreateScrapper.command';
import { ScrapperCreatedEvent } from '../events/ScrapperCreated.event';
import { ScrapperModel } from '../models/Scrapper.model';
import { ScrapperRepository } from '../repositories/Scrapper.repository';

export interface CreateScrapperHandlerDependencies {
  scrapperRepository: ScrapperRepository;
  eventsBus: EventsBus;
}

export const createScrapperHandler = commandHandler.asFunction<
  CreateScrapperCommand,
  CreateScrapperHandlerDependencies
>(
  CreateScrapperCommand.name,
  async ({ context: { scrapperRepository, eventsBus }, command }) => {
    const scrapper = ScrapperModel.create({
      name: command.payload?.input?.name,
      createdBy: command.payload.user,
    });

    await scrapperRepository.save(scrapper);

    await eventsBus.dispatch(
      new ScrapperCreatedEvent({
        scrapper,
      })
    );

    return scrapper;
  }
);
