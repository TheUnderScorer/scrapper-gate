import React, { MouseEventHandler, useCallback, useState } from 'react';
import {
  Box,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  PopoverPosition,
} from '@material-ui/core';
import { ContextMenuProps } from './ContextMenu.types';

export const ContextMenu = ({
  children,
  menuItems,
  boxProps,
  ...menuProps
}: ContextMenuProps) => {
  const [mouseState, setMouseState] = useState<PopoverPosition | null>(null);

  const handleContextMenu: MouseEventHandler = useCallback((event) => {
    event.preventDefault();

    setMouseState({
      top: event.clientY - 4,
      left: event.clientX - 2,
    });
  }, []);

  const handleClose = useCallback(() => {
    setMouseState(null);
  }, []);

  return (
    <Box onContextMenu={handleContextMenu} {...boxProps}>
      {children}
      {menuItems && (
        <Menu
          keepMounted
          open={Boolean(mouseState)}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={mouseState}
          {...menuProps}
        >
          {menuItems.map((item) => (
            <MenuItem
              onClick={(event) => {
                item.onClick?.(event);

                handleClose();
              }}
              key={item.id}
            >
              {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
              <ListItemText>{item.content}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      )}
    </Box>
  );
};
