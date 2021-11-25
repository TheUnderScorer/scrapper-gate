import { castAsDate, DateFormat } from '@scrapper-gate/shared/common';
import { ConditionalRuleType, Maybe } from '@scrapper-gate/shared/schema';
import { format } from 'date-fns';
import { RuleResolver } from '../types';
import { primitiveValueResolver } from './primitiveValueResolver';

export const makeDateResolver =
  (
    date: Maybe<Date> = new Date(),
    dateFormat = DateFormat.Date
  ): RuleResolver<ConditionalRuleType.Date> =>
  (rule) => {
    const expectedDate = castAsDate(rule.expectedDate);

    return primitiveValueResolver({
      condition: rule.condition,
      expectedValue: new Date(format(expectedDate, dateFormat)),
      value: new Date(format(date as Date, dateFormat)),
    });
  };
