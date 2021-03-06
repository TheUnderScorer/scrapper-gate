import { getAllObjectKeys } from '@scrapper-gate/shared/common';
import { ScrapperStepInput } from '@scrapper-gate/shared/schema';
import { pick } from 'remeda';

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
  conditionalRules: true,
  isFirst: true,
  fullPageScreenshot: true,
});

export const pickScrapperInput = pick<
  ScrapperStepInput,
  typeof scrapperStepInputKeys[number]
>(scrapperStepInputKeys);
