import create from 'zustand';

export interface ContainerStore {
  container?: HTMLElement;
  setContainer: (container: HTMLElement) => void;

  [key: string]: unknown;
}

export const useContainerStore = create<ContainerStore>((set) => ({
  container: undefined,
  setContainer: (container) => {
    set({
      container,
    });
  },
}));
