import { Variable } from '@scrapper-gate/shared/schema';

export type VariableTemplate = `{{${string}}}`;

export type ResolvableVariable = Pick<
  Variable,
  'key' | 'value' | 'defaultValue'
>;
