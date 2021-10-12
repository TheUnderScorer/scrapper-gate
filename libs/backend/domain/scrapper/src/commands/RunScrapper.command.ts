import { ScrapperRunnerMessagePayload } from '@scrapper-gate/shared/domain/scrapper';
import { Command } from 'functional-cqrs';

export const RunScrapper = 'RunScrapper' as const;

export class RunScrapperCommand implements Command {
  name = RunScrapper;

  constructor(public readonly payload: ScrapperRunnerMessagePayload) {}
}
