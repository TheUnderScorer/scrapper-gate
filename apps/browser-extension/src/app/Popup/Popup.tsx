import React, { useEffect } from 'react';
import { useIsAuthorized } from '@scrapper-gate/frontend/domain/auth';
import { Route, Switch, useHistory } from 'react-router-dom';
import { browserExtensionRoutes } from '@scrapper-gate/shared/routing';
import { PopupAuthView } from './views/PopupAuthView';
import { useMount } from 'react-use';
import { AppType, useAppType } from '@scrapper-gate/frontend/common';
import { Layout } from '@scrapper-gate/frontend/ui';
import { PopupHeader } from './components/PopupHeader/PopupHeader';
import { Box } from '@material-ui/core';
import { PopupScrappersView } from './views/PopupScrappersView';

export const Popup = () => {
  const { isAuthorized } = useIsAuthorized();
  const history = useHistory();

  const setAppType = useAppType((store) => store.setAppType);

  useEffect(() => {
    if (!isAuthorized) {
      history.push(browserExtensionRoutes.popup.login);
    } else {
      history.push(browserExtensionRoutes.popup.scrappers);
    }
  }, [history, isAuthorized]);

  useMount(() => {
    setAppType(AppType.ExtensionPopup);
  });

  return (
    <Switch>
      {!isAuthorized && (
        <Route path={browserExtensionRoutes.popup.login}>
          <PopupAuthView />
        </Route>
      )}
      {isAuthorized && (
        <Box width="500px" height="500px">
          <Layout
            noGutters
            header={<PopupHeader />}
            headerHeight={56}
            body={
              <Route path={browserExtensionRoutes.popup.scrappers}>
                <PopupScrappersView />
              </Route>
            }
          />
        </Box>
      )}
    </Switch>
  );
};
