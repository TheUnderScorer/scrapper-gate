import React, {
  MouseEventHandler,
  ReactNode,
  useCallback,
  useState,
} from 'react';
import {
  IconButton,
  IconButtonProps,
  Menu,
  MenuProps,
} from '@material-ui/core';
import { MoreVertSharp } from '@material-ui/icons';
import { MenuItemProperties as MenuItemType } from '@scrapper-gate/frontend/common';
import { GenericMenuItem } from '../GenericMenuItem/GenericMenuItem';

export interface DropdownActivatorBag {
  onClick: MouseEventHandler;
}

export interface DropdownProps extends Omit<MenuProps, 'open' | 'onClose'> {
  items: MenuItemType[];
  activator?: (bag: DropdownActivatorBag) => ReactNode;
  iconButtonProps?: Omit<IconButtonProps, 'onClick'>;
}

export const Dropdown = ({
  items,
  activator,
  iconButtonProps,
  ...rest
}: DropdownProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>();
  const open = Boolean(anchorEl);

  const handleClick: MouseEventHandler = useCallback((event) => {
    setAnchorEl(event.target as HTMLElement);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <>
      {activator ? (
        activator({ onClick: handleClick })
      ) : (
        <IconButton onClick={handleClick} {...iconButtonProps}>
          <MoreVertSharp />
        </IconButton>
      )}
      <Menu
        open={open}
        keepMounted
        anchorEl={anchorEl}
        onClose={handleClose}
        disablePortal={false}
        style={{
          pointerEvents: 'all',
        }}
        {...rest}
      >
        {items.map((item) => (
          <GenericMenuItem {...item} key={item.id} />
        ))}
      </Menu>
    </>
  );
};
