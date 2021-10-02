import { Dispatch, SetStateAction } from 'react';

export interface OpenState {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export interface WithOpenState {
  useOpenStateProvider?: () => OpenState;
}
