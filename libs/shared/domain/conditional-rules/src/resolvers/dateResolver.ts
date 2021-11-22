import { Perhaps } from '@scrapper-gate/shared/common';
import { ConditionalRuleType } from '@scrapper-gate/shared/schema';
import { RuleResolver } from '../types';
import { primitiveValueResolver } from './primitiveValueResolver';

export const makeDateResolver =
  (date: Perhaps<Date> = new Date()): RuleResolver<ConditionalRuleType.Date> =>
  (rule) =>
    primitiveValueResolver({
      condition: rule.condition,
      expectedValue: rule.expectedDate,
      value: date,
    });
