import {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { MenuItemProperties } from '@scrapper-gate/frontend/common';
import React, { forwardRef } from 'react';

const useStyles = makeStyles((theme) => ({
  header: {
    lineHeight: 'inherit',
    marginBottom: theme.spacing(0.3),
  },
  divider: {
    padding: 0,
  },
}));

export const GenericMenuItem = forwardRef<HTMLLIElement, MenuItemProperties>(
  ({ onClick, icon, className, content, type, id }, ref) => {
    const classes = useStyles();

    if (type === 'subHeader') {
      return (
        <ListSubheader className={classes.header}>{content}</ListSubheader>
      );
    }

    if (type === 'divider') {
      return <ListItem disableGutters className={classes.divider} divider />;
    }

    if (type === 'input') {
      return <ListItem>{content}</ListItem>;
    }

    return (
      <MenuItem ref={ref} id={id} onClick={onClick} className={className}>
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText>{content}</ListItemText>
      </MenuItem>
    );
  }
);
