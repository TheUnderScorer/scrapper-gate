import { ScrapperStepFinishedPayload } from '@scrapper-gate/shared/domain/scrapper';
import { Event } from 'functional-cqrs';

export class ScrapperStepCompletedEvent implements Event {
  constructor(public readonly payload: ScrapperStepFinishedPayload) {}
}
