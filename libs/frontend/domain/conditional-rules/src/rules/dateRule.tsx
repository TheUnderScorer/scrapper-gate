import { DateRange } from '@mui/icons-material';
import { DateFormat } from '@scrapper-gate/shared/common';
import { ConditionalRuleTypes } from '@scrapper-gate/shared/domain/conditional-rules';
import { format } from 'date-fns';
import { DateRule } from '../components/DateRule/DateRule';
import { ConditionalRulesSelection } from '../types';
import { baseCreateTitle } from '../utils/title';

export const dateRule: ConditionalRulesSelection = {
  label: 'Date',
  icon: <DateRange />,
  value: {
    Component: DateRule,
    type: ConditionalRuleTypes.Date,
    createTitle: baseCreateTitle({
      valueFormatter: (value) =>
        format(new Date(value as string), DateFormat.Date),
    }),
  },
};
