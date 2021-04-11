import React from 'react';
import { MenuItemProperties } from '@scrapper-gate/shared-frontend/common';
import { ListItemIcon, ListItemText, MenuItem } from '@material-ui/core';

export const GenericMenuItem = ({
  onClick,
  icon,
  className,
  content,
  id,
}: MenuItemProperties) => {
  return (
    <MenuItem id={id} onClick={onClick} className={className}>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText>{content}</ListItemText>
    </MenuItem>
  );
};
