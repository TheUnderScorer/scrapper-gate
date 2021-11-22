import { DateRange } from '@mui/icons-material';
import { conditionalRuleDefinitions } from '@scrapper-gate/shared/domain/conditional-rules';
import { ConditionalRuleType } from '@scrapper-gate/shared/schema';
import { DateRule } from '../components/DateRule/DateRule';
import { FrontendConditionalRuleDefinition } from '../types';

export const dateRule: FrontendConditionalRuleDefinition<ConditionalRuleType.Date> =
  {
    label: 'Date',
    icon: <DateRange />,
    Component: DateRule,
    definition: conditionalRuleDefinitions[ConditionalRuleType.Date],
  };
