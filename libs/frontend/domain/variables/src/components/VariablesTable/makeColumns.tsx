import { IconButton, Tooltip } from '@material-ui/core';
import { GridCellParams, GridColumns } from '@material-ui/data-grid';
import { Delete } from '@material-ui/icons';
import { stopPropagation } from '@scrapper-gate/frontend/common';
import { EditRow, RowTextField } from '@scrapper-gate/frontend/data-grid';
import { EnumSelect } from '@scrapper-gate/frontend/form';
import { VariableScope, VariableType } from '@scrapper-gate/shared/schema';
import classNames from 'classnames';
import React from 'react';
import { renderValueField } from './renderValueField';

interface MakeColumnsParams {
  name: string;
  classes: Record<string, string>;
  onRemove: (params: GridCellParams) => unknown;
}

export const makeColumns = ({
  name,
  classes,
  onRemove,
}: MakeColumnsParams): GridColumns => [
  {
    field: 'key',
    headerName: 'Name',
    editable: true,
    width: 160,
    cellClassName: classes.cell,
    renderCell: (params) => <RowTextField {...params} name={name} />,
  },
  {
    field: 'defaultValue',
    headerName: 'Initial value',
    editable: true,
    width: 160,
    cellClassName: classes.cell,
    renderCell: renderValueField('defaultValue', name),
  },
  {
    field: 'value',
    headerName: 'Current value',
    editable: true,
    width: 160,
    cellClassName: classes.cell,
    renderCell: renderValueField('value', name),
  },
  {
    field: 'scope',
    headerName: 'Scope',
    editable: true,
    width: 160,
    cellClassName: classes.cell,
    renderCell: (params) => (
      <EditRow {...params} name={name}>
        {({ name }) => (
          <EnumSelect
            MenuProps={{
              onMouseDown: stopPropagation,
              onClick: stopPropagation,
            }}
            variant="standard"
            size="small"
            enumObj={VariableScope}
            name={name}
          />
        )}
      </EditRow>
    ),
  },

  {
    field: 'type',
    headerName: 'Type',
    editable: true,
    width: 120,
    cellClassName: classes.cell,
    renderCell: (params) => (
      <EditRow {...params} name={name}>
        {({ name }) => (
          <EnumSelect
            MenuProps={{
              onMouseDown: stopPropagation,
            }}
            variant="standard"
            size="small"
            enumObj={VariableType}
            name={name}
          />
        )}
      </EditRow>
    ),
  },
  {
    field: '__actions__',
    headerName: 'Actions',
    sortable: false,
    filterable: false,
    editable: false,
    disableColumnMenu: true,
    disableClickEventBubbling: true,
    hide: false,
    align: 'center',
    hideSortIcons: true,
    cellClassName: classes.cell,
    renderCell: (params) => (
      <Tooltip title="Remove variable">
        <IconButton
          onClick={() => onRemove(params)}
          className={classNames(classes.delete, 'delete-variable')}
        >
          <Delete />
        </IconButton>
      </Tooltip>
    ),
  },
];
