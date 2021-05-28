import { Box, Button, Fab, Paper, Tooltip, useTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid, GridApi, GridCellParams } from '@material-ui/data-grid';
import { Add } from '@material-ui/icons';
import { useFieldArray } from '@scrapper-gate/frontend/form';
import { Centered, Emoji, InformationBox } from '@scrapper-gate/frontend/ui';
import { createVariable } from '@scrapper-gate/shared/domain/variables';
import {
  Variable,
  VariableScope,
  VariableType,
} from '@scrapper-gate/shared/schema';
import classNames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import { makeColumns } from './makeColumns';

export interface VariablesTableProps {
  name: string;
}

const useStyles = makeStyles((theme) => ({
  cell: {
    '&.MuiDataGrid-cell': {
      '&, &:focus': {
        outline: 'none !important',
      },
    },
  },
  delete: {
    color: theme.palette.error.main,
  },
  empty: {
    marginTop: '5%',
  },
}));

export const VariablesTable = ({ name }: VariablesTableProps) => {
  const theme = useTheme();

  const {
    input: { value: variables },
    append,
    remove,
  } = useFieldArray<Variable>(name);

  const classes = useStyles();

  const handleRemove = useCallback(
    (params: GridCellParams) => {
      const ids = (params.api as GridApi).getAllRowIds();
      const index = ids.indexOf(params.id);

      remove(index);
    },
    [remove]
  );

  const addVariable = useCallback(() => {
    append(
      createVariable({
        scope: VariableScope.Global,
        key: '',
        type: VariableType.Text,
      })
    );
  }, [append]);

  const columns = useMemo(() => {
    return makeColumns({
      name: name,
      classes: classes,
      onRemove: handleRemove,
    });
  }, [name, classes, handleRemove]);

  return (
    <Paper
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <DataGrid
        getRowClassName={(params) =>
          classNames('variable-row', `variable-${params.id}`)
        }
        components={{
          NoRowsOverlay: () => (
            <Centered className={classes.empty} zIndex={2}>
              <InformationBox
                title={
                  <>
                    No variables found <Emoji>{theme.emojis.empty}</Emoji>
                  </>
                }
                subTitle="Variables lets you re-use values in multiple places."
                action={<Button onClick={addVariable}>Add variable</Button>}
              />
            </Centered>
          ),
          Toolbar: () => {
            return (
              <Box
                paddingTop={1}
                paddingRight={1}
                width="100%"
                display="flex"
                justifyContent="flex-end"
              >
                <Tooltip title="Add new variable">
                  <Fab
                    className="add-variable"
                    onClick={addVariable}
                    size="small"
                    color="primary"
                  >
                    <Add />
                  </Fab>
                </Tooltip>
              </Box>
            );
          },
        }}
        disableSelectionOnClick
        onCellClick={(param) => {
          if (!param.field) {
            return;
          }

          (param.api as GridApi).setCellMode(param.id, param.field, 'edit');
        }}
        rows={variables}
        columns={columns}
        onCellBlur={(_, event) => {
          event.stopPropagation();
        }}
      />
    </Paper>
  );
};
