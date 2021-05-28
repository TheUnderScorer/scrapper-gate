import { GridApi } from '@material-ui/data-grid';
import { BaseEntity } from '@scrapper-gate/shared/schema';

export interface ResolveGridModelFormNameParams {
  id: string | number;
  name: string;
  field?: string;
  api: GridApi;
}

export const resolveGridModelFormName = ({
  id,
  name,
  field,
  api,
}: ResolveGridModelFormNameParams) => {
  const values = api.getRowModels() as Map<string, Pick<BaseEntity, 'id'>>;
  const index = Array.from(values.keys()).findIndex(
    (arrayId) => arrayId === id
  );

  if (!field) {
    return `${name}[${index}]`;
  }

  return `${name}[${index}].${field}`;
};
