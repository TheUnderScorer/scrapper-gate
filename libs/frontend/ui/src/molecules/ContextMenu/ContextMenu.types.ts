import { MouseEventHandler, ReactNode } from 'react';
import { MenuProps } from '@material-ui/core';
import { MenuItemProperties } from '@scrapper-gate/frontend/common';

export interface ContextMenuChildrenBag {
  onContextMenu: MouseEventHandler;
}

export interface ContextMenuProps {
  children?: (bag: ContextMenuChildrenBag) => ReactNode;
  menuItems: MenuItemProperties[];
  menuProps?: Omit<MenuProps, 'open' | 'anchorReference' | 'anchorPosition'>;
}
