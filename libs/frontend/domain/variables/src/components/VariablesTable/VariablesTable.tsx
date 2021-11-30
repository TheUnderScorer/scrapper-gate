import { Add } from '@mui/icons-material';
import {
  Box,
  Fab,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFieldArray } from '@scrapper-gate/frontend/form';
import { Centered, Emoji, InformationBox } from '@scrapper-gate/frontend/ui';
import { createVariable } from '@scrapper-gate/shared/domain/variables';
import {
  Variable,
  VariableScope,
  VariableType,
} from '@scrapper-gate/shared/schema';
import React, { useCallback } from 'react';
import { VariablesTableRow } from './Row/VariablesTableRow';

const PREFIX = 'VariablesTable';

const classes = {
  empty: `${PREFIX}-empty`,
  container: `${PREFIX}-container`,
};

const StyledTableContainer = styled(TableContainer)(() => ({
  [`& .${classes.empty}`]: {
    marginTop: '5%',
  },

  [`&.${classes.container}`]: {
    position: 'relative',
    height: '100%',
  },
}));

export interface VariablesTableProps {
  name: string;
  scope: VariableScope;
}

export const VariablesTable = ({ name, scope }: VariablesTableProps) => {
  const theme = useTheme();

  const {
    input: { value: variables },
    append,
    remove,
  } = useFieldArray<Variable>(name);

  const addVariable = useCallback(() => {
    append(
      createVariable({
        scope,
        key: '',
        type: VariableType.Text,
      })
    );
  }, [append, scope]);

  const fab = (
    <Fab
      size="small"
      variant="extended"
      className="add-variable"
      onClick={addVariable}
      color="primary"
      sx={{
        boxShadow: 'none',
      }}
    >
      <Stack direction="row" spacing={1}>
        <Add />
        Add variable
      </Stack>
    </Fab>
  );

  if (!variables.length) {
    return (
      <Centered className={classes.empty} zIndex={2}>
        <InformationBox
          title={
            <>
              No variables found <Emoji>{theme.emojis.empty}</Emoji>
            </>
          }
          subTitle="Variables lets you re-use values in multiple places."
          action={fab}
        />
      </Centered>
    );
  }

  return (
    <StyledTableContainer className={classes.container}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Initial value</TableCell>
            <TableCell>Current value</TableCell>
            <TableCell>Scope</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {variables.map((variable, index) => (
            <VariablesTableRow
              scope={variable.scope}
              type={variable.type ?? VariableType.Text}
              name={`${name}[${index}]`}
              index={index}
              key={variable.id}
              onDelete={remove}
            />
          ))}
        </TableBody>
      </Table>
      <Box display="flex" justifyContent="center" width="100%" marginTop={2}>
        {fab}
      </Box>
    </StyledTableContainer>
  );
};
