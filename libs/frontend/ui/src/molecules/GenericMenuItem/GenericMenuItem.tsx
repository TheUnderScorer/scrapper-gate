import {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
} from '@mui/material';
import React, { forwardRef } from 'react';
import { MenuItemProperties } from '../../types/menuItemProperties';

export const GenericMenuItem = forwardRef<HTMLLIElement, MenuItemProperties>(
  (props, ref) => {
    const { onClick, icon, className, content, sx, type, id, color, disabled } =
      props;

    if (type === 'subHeader') {
      return (
        <ListSubheader
          sx={{
            lineHeight: 'inherit',
            marginBottom: (theme) => theme.spacing(1),
            ...sx,
          }}
        >
          {content}
        </ListSubheader>
      );
    }

    if (type === 'divider') {
      return (
        <ListItem
          color={color}
          disableGutters
          sx={{
            padding: 0,
            ...sx,
          }}
          divider
        />
      );
    }

    if (type === 'input') {
      return (
        <ListItem disabled={disabled} color={color} sx={sx}>
          {content}
        </ListItem>
      );
    }

    return (
      <MenuItem
        disabled={disabled}
        color={color}
        ref={ref}
        id={id}
        onClick={onClick}
        className={className}
        sx={sx}
      >
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText>{content}</ListItemText>
      </MenuItem>
    );
  }
);
