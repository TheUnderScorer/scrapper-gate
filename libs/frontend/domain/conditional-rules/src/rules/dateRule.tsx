import { ConditionalRulesSelection } from '../types';
import { DateRange } from '@material-ui/icons';
import { DateRule } from '../components/DateRule/DateRule';
import { ConditionalRuleTypes } from '@scrapper-gate/shared/domain/conditional-rules';
import { DateFormat, toDisplayText } from '@scrapper-gate/shared/common';
import { format } from 'date-fns';

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
