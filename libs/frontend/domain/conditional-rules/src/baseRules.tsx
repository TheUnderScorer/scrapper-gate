import { ConditionalRuleTypes } from '@scrapper-gate/shared/domain/conditional-rules';
import { Code, DateRange } from '@material-ui/icons';
import { DateRule } from './components/DateRule/DateRule';
import { DateFormat, toDisplayText } from '@scrapper-gate/shared/common';
import { format } from 'date-fns';
import {
  ConditionalRulesSelection,
  HtmlElementRuleMeta,
  HtmlElementWhat,
} from './types';
import { HtmlElementPickerProps } from '@scrapper-gate/frontend/ui';
import { HtmlElementRule } from './components/HtmlElementRule/HtmlElementRule';

export const dateRule: ConditionalRulesSelection = {
  label: 'Date',
  icon: <DateRange />,
  value: {
    Component: DateRule,
    type: ConditionalRuleTypes.Date,
    createTitle: (rule) => {
      if (!rule?.when || !rule?.value) {
        return toDisplayText(rule.type);
      }

      try {
        return (
          <>
            {toDisplayText(rule.type)}{' '}
            <strong>{toDisplayText(rule.when).toLowerCase()}</strong>{' '}
            {`"${format(new Date(rule.value as string), DateFormat.Date)}"`}
          </>
        );
      } catch {
        return toDisplayText(rule.type);
      }
    },
  },
};

export const makeHtmlElementRule = (
  htmlElementProps: Omit<HtmlElementPickerProps, 'name'>
): ConditionalRulesSelection => ({
  label: 'HTML Element',
  icon: <Code />,
  value: {
    Component: (props) => <HtmlElementRule {...props} {...htmlElementProps} />,
    type: ConditionalRuleTypes.HtmlElement,
    createTitle: (rule) => {
      const meta = rule.meta as HtmlElementRuleMeta;

      if (!rule.what) {
        return (
          <>
            Html element{' '}
            <strong>{toDisplayText(rule.when).toLowerCase()}</strong>
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
          if (!meta.attribute) {
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
    },
  },
});
export const baseRulesSelection: ConditionalRulesSelection[] = [dateRule];
