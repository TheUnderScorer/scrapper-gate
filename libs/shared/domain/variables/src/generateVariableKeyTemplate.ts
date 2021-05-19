import { VariableTemplate } from './types';

export const generateVariableKeyTemplate = (key: string): VariableTemplate =>
  `{{${key}}}` as const;
