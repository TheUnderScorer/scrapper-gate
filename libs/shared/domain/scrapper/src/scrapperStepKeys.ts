import { ScrapperStepInput } from '@scrapper-gate/shared/schema';
import { getAllObjectKeys } from '@scrapper-gate/shared/common';

export const scrapperStepInputKeys = getAllObjectKeys<ScrapperStepInput>({
  nextStepId: true,
  stepIdOnFalse: true,
  stepIdOnTrue: true,
  position: true,
  mouseButton: true,
  clickTimes: true,
  action: true,
  goBackSteps: true,
  id: true,
  key: true,
  navigateToUrl: true,
  reloadDelay: true,
  selectors: true,
  typeDelay: true,
  url: true,
  useUrlFromPreviousStep: true,
});
