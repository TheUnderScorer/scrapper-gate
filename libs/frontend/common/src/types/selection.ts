import { ReactNode } from 'react';

export interface Selection<T = unknown> {
  label: string;
  icon?: ReactNode;
  value: T;
}

export interface DragItemSelection<T = unknown> extends Selection<T> {
  type?: string;
}
