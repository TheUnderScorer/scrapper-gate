import { IconButton, TableCell, TableRow, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Delete } from '@material-ui/icons';
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
}

const useStyles = makeStyles((theme) => ({
  delete: {
    color: theme.palette.error.main,
  },
}));

const BaseVariablesTableRow = ({
  onDelete,
  index,
  name,
  type,
}: VariablesTableRowProps) => {
  const classes = useStyles();

  return (
    <TableRow>
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
          name={`${name}.initialValue`}
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
        <EnumSelect
          fullWidth
          variant="standard"
          enumObj={VariableScope}
          name={`${name}.scope`}
        />
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
            onClick={() => onDelete(index)}
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
