import {
  IconButton,
  TableCell,
  TableRow,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { EnumSelect, FormTextField } from '@scrapper-gate/frontend/form';
import { VariableScope, VariableType } from '@scrapper-gate/shared/schema';
import classNames from 'classnames';
import React, { memo } from 'react';
import { VariableValueField } from '../../VariableValueField/VariableValueField';

export interface VariablesTableRowProps {
  index: number;
  onDelete?: (index: number) => unknown;
  name: string;
  type: VariableType;
  scope: VariableScope;
}

const useStyles = makeStyles((theme: Theme) => ({
  delete: {
    color: theme.palette.error.main,
  },
}));

const BaseVariablesTableRow = ({
  onDelete,
  index,
  name,
  type,
  scope,
}: VariablesTableRowProps) => {
  const classes = useStyles();

  return (
    <TableRow className="variable-row">
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
            className={classNames(classes.delete, 'delete-variable')}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export const VariablesTableRow = memo(BaseVariablesTableRow);
