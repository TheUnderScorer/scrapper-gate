import { NodeProps } from 'react-flow-renderer';
import { ListItemIcon, ListItemText, MenuItem } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DeleteSharp } from '@material-ui/icons';
import { useRemoveItems } from '../hooks/useRemoveItems';
import { BaseNodeProperties } from '../FlowBuilder.types';

export interface NodeContextMenuProps<T extends BaseNodeProperties> {
  node: NodeProps<T>;
}

const useStyles = makeStyles((theme) => ({
  delete: {
    color: theme.palette.error.main,
  },
}));

export const NodeDropdown = <T extends BaseNodeProperties>({
  node,
}: NodeContextMenuProps<T>) => {
  const removeItems = useRemoveItems();

  const classes = useStyles();

  return (
    <>
      {!node.data?.cannotBeDeleted && (
        <MenuItem
          onClick={() => removeItems([node])}
          className={classes.delete}
        >
          <ListItemIcon className={classes.delete}>
            <DeleteSharp />
          </ListItemIcon>
          <ListItemText>Delete step</ListItemText>
        </MenuItem>
      )}
    </>
  );
};
