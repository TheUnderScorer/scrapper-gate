import { Maybe } from '@scrapper-gate/shared/common';
import { RuleResolver } from '../types';
import { primitiveValueResolver } from './primitiveValueResolver';

export const makeDateResolver = (
  date: Maybe<Date> = new Date()
): RuleResolver => (rule) => primitiveValueResolver(rule, date);
