import { ResolvableVariable } from './types';

export const getVariableValue = (variable: ResolvableVariable) =>
  variable.value ?? variable.defaultValue;
