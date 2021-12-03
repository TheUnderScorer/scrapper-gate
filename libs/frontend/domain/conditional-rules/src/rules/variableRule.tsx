import { AttachMoney } from '@mui/icons-material';
import { conditionalRuleDefinitions } from '@scrapper-gate/shared/domain/conditional-rules';
import { ConditionalRuleType } from '@scrapper-gate/shared/schema';
import { VariableRule } from '../components/VariableRule/VariableRule';
import { FrontendConditionalRuleDefinition } from '../types';

export const variableRule: FrontendConditionalRuleDefinition<ConditionalRuleType.Variable> =
  {
    label: 'Variable',
    icon: <AttachMoney />,
    Component: VariableRule,
    definition: conditionalRuleDefinitions[ConditionalRuleType.Variable],
  };
