import { ConditionalRulesSelection } from './types';
import { dateRule } from './rules/dateRule';

export const baseRulesSelection: ConditionalRulesSelection[] = [dateRule];
