import { DateRange } from '@material-ui/icons';
import {
  DateFormat,
  toDisplayText,
  tryDateCast,
} from '@scrapper-gate/shared/common';
import { ConditionalRuleTypes } from '@scrapper-gate/shared/domain/conditional-rules';
import { resolveVariables } from '@scrapper-gate/shared/domain/variables';
import { VariableType } from '@scrapper-gate/shared/schema';
import { format } from 'date-fns';
import { DateRule } from '../components/DateRule/DateRule';
import { ConditionalRulesSelection } from '../types';

export const dateRule: ConditionalRulesSelection = {
  label: 'Date',
  icon: <DateRange />,
  value: {
    Component: DateRule,
    type: ConditionalRuleTypes.Date,
    createTitle: (rule, { variables }) => {
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
        const resolvedValue = resolveVariables({
          target: rule.value,
          variables: variables.filter(
            (variable) => variable.type === VariableType.Date
          ),
        }).toString();
        const castedValue = tryDateCast(resolvedValue);

        console.log({
          resolvedValue,
          castedValue,
          value: rule.value,
        });

        const formattedValue =
          castedValue instanceof Date
            ? format(castedValue, DateFormat.Date)
            : castedValue;

        return (
          <>
            {toDisplayText(rule.type)}{' '}
            <strong>{toDisplayText(rule.when).toLowerCase()}</strong>{' '}
            {`"${formattedValue}"`}
          </>
        );
      }
    },
  },
};
