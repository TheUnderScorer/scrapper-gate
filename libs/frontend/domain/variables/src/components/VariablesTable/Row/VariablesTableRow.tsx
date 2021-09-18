import { Delete } from '@mui/icons-material';
import {
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { EnumSelect, FormTextField } from '@scrapper-gate/frontend/form';
import { VariableScope, VariableType } from '@scrapper-gate/shared/schema';
import classNames from 'classnames';
import React, { memo } from 'react';
import { VariableValueField } from '../../VariableValueField/VariableValueField';

const PREFIX = 'VariablesTableRow';

const classes = {
  delete: `${PREFIX}-delete`,
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  [`& .${classes.delete}`]: {
    color: theme.palette.error.main,
  },
}));

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
  return (
    <StyledTableRow className="variable-row">
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
            size="large"
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </TableCell>
    </StyledTableRow>
  );
};

export const VariablesTableRow = memo(BaseVariablesTableRow);
