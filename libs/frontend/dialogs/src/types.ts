import { ReactNode } from 'react';

export interface DialogProps {
  id: string;
}

export interface Dialog extends DialogProps {
  content: ReactNode;
}

export interface DialogContext {
  push: (dialog: Dialog) => unknown;
  pull: (id: string) => unknown;
}
