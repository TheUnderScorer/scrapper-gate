import {
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { EnumSelect, FormTextField } from '@scrapper-gate/frontend/form';
import { VariableScope, VariableType } from '@scrapper-gate/shared/schema';
import React, { memo } from 'react';
import { VariableValueField } from '../../VariableValueField/VariableValueField';

export interface VariablesTableRowProps {
  index: number;
  onDelete?: (index: number) => unknown;
  name: string;
  type: VariableType;
  scope: VariableScope;
}

const BaseVariablesTableRow = ({
  onDelete,
  index,
  name,
  type,
  scope,
}: VariablesTableRowProps) => {
  const theme = useTheme();

  return (
    <TableRow data-index={index} className="variable-row">
      <TableCell>
        <FormTextField
          fullWidth
          variant="standard"
          name={`${name}.key`}
          placeholder="Name..."
        />
      </TableCell>
      <TableCell>
        <VariableValueField
          placeholder="Initial value..."
          type={type}
          name={`${name}.defaultValue`}
        />
      </TableCell>
      <TableCell>
        <VariableValueField
          placeholder="Current value..."
          type={type}
          name={`${name}.value`}
        />
      </TableCell>
      <TableCell>
        <Typography>{scope}</Typography>
      </TableCell>
      <TableCell>
        <EnumSelect
          sx={{
            width: 125,
          }}
          fullWidth
          variant="standard"
          enumObj={VariableType}
          name={`${name}.type`}
        />
      </TableCell>
      <TableCell>
        <Tooltip title="Remove variable">
          <IconButton
            onClick={() => onDelete?.(index)}
            className="delete-variable"
            size="large"
            color="error"
          >
            {theme.icons.remove}
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export const VariablesTableRow = memo(BaseVariablesTableRow);
