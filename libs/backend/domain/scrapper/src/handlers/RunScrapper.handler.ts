import { FileRepository } from '@scrapper-gate/backend/domain/files';
import { ScrapperRunProcessor } from '@scrapper-gate/shared/domain/scrapper';
import { Logger } from '@scrapper-gate/shared/logger';
import { CommandHandler, EventsBus } from 'functional-cqrs';
import { RunScrapperCommand } from '../commands/RunScrapper.command';
import { ScrapperStepCompletedEvent } from '../events/ScrapperStepCompleted.event';
import { ScrapperStepResultFilledAfterRunEvent } from '../events/ScrapperStepResultFilledAfterRun.event';
import { GetScrapperRunner } from '../logic/getScrapperRunner';
import { ScrapperRunModel } from '../models/ScrapperRun.model';
import { ScrapperRepository } from '../repositories/Scrapper.repository';
import { ScrapperRunRepository } from '../repositories/ScrapperRun.repository';

export interface RunScrapperHandlerDependencies {
  scrapperRepository: ScrapperRepository;
  scrapperRunRepository: ScrapperRunRepository;
  getScrapperRunner: GetScrapperRunner;
  logger: Logger;
  fileRepository: FileRepository;
  eventsBus: EventsBus;
}

export class RunScrapperHandler implements CommandHandler<RunScrapperCommand> {
  constructor(private readonly dependencies: RunScrapperHandlerDependencies) {}

  async handle({ payload: { runId, runSettings } }: RunScrapperCommand) {
    const { scrapperRunRepository, getScrapperRunner, logger } =
      this.dependencies;

    const scrapperRun = await scrapperRunRepository.getOneAggregate(runId);

    const runner = getScrapperRunner(scrapperRun, runSettings);

    const processor = new ScrapperRunProcessor(runner, logger, scrapperRun);

    try {
      this.setupEvents(processor);

      await processor.process();
    } finally {
      await processor.dispose();
    }
  }

  private setupEvents(processor: ScrapperRunProcessor) {
    const { scrapperRunRepository, eventsBus } = this.dependencies;

    processor.events.on('scrapperRunChanged', async (scrapperRun) => {
      await scrapperRunRepository.save(ScrapperRunModel.create(scrapperRun));
    });

    processor.events.on('stepFinished', async (payload) => {
      await eventsBus.dispatch(new ScrapperStepCompletedEvent(payload));
    });

    processor.events.on(
      'filledStepResultAfterRun',
      async ({ runStepResult, result }) => {
        await eventsBus.dispatch(
          new ScrapperStepResultFilledAfterRunEvent({
            runStepResult,
            result,
          })
        );
      }
    );
  }
}
