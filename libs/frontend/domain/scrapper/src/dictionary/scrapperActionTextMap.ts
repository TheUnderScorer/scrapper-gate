import { ScrapperAction } from '@scrapper-gate/shared/schema';

export const scrapperActionTextMap = {
  [ScrapperAction.Click]: 'Click',
  [ScrapperAction.GoBack]: 'Go back',
  [ScrapperAction.NavigateTo]: 'Navigate to',
  [ScrapperAction.ReadText]: 'Read text',
  [ScrapperAction.ReloadPage]: 'Reload Page',
  [ScrapperAction.Type]: 'Type text',
  [ScrapperAction.Condition]: 'Conditional',
};
