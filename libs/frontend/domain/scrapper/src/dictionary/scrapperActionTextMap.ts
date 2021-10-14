import { ScrapperAction } from '@scrapper-gate/shared/schema';

export const scrapperActionTextMap: Record<ScrapperAction, string> = {
  [ScrapperAction.Click]: 'Click',
  [ScrapperAction.GoBack]: 'Go back',
  [ScrapperAction.NavigateTo]: 'Navigate to',
  [ScrapperAction.ReadText]: 'Read text',
  [ScrapperAction.ReloadPage]: 'Reload Page',
  [ScrapperAction.Type]: 'Type text',
  [ScrapperAction.Screenshot]: 'Screenshot',
  [ScrapperAction.ChangeRunSettings]: 'Change run settings',
  [ScrapperAction.Condition]: 'Conditional',
};
