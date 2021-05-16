import { RuleResolver } from '../types';
import { primitiveValueResolver } from './primitiveValueResolver';

export const makeDateResolver = (date = new Date()): RuleResolver => (rule) => {
  return primitiveValueResolver(rule, date);
};
