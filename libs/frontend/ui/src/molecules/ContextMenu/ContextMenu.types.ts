import { MenuProps, PopoverPosition } from '@mui/material';
import { MouseEventHandler, ReactNode } from 'react';
import { MenuItemProperties } from '../../types/menuItemProperties';

export interface ContextMenuChildrenBag {
  onContextMenu: MouseEventHandler;
}

export interface OpenCloseContextMenuBag {
  position?: PopoverPosition;
}

export interface ContextMenuProps {
  children?: (bag: ContextMenuChildrenBag) => ReactNode;
  menuItems: MenuItemProperties[];
  menuProps?: Omit<MenuProps, 'open' | 'anchorReference' | 'anchorPosition'>;
  onOpen?: (bag: OpenCloseContextMenuBag) => unknown;
  onClose?: (bag: OpenCloseContextMenuBag) => unknown;
}
