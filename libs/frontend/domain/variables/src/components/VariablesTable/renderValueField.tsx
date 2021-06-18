import { GridCellParams } from '@material-ui/data-grid';
import { EditRow } from '@scrapper-gate/frontend/data-grid';
import { VariableType } from '@scrapper-gate/shared/schema';
import React from 'react';
import { VariableValueField } from '../VariableValueField/VariableValueField';

export const renderValueField = (
  key: 'value' | 'defaultValue',
  name: string
) => (params: GridCellParams) => {
  return (
    <EditRow {...params} name={name}>
      {(props) => (
        <VariableValueField type={VariableType.Text} name={props.name} />
      )}
    </EditRow>
  );
};
