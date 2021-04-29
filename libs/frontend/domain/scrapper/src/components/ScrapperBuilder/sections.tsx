import { ComponentType } from 'react';
import { ReadTextSections } from './stepSections/ReadTextSections';
import { ClickSections } from './stepSections/ClickSections';
import { TypeSections } from './stepSections/TypeSections';
import { ReloadSections } from './stepSections/ReloadSections';
import { ScrapperAction } from '@scrapper-gate/shared/schema';
import { ScrapperStepFormProps } from './ScrapperBuilder.types';
import { GoBackSections } from './stepSections/GoBackSections';
import { NavigateToSections } from './stepSections/NavigateToSections';

export type Sections = {
  [Key in ScrapperAction]?: ComponentType<ScrapperStepFormProps>;
};

export const sections: Sections = {
  [ScrapperAction.Click]: ClickSections,
  [ScrapperAction.ReadText]: ReadTextSections,
  [ScrapperAction.NavigateTo]: NavigateToSections,
  [ScrapperAction.Type]: TypeSections,
  [ScrapperAction.GoBack]: GoBackSections,
  [ScrapperAction.ReloadPage]: ReloadSections,
};
