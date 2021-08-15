import create from 'zustand';

export interface CurrentUrlStore {
  currentUrl?: string;
  setCurrentUrl: (url?: string) => void;

  [key: string]: unknown;
}

export const useCurrentUrl = create<CurrentUrlStore>((set) => ({
  // Stores current url, or in case of browser extension - url of active tab
  currentUrl: window.document.location.toString(),
  setCurrentUrl: (url) => {
    set({
      currentUrl: url,
    });
  },
}));
