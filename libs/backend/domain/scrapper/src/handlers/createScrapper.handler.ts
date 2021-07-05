import { ScrapperCreatedEvent } from '@scrapper-gate/shared/domain/scrapper';
import { CommandContext } from 'functional-cqrs';
import { CreateScrapperCommand } from '../commands/CreateScrapper.command';
import { ScrapperModel } from '../models/Scrapper.model';
import { ScrapperRepository } from '../repositories/Scrapper.repository';

export interface CreateScrapperHandlerDependencies {
  scrapperRepository: ScrapperRepository;
}

export const createScrapperHandler = ({
  scrapperRepository,
}: CreateScrapperHandlerDependencies) => async (
  command: CreateScrapperCommand,
  { eventsBus }: CommandContext
) => {
  const scrapper = ScrapperModel.create({
    name: command.payload?.input?.name,
    createdBy: command.payload.user,
    type: command.payload.input.type,
  });

  await scrapperRepository.save(scrapper);

  await eventsBus.dispatch(
    new ScrapperCreatedEvent({
      scrapper,
    })
  );

  return scrapper;
};
