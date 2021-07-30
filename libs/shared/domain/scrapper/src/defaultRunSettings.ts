import {
  ScrapperDialogBehaviour,
  ScrapperNoElementsFoundBehavior,
  ScrapperRunSettings,
} from '@scrapper-gate/shared/schema';

export const defaultScrapperRunSettings: ScrapperRunSettings = {
  dialogBehaviour: ScrapperDialogBehaviour.AlwaysConfirm,
  noElementsFoundBehavior: ScrapperNoElementsFoundBehavior.Fail,
  // 10 minutes
  timeoutMs: 600_000,
};
