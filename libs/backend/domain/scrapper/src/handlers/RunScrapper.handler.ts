import { ScrapperRunProcessor } from '@scrapper-gate/shared/domain/scrapper';
import { RunState } from '@scrapper-gate/shared/schema';
import { CommandHandler } from 'functional-cqrs';
import { RunScrapperCommand } from '../commands/RunScrapper.command';
import { GetScrapperRunner } from '../logic/getScrapperRunner';
import { ScrapperModel } from '../models/Scrapper.model';
import { ScrapperRunModel } from '../models/ScrapperRun.model';
import { ScrapperRepository } from '../repositories/Scrapper.repository';
import { ScrapperRunRepository } from '../repositories/ScrapperRun.repository';

export interface RunScrapperHandlerDependencies {
  scrapperRepository: ScrapperRepository;
  scrapperRunRepository: ScrapperRunRepository;
  getScrapperRunner: GetScrapperRunner;
}

export class RunScrapperHandler implements CommandHandler<RunScrapperCommand> {
  constructor(private readonly dependencies: RunScrapperHandlerDependencies) {}

  async handle({ payload: { scrapperId } }: RunScrapperCommand) {
    const {
      scrapperRepository,
      scrapperRunRepository,
      getScrapperRunner,
    } = this.dependencies;

    const scrapper = await scrapperRepository.getOneForRun(scrapperId);
    const scrapperRun = ScrapperRunModel.create({
      scrapper,
      steps: scrapper.steps,
      state: RunState.InProgress,
      startedAt: new Date(),
    });

    scrapper.state = RunState.InProgress;

    await Promise.all([
      scrapperRepository.save(scrapper),
      scrapperRunRepository.save(scrapperRun),
    ]);

    const runner = getScrapperRunner(scrapper);

    const processor = new ScrapperRunProcessor(runner);

    try {
      this.setupEvents(processor, scrapper);

      await processor.process({
        scrapperRun,
        scrapper,
      });
    } finally {
      await processor.dispose();
    }
  }

  private setupEvents(
    processor: ScrapperRunProcessor,
    scrapper: ScrapperModel
  ) {
    const { scrapperRunRepository, scrapperRepository } = this.dependencies;

    processor.events.on('scrapperRunChanged', async (scrapperRun) => {
      const promises: Array<Promise<unknown>> = [
        scrapperRunRepository.save(scrapperRun),
      ];

      if (scrapperRun.state !== scrapper.state) {
        scrapper.state = scrapperRun.state;

        promises.push(scrapperRepository.save(scrapper));
      }

      await Promise.all(promises);
    });
  }
}
