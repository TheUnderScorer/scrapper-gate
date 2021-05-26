import { Scrapper } from '@scrapper-gate/shared/schema';
import { Event } from 'functional-cqrs';

export interface ScrapperCreatedEventPayload<T extends Scrapper = Scrapper> {
  scrapper: T;
}

export class ScrapperCreatedEvent<T extends Scrapper = Scrapper>
  implements Event {
  constructor(public readonly payload: ScrapperCreatedEventPayload<T>) {}
}
