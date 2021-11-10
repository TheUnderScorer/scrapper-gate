import { ScrapperAction } from '@scrapper-gate/shared/schema';
import { ComponentType } from 'react';
import { ScrapperStepFormProps } from './ScrapperBuilder.types';
import { ChangeRunSettingsSections } from './stepSections/ChangeRunSettingsSections';
import { ClickSections } from './stepSections/ClickSections';
import { ConditionalSections } from './stepSections/ConditionalSections';
import { GoBackSections } from './stepSections/GoBackSections';
import { NavigateToSections } from './stepSections/NavigateToSections';
import { ReadAttributeSections } from './stepSections/ReadAttributeSections';
import { ReadTextSections } from './stepSections/ReadTextSections';
import { ReloadSections } from './stepSections/ReloadSections';
import { RunJavascriptSections } from './stepSections/RunJavascriptSections';
import { ScreenshotSections } from './stepSections/ScreenshotSections';
import { TypeSections } from './stepSections/TypeSections';
import { WaitSections } from './stepSections/WaitSections';

export type Sections = {
  [Key in ScrapperAction]: ComponentType<ScrapperStepFormProps>;
};

export const sections: Sections = {
  [ScrapperAction.Click]: ClickSections,
  [ScrapperAction.ReadText]: ReadTextSections,
  [ScrapperAction.ReadAttribute]: ReadAttributeSections,
  [ScrapperAction.NavigateTo]: NavigateToSections,
  [ScrapperAction.Type]: TypeSections,
  [ScrapperAction.GoBack]: GoBackSections,
  [ScrapperAction.ReloadPage]: ReloadSections,
  [ScrapperAction.Condition]: ConditionalSections,
  [ScrapperAction.Screenshot]: ScreenshotSections,
  [ScrapperAction.ChangeRunSettings]: ChangeRunSettingsSections,
  [ScrapperAction.Wait]: WaitSections,
  [ScrapperAction.RunJavascript]: RunJavascriptSections,
};
