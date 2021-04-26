import { MouseEventHandler, ReactNode } from 'react';
import { MenuProps, PopoverPosition } from '@material-ui/core';
import { MenuItemProperties } from '@scrapper-gate/frontend/common';

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
