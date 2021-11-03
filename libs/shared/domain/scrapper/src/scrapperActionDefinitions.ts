import { ScrapperAction } from '@scrapper-gate/shared/schema';

export interface ScrapperStepActionDefinition {
  description: string;
  returnsValue: boolean;
  returnsTextValue?: boolean;
}

export type ScrapperStepActionDefinitions = {
  [Key in ScrapperAction]: ScrapperStepActionDefinition;
};

export const scrapperStepActionDefinitions: ScrapperStepActionDefinitions = {
  [ScrapperAction.Screenshot]: {
    description:
      'Creates screenshot of either current page, or selected elements.',
    returnsValue: true,
  },
  [ScrapperAction.ReadAttribute]: {
    description: 'Reads HTML attributes of selected elements.',
    returnsValue: true,
    returnsTextValue: true,
  },
  [ScrapperAction.ReadText]: {
    description: 'Reads text content of selected elements.',
    returnsValue: true,
    returnsTextValue: true,
  },
  [ScrapperAction.Click]: {
    description: 'Clicks selected elements in order provided.',
    returnsValue: false,
  },
  [ScrapperAction.ChangeRunSettings]: {
    description: 'Changes current run settings.',
    returnsValue: false,
  },
  [ScrapperAction.Condition]: {
    description: 'Runs given conditional checks.',
    returnsValue: false,
  },
  [ScrapperAction.ReloadPage]: {
    description: 'Reloads current page.',
    returnsValue: false,
  },
  [ScrapperAction.GoBack]: {
    description: 'Returns to previous page.',
    returnsValue: false,
  },
  [ScrapperAction.NavigateTo]: {
    description: 'Navigates to given url.',
    returnsValue: false,
  },
  [ScrapperAction.Type]: {
    description: 'Types provided text into selected elements.',
    returnsValue: false,
  },
  [ScrapperAction.Wait]: {
    description: 'Waits until selected condition happens.',
    returnsValue: false,
  },
};
