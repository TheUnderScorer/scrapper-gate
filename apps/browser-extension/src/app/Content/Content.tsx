import React, { useState } from 'react';
import { useTokensStore } from '@scrapper-gate/frontend/domain/auth';
import { useCurrentUrlUpdater } from '../../extension/browser/hooks/useCurrentUrlUpdater';
import { useOnMessageListener } from '../../extension/browser/hooks/useOnMessageListener/useOnMessageListener';
import {
  ContentToggleHookPayload,
  MessagesPayloadMap,
  MessageTypes,
} from '../../extension/browser/communication/messageResult.types';
import { AppType, useAppType } from '@scrapper-gate/frontend/common';
import { useMount } from 'react-use';
import { useContentRouteStorage } from '../../extension/contentScript/hooks/useContentRouteStorage';
import { Route, Switch, useHistory } from 'react-router-dom';
import Root from '../../extension/contentScript/components/Root';
import { browserExtensionRoutes } from '@scrapper-gate/shared/routing';
import { ScrapperBuilderView } from './views/ScrapperBuilderView/ScrapperBuilderView';

const initialState: ContentToggleHookPayload = {
  visible: false,
  tokens: {},
};
const initialValue = async () => initialState;

export const Content = () => {
  const setTokens = useTokensStore((store) => store.setTokens);
  const setAppType = useAppType((store) => store.setAppType);

  const [visible, setVisible] = useState(true);

  const history = useHistory();

  useMount(() => {
    setAppType(AppType.ExtensionContentScript);
  });

  useOnMessageListener<MessageTypes.ToggleContent, MessagesPayloadMap>({
    type: MessageTypes.ToggleContent,
    initialValue,
    onMessage: ({ payload }) => {
      if (!payload || payload === initialState) {
        return;
      }

      const { tokens, path, visible } = payload;

      setVisible(Boolean(visible));

      if (tokens) {
        setTokens(tokens);
      }

      if (path) {
        history.push(path);
      }
    },
  });

  useContentRouteStorage();
  useCurrentUrlUpdater();

  if (!visible) {
    return null;
  }

  return (
    <Switch>
      <Route path="/" exact>
        <Root />
      </Route>
      <Route path={browserExtensionRoutes.content.scrapper()}>
        <ScrapperBuilderView />
      </Route>
    </Switch>
  );
};
