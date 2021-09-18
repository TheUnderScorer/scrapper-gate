import { PaperProps } from '@mui/material';
import { ThemedSxProps } from '@scrapper-gate/frontend/theme';
import { ResizableProps } from 're-resizable';

export interface ResizablePanelProps extends ResizableProps, ThemedSxProps {
  paperProps?: PaperProps;
  initialWidth: string | number;
  hideArrow?: boolean;
  disableKeyShortcut?: boolean;
}
