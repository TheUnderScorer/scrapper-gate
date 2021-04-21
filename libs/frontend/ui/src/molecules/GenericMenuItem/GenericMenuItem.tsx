import React, { forwardRef } from 'react';
import { MenuItemProperties } from '@scrapper-gate/frontend/common';
import { ListItemIcon, ListItemText, MenuItem } from '@material-ui/core';

export const GenericMenuItem = forwardRef<HTMLLIElement, MenuItemProperties>(
  ({ onClick, icon, className, content, id }, ref) => {
    return (
      <MenuItem ref={ref} id={id} onClick={onClick} className={className}>
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText>{content}</ListItemText>
      </MenuItem>
    );
  }
);
