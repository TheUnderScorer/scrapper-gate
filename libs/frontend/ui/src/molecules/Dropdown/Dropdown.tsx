import { MoreVertSharp } from '@mui/icons-material';
import { IconButton, IconButtonProps, Menu, MenuProps } from '@mui/material';
import React, {
  MouseEventHandler,
  ReactNode,
  useCallback,
  useState,
} from 'react';
import { MenuItemProperties as MenuItemType } from '../../types/menuItemProperties';
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
        <IconButton onClick={handleClick} {...iconButtonProps} size="large">
          <MoreVertSharp />
        </IconButton>
      )}
      <Menu
        open={open}
        keepMounted
        anchorEl={anchorEl}
        onClose={handleClose}
        disablePortal={false}
        {...rest}
        sx={{
          pointerEvents: 'all',
          ...rest.sx,
        }}
      >
        {items.map((item) => (
          <GenericMenuItem
            {...item}
            key={item.id}
            onClick={(event) => {
              item.onClick?.(event);

              handleClose();
            }}
          />
        ))}
      </Menu>
    </>
  );
};
