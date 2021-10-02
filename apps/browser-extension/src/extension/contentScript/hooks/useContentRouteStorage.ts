import { useMemo } from 'react';
import { useLocation } from 'react-router';
import { useDebounce } from 'react-use';
import { MessageTypes } from '../../browser/communication/messageResult.types';
import { useMessageSender } from '../../browser/hooks/useMessageSender/useMessageSender';
import { Target } from '../../browser/hooks/useMessageSender/useMessageSender.types';
import { useOnMessageListener } from '../../browser/hooks/useOnMessageListener/useOnMessageListener';

/**
 * Sends message every time content route changes, in order to keep track of it.
 * Thanks to it, if user refreshes page we can restore content state.
 * */
export const useContentRouteStorage = () => {
  const [send, { loading }] =
    useMessageSender<MessageTypes.ContentRouteChanged>({
      type: MessageTypes.ContentRouteChanged,
      target: Target.background,
    });

  const location = useLocation();

  const route = useMemo(
    () => ({
      pathname: location.pathname,
      search: location.search,
      state: location.state,
    }),
    [location.pathname, location.search, location.state]
  );

  useDebounce(
    () => {
      send(route).catch(console.error);
    },
    250,
    [route, send]
  );

  // Send current route if requested
  useOnMessageListener({
    type: MessageTypes.GetContentRoute,
    sendResponse: () => {
      return {
        result: true,
        payload: route,
      };
    },
  });

  return { loading };
};
