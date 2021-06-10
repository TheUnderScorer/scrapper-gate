import { DateRange } from '@material-ui/icons';
import { DateFormat, toDisplayText } from '@scrapper-gate/shared/common';
import { ConditionalRuleTypes } from '@scrapper-gate/shared/domain/conditional-rules';
import { format } from 'date-fns';
import { DateRule } from '../components/DateRule/DateRule';
import {
  ConditionalRulesSelection,
  RuleTitleDefinition,
  RuleTitleDefinitionType,
} from '../types';

export const dateRule: ConditionalRulesSelection = {
  label: 'Date',
  icon: <DateRange />,
  value: {
    Component: DateRule,
    type: ConditionalRuleTypes.Date,
    createTitle: (rule) => {
      if (!rule?.when || !rule?.value) {
        return [
          {
            type: RuleTitleDefinitionType.Text,
            text: toDisplayText(rule.type),
          },
        ];
      }

      const base: RuleTitleDefinition[] = [
        {
          type: RuleTitleDefinitionType.Text,
          text: toDisplayText(rule.type),
        },
        {
          type: RuleTitleDefinitionType.Highlight,
          text: toDisplayText(rule.when).toLowerCase(),
        },
      ];

      try {
        return [
          ...base,
          {
            type: RuleTitleDefinitionType.Value,
            text: format(new Date(rule.value as string), DateFormat.Date),
          },
        ];
      } catch {
        return [
          ...base,
          {
            type: RuleTitleDefinitionType.Value,
            text: rule.value,
          },
        ];
      }
    },
  },
};
