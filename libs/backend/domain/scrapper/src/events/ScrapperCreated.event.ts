import { Event } from 'functional-cqrs';
import { ScrapperModel } from '../models/Scrapper.model';

export interface ScrapperCreatedEventPayload {
  scrapper: ScrapperModel;
}

export class ScrapperCreatedEvent implements Event {
  constructor(public readonly payload: ScrapperCreatedEventPayload) {}
}
