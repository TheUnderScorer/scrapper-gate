import {
  AppType,
  useAppType,
  useCurrentUrl,
} from '@scrapper-gate/frontend/common';
import { useEffect } from 'react';
import browser from 'webextension-polyfill';
import { getActiveTab } from '../tabsQuery/getActiveTab';

export const useCurrentUrlUpdater = () => {
  const appType = useAppType((store) => store.appType);

  const setUrl = useCurrentUrl((store) => store.setCurrentUrl);

  useEffect(() => {
    if (!appType || appType === AppType.ExtensionContentScript) {
      const url = document.location.toString();

      if (url.startsWith('chrome-extension')) {
        return;
      }

      setUrl(url);

      return;
    }

    getActiveTab().then((tab) => {
      if (tab?.url) {
        setUrl(tab.url);
      }
    });

    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (!tab?.active) {
        return;
      }

      setUrl(tab.url ?? '');
    });
  }, [appType, setUrl]);
};
