import { useEffect, useState } from 'react';
import { getActiveTab } from '../tabsQuery/getActiveTab';
import { useRecoilValue } from 'recoil';
import {
  ExtensionSource,
  extensionSource,
} from '../state/atoms/extensionSource';

export const useActiveTabUrl = () => {
  const extensionSourceValue = useRecoilValue(extensionSource);
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (
      !extensionSourceValue ||
      extensionSourceValue === ExtensionSource.Content
    ) {
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

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (!tab.active) {
        return;
      }

      setUrl(tab.url ?? '');
    });
  }, [extensionSourceValue]);

  return url;
};
