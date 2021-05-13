import { Event } from 'functional-cqrs';
import { ScrapperModel } from '../models/Scrapper.model';

export interface ScrapperUpdatedEventPayload {
  scrapper: ScrapperModel;
  userId: string;
}

export class ScrapperUpdatedEvent implements Event {
  constructor(public readonly payload: ScrapperUpdatedEventPayload) {}
}
