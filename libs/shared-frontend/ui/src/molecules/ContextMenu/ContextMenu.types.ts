import { ReactNode } from 'react';
import { BoxProps, MenuProps } from '@material-ui/core';
import { MenuItem } from '@scrapper-gate/shared-frontend/common';

export interface ContextMenuProps {
  children?: ReactNode;
  menuItems: MenuItem[];
  menuProps?: Omit<MenuProps, 'open' | 'anchorReference' | 'anchorPosition'>;
  boxProps?: Omit<BoxProps, 'onContextMenu'>;
}
