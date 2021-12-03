import {
  ConditionalRuleType,
  DateConditionalRule,
} from '@scrapper-gate/shared/schema';
import joi from 'joi';
import { supportsVariables } from '../../modifiers/supportsVariables';
import { getBaseConditionalRuleMap } from './baseConditionalRuleMap';

const base = getBaseConditionalRuleMap(ConditionalRuleType.Date);

export const DateRuleSchema = joi.object<DateConditionalRule>({
  ...base,
  expectedDate: supportsVariables({
    schema: joi.alternatives(joi.string(), joi.date()).required(),
    onIncludesVariableKey: () => joi.string().required(),
    onNotIncludesVariableKey: () => joi.date().required(),
  }),
});
