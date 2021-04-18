import { Event } from 'functional-cqrs';
import { ScrapperModel } from '@scrapper-gate/backend/domain/scrapper';

export interface ScrapperCreatedEventPayload {
  scrapper: ScrapperModel;
}

export class ScrapperCreatedEvent implements Event {
  constructor(public readonly payload: ScrapperCreatedEventPayload) {}
}
