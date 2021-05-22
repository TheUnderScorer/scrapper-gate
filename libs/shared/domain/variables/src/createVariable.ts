import { createBaseEntity } from '@scrapper-gate/shared/common';
import { Variable } from '@scrapper-gate/shared/schema';

export type CreateVariableParams = Pick<
  Variable,
  'value' | 'key' | 'defaultValue' | 'scope'
>;

export const createVariable = (params: CreateVariableParams): Variable => ({
  ...createBaseEntity(),
  ...params,
});
