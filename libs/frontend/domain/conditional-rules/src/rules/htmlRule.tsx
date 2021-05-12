import { ReactNode } from 'react';
import {
  ConditionalRulesSelection,
  HtmlElementRuleMeta,
  HtmlElementWhat,
} from '../types';
import { Code } from '@material-ui/icons';
import { HtmlElementPickerProps } from '@scrapper-gate/frontend/ui';
import { HtmlElementRule } from '../components/HtmlElementRule/HtmlElementRule';
import { ConditionalRuleTypes } from '@scrapper-gate/shared/domain/conditional-rules';
import { ConditionalRule } from '@scrapper-gate/shared/schema';
import { toDisplayText } from '@scrapper-gate/shared/common';

const createTitle = (rule: ConditionalRule) => {
  const meta = rule.meta as HtmlElementRuleMeta;

  if (!rule.what) {
    return (
      <>
        Html element <strong>{toDisplayText(rule.when).toLowerCase()}</strong>
      </>
    );
  }

  switch (rule.what) {
    case HtmlElementWhat.Tag:
      if (!rule.value) {
        return (
          <>
            Html element tag name{' '}
            <strong>{toDisplayText(rule.when).toLowerCase()}</strong>
          </>
        );
      }

      return (
        <>
          Html element tag name{' '}
          <strong>{toDisplayText(rule.when).toLowerCase()}</strong>{' '}
          {rule.value ? `"${rule.value}"` : ''}
        </>
      );

    case HtmlElementWhat.Attribute:
      if (!meta?.attribute) {
        return 'Html element';
      }

      return (
        <>
          Html element attribute "{meta.attribute}"{' '}
          <strong>{toDisplayText(rule.when).toLowerCase()}</strong>{' '}
          {rule.value ? `"${rule.value}"` : ''}
        </>
      );

    default:
      return 'Html element';
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
  },
});

export const makeHtmlElementRuleWithPicker = (
  pickerFactory: (name: string) => ReactNode
): ConditionalRulesSelection => ({
  label: 'HTML Element',
  icon: <Code />,
  value: {
    createTitle,
    type: ConditionalRuleTypes.HtmlElement,
    Component: (props) => (
      <HtmlElementRule
        {...props}
        picker={pickerFactory(props.getName('meta.selectors'))}
      />
    ),
  },
});
