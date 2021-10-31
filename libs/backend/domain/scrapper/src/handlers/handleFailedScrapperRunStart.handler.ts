import { ScrapperRunRepository } from '../repositories/ScrapperRun.repository';
import {
  ErrorObjectDto,
  RunFailedToStartError,
} from '@scrapper-gate/shared/errors';
import { RunState } from '@scrapper-gate/shared/schema';
import { HandleFailedScrapperRunStartCommand } from '../commands/HandleFailedScrapperRunStart.command';

export interface HandleFailedScrapperRunStartHandlerDependencies {
  scrapperRunRepository: ScrapperRunRepository;
}

export const handleFailedScrapperRunStartHandler =
  ({
    scrapperRunRepository,
  }: HandleFailedScrapperRunStartHandlerDependencies) =>
  async (command: HandleFailedScrapperRunStartCommand) => {
    const run = await scrapperRunRepository.getOneAggregate(
      command.payload.runId
    );

    const error = ErrorObjectDto.createFromError(new RunFailedToStartError());

    run.state = RunState.Failed;
    run.error = error;

    run.results?.forEach((result) => {
      result.state = RunState.Failed;
    });

    await scrapperRunRepository.save(run);

    return run;
  };
