import { ThemedSxProps } from '@scrapper-gate/frontend/theme';
import { MouseEventHandler, ReactNode } from 'react';

export interface MenuItemProperties extends ThemedSxProps {
  title?: ReactNode;
  content?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  onClick?: MouseEventHandler;
  href?: string;
  id: string;
  color?: string;
  className?: string;
  children?: MenuItemProperties[];
  selected?: boolean;
  type?: 'item' | 'subHeader' | 'divider' | 'input';
}
