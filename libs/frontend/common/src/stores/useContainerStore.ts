import create from 'zustand';

export interface ContainerStore {
  container?: HTMLElement;
  shadowRoot?: ShadowRoot;
  setContainer: (container: HTMLElement) => void;
  setShadowRoot: (root?: ShadowRoot) => void;

  [key: string]: unknown;
}

export const useContainerStore = create<ContainerStore>((set) => ({
  container: undefined,
  shadowRoot: undefined,
  setShadowRoot: (root) => {
    set({
      shadowRoot: root,
    });
  },
  setContainer: (container) => {
    set({
      container,
    });
  },
}));
