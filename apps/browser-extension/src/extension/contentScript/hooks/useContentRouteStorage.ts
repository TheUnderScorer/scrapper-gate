import { useLocation } from 'react-router';
import { useEffect } from 'react';
import { useMessageSender } from '../../browser/hooks/useMessageSender/useMessageSender';
import { MessageTypes } from '../../browser/communication/types';
import { Target } from '../../browser/hooks/useMessageSender/useMessageSender.types';

/**
 * Sends message every time content route changes, in order to keep track of it.
 * Thanks to it, if user refreshes page we can restore content state.
 * */
export const useContentRouteStorage = () => {
  const [
    send,
    { loading },
  ] = useMessageSender<MessageTypes.ContentRouteChanged>({
    type: MessageTypes.ContentRouteChanged,
    target: Target.background,
  });

  const location = useLocation();

  useEffect(() => {
    send({
      pathname: location.pathname,
      search: location.search,
      state: location.state,
    }).catch(console.error);
  }, [location, send]);

  return { loading };
};
