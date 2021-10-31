import { RunScrapperStepResult } from '@scrapper-gate/shared/domain/scrapper';
import { ScrapperRunStepResult } from '@scrapper-gate/shared/schema';
import { Event } from 'functional-cqrs';

export interface ScrapperStepResultFilledAfterRunEventPayload {
  runStepResult: RunScrapperStepResult;
  result: ScrapperRunStepResult;
}

export class ScrapperStepResultFilledAfterRunEvent implements Event {
  constructor(
    public readonly payload: ScrapperStepResultFilledAfterRunEventPayload
  ) {}
}
