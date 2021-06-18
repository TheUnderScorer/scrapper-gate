import { useEffect, useState } from 'react';
import { useOnMessageListener } from '../../../extension/browser/hooks/useOnMessageListener/useOnMessageListener';
import {
  MessagesPayloadMap,
  MessageTypes,
} from '../../../extension/browser/communication/messageResult.types';
import { extractScrapperIdFromRoute } from '@scrapper-gate/shared/routing';
import { getContentRoute } from '../../../extension/background/getContentRoute';
import { getActiveTab } from '../../../extension/browser/tabsQuery/getActiveTab';

export const useActiveScrapperInContent = () => {
  const [scrapperId, setScrapperId] = useState<null | string>(null);

  const route = useOnMessageListener<
    MessageTypes.ContentRouteChanged,
    MessagesPayloadMap
  >({
    type: MessageTypes.ContentRouteChanged,
    initialValue: async () => {
      const tab = await getActiveTab();

      return tab.id ? getContentRoute(tab.id) : null;
    },
  });

  useEffect(() => {
    if (route) {
      const id = extractScrapperIdFromRoute(route?.pathname ?? '');

      setScrapperId(id || null);
    }
  }, [route]);

  return {
    scrapperId,
  };
};
