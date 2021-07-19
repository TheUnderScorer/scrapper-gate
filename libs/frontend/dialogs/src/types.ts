import { ReactNode } from 'react';

export interface BaseDialogProps {
  onCancel?: () => unknown;
}

export interface DialogProperties {
  content: ReactNode;
  id: string;
}

export interface DialogContext {
  push: (dialog: DialogProperties) => unknown;
  pull: (id: string) => unknown;
}
