import { Scrapper } from '@scrapper-gate/shared/schema';
import { Event } from 'functional-cqrs';

export interface ScrapperUpdatedEventPayload<T extends Scrapper = Scrapper> {
  scrapper: T;
  userId: string;
}

export class ScrapperUpdatedEvent<T extends Scrapper = Scrapper>
  implements Event {
  constructor(public readonly payload: ScrapperUpdatedEventPayload<T>) {}
}
