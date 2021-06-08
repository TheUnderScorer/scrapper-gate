import { ResizableProps } from 're-resizable';
import { PaperProps } from '@material-ui/core';

export interface ResizablePanelProps extends ResizableProps {
  paperProps?: PaperProps;
  initialWidth: string | number;
  hideArrow?: boolean;
  disableKeyShortcut?: boolean;
}
