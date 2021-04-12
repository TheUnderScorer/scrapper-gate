import create from 'zustand';
import { AppType } from '../types/appType';

export interface AppTypeStore {
  appType?: AppType;
  setAppType: (type: AppType) => void;

  [key: string]: unknown;
}

export const useAppType = create<AppTypeStore>((set) => ({
  appType: undefined,
  setAppType: (appType) => {
    set({
      appType,
    });
  },
}));
