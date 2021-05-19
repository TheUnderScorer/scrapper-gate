import { createBaseEntity } from '@scrapper-gate/shared/common';
import { Variable } from '@scrapper-gate/shared/schema';

export type CreateVariableParams = Pick<Variable, 'value' | 'key'>;

export const createVariable = ({
  key,
  value,
}: CreateVariableParams): Variable => ({
  ...createBaseEntity(),
  key,
  value,
});
