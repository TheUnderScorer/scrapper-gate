import { Code } from '@mui/icons-material';
import { TextFieldProps } from '@mui/material';
import { HtmlElementPickerProps } from '@scrapper-gate/frontend/ui';
import { conditionalRuleDefinitions } from '@scrapper-gate/shared/domain/conditional-rules';
import { ConditionalRuleType } from '@scrapper-gate/shared/schema';
import { ReactNode } from 'react';
import { HtmlElementRuleFooter } from '../components/HtmlElementRule/Footer/HtmlElementRuleFooter';
import { HtmlElementRule } from '../components/HtmlElementRule/HtmlElementRule';
import { FrontendConditionalRuleDefinition } from '../types';

export interface HtmlRulePickerProps {
  name: string;
  variant?: TextFieldProps['variant'];
}

export const htmlRule = {
  withoutPicker: (
    htmlElementProps?: Omit<HtmlElementPickerProps, 'name'>
  ): FrontendConditionalRuleDefinition<ConditionalRuleType.HtmlElement> => ({
    label: 'HTML Element',
    icon: <Code />,
    Component: (props) => <HtmlElementRule {...props} {...htmlElementProps} />,
    FooterComponent: (props) => (
      <HtmlElementRuleFooter {...props} {...htmlElementProps} />
    ),
    definition: conditionalRuleDefinitions[ConditionalRuleType.HtmlElement],
  }),
  withPicker: (
    pickerFactory: (props: HtmlRulePickerProps) => ReactNode
  ): FrontendConditionalRuleDefinition<ConditionalRuleType.HtmlElement> => ({
    label: 'HTML Element',
    icon: <Code />,
    definition: conditionalRuleDefinitions[ConditionalRuleType.HtmlElement],
    FooterComponent: (props) => (
      <HtmlElementRuleFooter
        {...props}
        picker={pickerFactory({
          name: props.getName('selectors'),
          variant: props.fieldVariant,
        })}
      />
    ),
    Component: (props) => <HtmlElementRule {...props} />,
  }),
};
