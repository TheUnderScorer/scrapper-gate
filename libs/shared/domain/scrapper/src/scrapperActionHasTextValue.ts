import { ScrapperAction } from '@scrapper-gate/shared/schema';
import { scrapperStepActionDefinitions } from './scrapperActionDefinitions';

const stepActionsWithValues = Object.entries(scrapperStepActionDefinitions)
  .filter(([, definition]) => definition.returnsValue)
  .map(([action]) => action as ScrapperAction);

export const scrapperActionHasTextValue = (action: ScrapperAction) =>
  stepActionsWithValues.includes(action);
