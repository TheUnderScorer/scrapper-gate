import { TextFieldProps } from '@material-ui/core';
import { Code } from '@material-ui/icons';
import { HtmlElementPickerProps } from '@scrapper-gate/frontend/ui';
import { toDisplayText } from '@scrapper-gate/shared/common';
import {
  ConditionalRuleTypes,
  ConditionalRuleWhen,
  HtmlElementRuleMeta,
  HtmlElementWhat,
} from '@scrapper-gate/shared/domain/conditional-rules';
import { ConditionalRule } from '@scrapper-gate/shared/schema';
import { ReactNode } from 'react';
import { HtmlElementRule } from '../components/HtmlElementRule/HtmlElementRule';
import {
  ConditionalRulesSelection,
  RuleTitleDefinition,
  RuleTitleDefinitionType,
} from '../types';

const createTitle = (rule: ConditionalRule): RuleTitleDefinition[] => {
  const meta = rule.meta as HtmlElementRuleMeta;

  if (!rule.what) {
    return [
      {
        type: RuleTitleDefinitionType.Text,
        text: 'Html element',
      },
      {
        type: RuleTitleDefinitionType.Highlight,
        text: toDisplayText(rule.when).toLowerCase(),
      },
    ];
  }

  switch (rule.what) {
    case HtmlElementWhat.Tag:
      if (!rule.value) {
        return [
          {
            type: RuleTitleDefinitionType.Text,
            text: 'Html element tag name',
          },
          {
            type: RuleTitleDefinitionType.Highlight,
            text: toDisplayText(rule.when).toLowerCase(),
          },
        ];
      }

      return [
        {
          type: RuleTitleDefinitionType.Text,
          text: 'Html element',
        },
        {
          type: RuleTitleDefinitionType.Highlight,
          text: 'tag name',
        },
        {
          type: RuleTitleDefinitionType.Highlight,
          text: toDisplayText(rule.when).toLowerCase(),
        },
        {
          type: RuleTitleDefinitionType.Value,
          text: rule.value?.toString() ?? '',
        },
      ];

    case HtmlElementWhat.Attribute:
      if (!meta?.attribute) {
        return [
          {
            type: RuleTitleDefinitionType.Text,
            text: 'Html element',
          },
        ];
      }

      return [
        {
          type: RuleTitleDefinitionType.Text,
          text: 'Html element',
        },
        {
          type: RuleTitleDefinitionType.Highlight,
          text: 'attribute',
        },
        {
          type: RuleTitleDefinitionType.Text,
          text: rule.meta?.attribute,
        },
        {
          type: RuleTitleDefinitionType.Highlight,
          text: toDisplayText(rule.when).toLowerCase(),
        },
        {
          type: RuleTitleDefinitionType.Value,
          text: rule.value?.toString() ?? '',
        },
      ];

    default:
      return [
        {
          type: RuleTitleDefinitionType.Text,
          text: 'Html element',
        },
      ];
  }
};

export const makeHtmlElementRule = (
  htmlElementProps: Omit<HtmlElementPickerProps, 'name'>
): ConditionalRulesSelection => ({
  label: 'HTML Element',
  icon: <Code />,
  value: {
    Component: (props) => <HtmlElementRule {...props} {...htmlElementProps} />,
    type: ConditionalRuleTypes.HtmlElement,
    createTitle: createTitle,
    defaultWhen: ConditionalRuleWhen.Exists,
  },
});

export interface HtmlRulePickerProps {
  name: string;
  variant?: TextFieldProps['variant'];
}

export const makeHtmlElementRuleWithPicker = (
  pickerFactory: (props: HtmlRulePickerProps) => ReactNode
): ConditionalRulesSelection => ({
  label: 'HTML Element',
  icon: <Code />,
  value: {
    createTitle,
    type: ConditionalRuleTypes.HtmlElement,
    Component: (props) => (
      <HtmlElementRule
        {...props}
        picker={pickerFactory({
          name: props.getName('meta.selectors'),
          variant: props.fieldVariant,
        })}
      />
    ),
  },
});
