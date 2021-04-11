import { MouseEventHandler, ReactNode } from 'react';

export interface MenuItemProperties {
  title?: ReactNode;
  content?: ReactNode;
  icon?: ReactNode;
  onClick?: MouseEventHandler;
  id: string;
  className?: string;
}
