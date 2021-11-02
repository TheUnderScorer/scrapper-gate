/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MenuItem } from '@mui/material';
import { useVariablesContextSelector } from '../../providers/VariablesProvider';
import { FormSelect } from '@scrapper-gate/frontend/form';
import React from 'react';
import { VariableSelectProps } from './VariableSelect.types';

export const VariableSelect = (props: VariableSelectProps) => {
  const variables = useVariablesContextSelector((ctx) => ctx.filteredVariables);

  return (
    <FormSelect {...props}>
      {variables.map((variable) => (
        <MenuItem key={variable.key!} value={variable.key!}>
          {variable.key}
        </MenuItem>
      ))}
    </FormSelect>
  );
};
