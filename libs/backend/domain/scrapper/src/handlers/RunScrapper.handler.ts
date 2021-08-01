import { ScrapperRunProcessor } from '@scrapper-gate/shared/domain/scrapper';
import { Logger } from '@scrapper-gate/shared/logger';
import { CommandHandler } from 'functional-cqrs';
import { RunScrapperCommand } from '../commands/RunScrapper.command';
import { GetScrapperRunner } from '../logic/getScrapperRunner';
import { ScrapperRepository } from '../repositories/Scrapper.repository';
import { ScrapperRunRepository } from '../repositories/ScrapperRun.repository';

export interface RunScrapperHandlerDependencies {
  scrapperRepository: ScrapperRepository;
  scrapperRunRepository: ScrapperRunRepository;
  getScrapperRunner: GetScrapperRunner;
  logger: Logger;
}

export class RunScrapperHandler implements CommandHandler<RunScrapperCommand> {
  constructor(private readonly dependencies: RunScrapperHandlerDependencies) {}

  async handle({ payload: { runId, initialUrl } }: RunScrapperCommand) {
    const { scrapperRunRepository, getScrapperRunner, logger } =
      this.dependencies;

    const scrapperRun = await scrapperRunRepository.findOneOrFailWithScrapper(
      runId
    );
    const { scrapper } = scrapperRun;

    const runner = getScrapperRunner(scrapper);

    const processor = new ScrapperRunProcessor(runner, logger);

    try {
      this.setupEvents(processor);

      await processor.process({
        scrapperRun,
        scrapper,
        initialUrl: initialUrl ?? scrapperRun.runSettings?.initialUrl,
      });
    } finally {
      await processor.dispose();
    }
  }

  private setupEvents(processor: ScrapperRunProcessor) {
    const { scrapperRunRepository, logger } = this.dependencies;

    processor.events.on('scrapperRunChanged', async (scrapperRun) => {
      logger.debug(`Saving scrapper: ${scrapperRun.state}`);

      await scrapperRunRepository.save(scrapperRun);
    });
  }
}
