import { MouseEventHandler, ReactNode } from 'react';

export interface MenuItemProperties {
  title?: ReactNode;
  content?: ReactNode;
  icon?: ReactNode;
  onClick?: MouseEventHandler;
  href?: string;
  id: string;
  className?: string;
  children?: MenuItemProperties[];
  selected?: boolean;
  type?: 'item' | 'subHeader' | 'divider';
}
