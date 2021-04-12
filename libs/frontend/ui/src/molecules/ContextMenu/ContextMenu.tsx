import React, { MouseEventHandler, useCallback, useState } from 'react';
import { Box, Menu, PopoverPosition } from '@material-ui/core';
import { ContextMenuProps } from './ContextMenu.types';
import { GenericMenuItem } from '../GenericMenuItem/GenericMenuItem';

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
            <GenericMenuItem
              key={item.id}
              {...item}
              onClick={(event) => {
                item.onClick?.(event);

                handleClose();
              }}
            />
          ))}
        </Menu>
      )}
    </Box>
  );
};
