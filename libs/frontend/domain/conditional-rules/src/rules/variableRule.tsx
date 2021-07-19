import { AttachMoney } from '@material-ui/icons';
import { baseCreateTitle } from '../utils/title';
import { ConditionalRuleTypes } from '@scrapper-gate/shared/domain/conditional-rules';
import { VariableRule } from '../components/VariableRule/VariableRule';
import { ConditionalRulesSelection } from '../types';

export const variableRule: ConditionalRulesSelection = {
  label: 'Variable',
  icon: <AttachMoney />,
  value: {
    Component: VariableRule,
    type: ConditionalRuleTypes.Variable,
    createTitle: baseCreateTitle(),
  },
};
