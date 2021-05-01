import { Event } from 'functional-cqrs';
import { ScrapperModel } from '@scrapper-gate/backend/domain/scrapper';

export interface ScrapperUpdatedEventPayload {
  scrapper: ScrapperModel;
  userId: string;
}

export class ScrapperUpdatedEvent implements Event {
  constructor(public readonly payload: ScrapperUpdatedEventPayload) {}
}
