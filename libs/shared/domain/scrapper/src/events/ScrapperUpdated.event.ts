import { VariableModel } from '@scrapper-gate/backend/domain/variables';
import { Event } from 'functional-cqrs';
import { ScrapperModel } from '../../../../../backend/domain/scrapper/src/models/Scrapper.model';

export interface ScrapperUpdatedEventPayload {
  scrapper: ScrapperModel;
  userId: string;
  variables: VariableModel[];
}

export class ScrapperUpdatedEvent implements Event {
  constructor(public readonly payload: ScrapperUpdatedEventPayload) {}
}
