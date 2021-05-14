import { useEffect, useState } from 'react';
import { getActiveTab } from '../tabsQuery/getActiveTab';
import { AppType, useAppType } from '@scrapper-gate/frontend/common';
import { browser } from 'webextension-polyfill-ts';

export const useActiveTabUrl = () => {
  const appType = useAppType((store) => store.appType);
  const [url, setUrl] = useState('');

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
  }, [appType]);

  return url;
};
