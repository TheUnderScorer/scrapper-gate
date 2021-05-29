import { VariableTemplate } from './types';

export const isVariableKey = (val: unknown): val is VariableTemplate =>
  typeof val === 'string' && val.startsWith('{{') && val.endsWith('}}');
