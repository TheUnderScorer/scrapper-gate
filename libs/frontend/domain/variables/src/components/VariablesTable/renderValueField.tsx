import { GridCellParams } from '@material-ui/data-grid';
import {
  EditRow,
  resolveGridModelFormName,
} from '@scrapper-gate/frontend/data-grid';
import React from 'react';
import { VariableValueField } from '../VariableValueField/VariableValueField';

export const renderValueField = (
  key: 'value' | 'defaultValue',
  name: string
) => (params: GridCellParams) => {
  const variableName = resolveGridModelFormName({
    id: params.id,
    name,
    api: params.api,
  });

  return (
    <EditRow {...params} name={name}>
      {(props) => (
        <VariableValueField name={props.name} variableName={variableName} />
      )}
    </EditRow>
  );
};
