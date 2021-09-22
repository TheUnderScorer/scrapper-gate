import { PaperProps } from '@mui/material';
import { WithOpenState } from '@scrapper-gate/frontend/common';
import { ThemedSxProps } from '@scrapper-gate/frontend/theme';
import { ResizableProps } from 're-resizable';

export interface ResizablePanelProps
  extends ResizableProps,
    ThemedSxProps,
    WithOpenState {
  paperProps?: PaperProps;
  initialWidth: string | number;
  hideArrow?: boolean;
  disableKeyShortcut?: boolean;
}
