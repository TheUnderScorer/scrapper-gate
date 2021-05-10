import { BaseConditionalRuleTypes } from '@scrapper-gate/shared/domain/conditional-rules';
import { DateRange } from '@material-ui/icons';
import { DateRule } from './components/DateRule/DateRule';
import { DateFormat, toDisplayText } from '@scrapper-gate/shared/common';
import { format } from 'date-fns';
import { ConditionalRulesSelection } from './types';

export const baseRulesSelection: ConditionalRulesSelection[] = [
  {
    label: 'Date',
    icon: <DateRange />,
    value: {
      Component: DateRule,
      type: BaseConditionalRuleTypes.Date,
      createTitle: (rule) => {
        try {
          return `${toDisplayText(rule.type)} ${toDisplayText(
            rule.when
          ).toLowerCase()} ${format(
            new Date(rule.value as string),
            DateFormat.Date
          )}`;
        } catch {
          return toDisplayText(rule.type);
        }
      },
    },
  },
];
