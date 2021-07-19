import { ReactNode } from 'react';
import { SelectablePaperProps } from '../SelectablePaper/SelectablePaper';

export interface TileRadioProps extends SelectablePaperProps {
  title: string;
  icon?: ReactNode;
  description?: string;
}
