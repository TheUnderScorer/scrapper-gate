import { GridApi, GridCellParams } from '@material-ui/data-grid';
import { ReactNode } from 'react';

export interface EditRowChildrenProps {
  name: string;
}

export interface EditRowProps extends Omit<GridCellParams, 'api'> {
  api: GridApi;
  name: string;
  children: (props: EditRowChildrenProps) => ReactNode;
}
