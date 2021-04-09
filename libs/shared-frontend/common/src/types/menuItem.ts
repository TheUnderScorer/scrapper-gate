import { MouseEventHandler, ReactNode } from 'react';

export interface MenuItem {
  title?: ReactNode;
  content?: ReactNode;
  icon?: ReactNode;
  onClick?: MouseEventHandler;
  id: string;
}
