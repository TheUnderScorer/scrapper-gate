import { FileRepository } from '@scrapper-gate/backend/domain/files';
import { ExcludeFalsy, getById } from '@scrapper-gate/shared/common';
import {
  RunScrapperStepResult,
  ScrapperRunProcessor,
} from '@scrapper-gate/shared/domain/scrapper';
import { Logger } from '@scrapper-gate/shared/logger';
import { ScrapperRunStepResult } from '@scrapper-gate/shared/schema';
import { CommandHandler } from 'functional-cqrs';
import { RunScrapperCommand } from '../commands/RunScrapper.command';
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
}

export class RunScrapperHandler implements CommandHandler<RunScrapperCommand> {
  constructor(private readonly dependencies: RunScrapperHandlerDependencies) {}

  async handle({ payload: { runId, initialUrl } }: RunScrapperCommand) {
    const { scrapperRunRepository, getScrapperRunner, logger } =
      this.dependencies;

    const scrapperRun = await scrapperRunRepository.getOneAggregate(runId);
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
    const { scrapperRunRepository } = this.dependencies;

    processor.events.on('scrapperRunChanged', async (scrapperRun) => {
      await scrapperRunRepository.save(ScrapperRunModel.create(scrapperRun));
    });

    processor.events.on(
      'filledStepResultAfterRun',
      async ({ runStepResult, result }) => {
        await this.connectFiles(runStepResult, result);
      }
    );
  }

  private async connectFiles(
    runStepResult: RunScrapperStepResult,
    result: ScrapperRunStepResult
  ) {
    if ('values' in runStepResult) {
      const fileIds = runStepResult.values
        ?.map((item) =>
          'screenshotFileId' in item ? item.screenshotFileId : undefined
        )
        .filter(ExcludeFalsy);

      if (!fileIds?.length) {
        return;
      }

      const files = await this.dependencies.fileRepository.findByIds(fileIds);

      result.values?.forEach((value, index) => {
        const fileId = fileIds[index];

        if (fileId) {
          value.screenshot = getById(files, fileId);
        }
      });
    }
  }
}
