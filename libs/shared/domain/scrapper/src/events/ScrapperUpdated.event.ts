import { Scrapper, Variable } from '@scrapper-gate/shared/schema';
import { Event } from 'functional-cqrs';

export interface ScrapperUpdatedEventPayload<
  T extends Scrapper = Scrapper,
  V extends Variable = Variable
> {
  scrapper: T;
  userId: string;
  variables: V[];
}

export class ScrapperUpdatedEvent<
  T extends Scrapper = Scrapper,
  V extends Variable = Variable
> implements Event {
  constructor(public readonly payload: ScrapperUpdatedEventPayload<T, V>) {}
}
