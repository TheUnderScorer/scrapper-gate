import { ScrapperRunProcessor } from '@scrapper-gate/shared/domain/scrapper';
import { RunState } from '@scrapper-gate/shared/schema';
import { CommandHandler } from 'functional-cqrs';
import { RunScrapperCommand } from '../commands/RunScrapper.command';
import { GetScrapperRunner } from '../logic/getScrapperRunner';
import { ScrapperRepository } from '../repositories/Scrapper.repository';
import { ScrapperRunRepository } from '../repositories/ScrapperRun.repository';

export interface RunScrapperHandlerDependencies {
  scrapperRepository: ScrapperRepository;
  scrapperRunRepository: ScrapperRunRepository;
  getScrapperRunner: GetScrapperRunner;
}

export class RunScrapperHandler implements CommandHandler<RunScrapperCommand> {
  constructor(private readonly dependencies: RunScrapperHandlerDependencies) {}

  async handle({ payload: { runId } }: RunScrapperCommand) {
    const { scrapperRepository, scrapperRunRepository, getScrapperRunner } =
      this.dependencies;

    const scrapperRun = await scrapperRunRepository.findOneOrFailWithScrapper(
      runId
    );
    const { scrapper } = scrapperRun;

    scrapperRun.state = RunState.InProgress;

    await scrapperRepository.save(scrapper);
    await scrapperRunRepository.save(scrapperRun);

    const runner = getScrapperRunner(scrapper);

    const processor = new ScrapperRunProcessor(runner);

    try {
      this.setupEvents(processor);

      await processor.process({
        scrapperRun,
        scrapper,
        initialUrl: scrapperRun.runSettings?.initialUrl,
      });
    } finally {
      await processor.dispose();
    }
  }

  private setupEvents(processor: ScrapperRunProcessor) {
    const { scrapperRunRepository } = this.dependencies;

    processor.events.on('scrapperRunChanged', async (scrapperRun) => {
      await scrapperRunRepository.save(scrapperRun);
    });
  }
}
