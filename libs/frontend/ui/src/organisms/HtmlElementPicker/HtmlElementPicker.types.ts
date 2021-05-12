import { TextFieldProps } from '@material-ui/core';
import { ReactNode } from 'react';
import { SelectorType } from '@scrapper-gate/shared/schema';

export enum HtmlElementPickerValidationRules {
  ValidSelector = 'ValidSelector',
  ElementsExist = 'ElementsExist',
}

export interface HtmlElementPickerProps {
  name: string;
  variant?: TextFieldProps['variant'];
  className?: string;
  label?: string;
  helperText?: string;
  onPick?: (element: Element) => unknown;
  onPickerToggle?: (active: boolean) => unknown;
  container?: Element;
  portal?: Element;
  ignoredElementsContainer?: HTMLElement;
  pickerDisabled?: boolean;
  pickerDisabledTooltip?: ReactNode;
  disabled?: boolean;
  elementsValidator?: (elements: Element[]) => Error | undefined;
  defaultMode?: SelectorType;
  validationRules?: HtmlElementPickerValidationRules[];
  highlightId?: string;
}
