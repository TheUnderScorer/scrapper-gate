import { ReactNode } from 'react';
import { BoxProps, MenuProps } from '@material-ui/core';
import { MenuItemProperties } from '@scrapper-gate/shared-frontend/common';

export interface ContextMenuProps {
  children?: ReactNode;
  menuItems: MenuItemProperties[];
  menuProps?: Omit<MenuProps, 'open' | 'anchorReference' | 'anchorPosition'>;
  boxProps?: Omit<BoxProps, 'onContextMenu'>;
}
