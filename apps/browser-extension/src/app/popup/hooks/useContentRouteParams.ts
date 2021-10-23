import { Perhaps } from '@scrapper-gate/shared/common';
import { useEffect, useState } from 'react';
import { getContentRoute } from '../../../extension/background/getContentRoute';
import {
  MessagesPayloadMap,
  MessageTypes,
  StoredRoute,
} from '../../../extension/browser/communication/messageResult.types';
import { useOnMessageListener } from '../../../extension/browser/hooks/useOnMessageListener/useOnMessageListener';
import { getActiveTab } from '../../../extension/browser/tabsQuery/getActiveTab';

type RouteExtractor<T = unknown> = (route: StoredRoute) => T;

export const useContentRouteParams = <T = unknown>(
  extractor: RouteExtractor<T>
) => {
  const [result, setResult] = useState<Perhaps<T>>();

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
      const newResult = extractor(route);

      setResult(newResult || null);
    }
  }, [extractor, route]);

  return result;
};
