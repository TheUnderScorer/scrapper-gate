import React, { useEffect } from 'react';
import { PopupContainer } from './Container/PopupContainer';
import {
  Auth,
  useIsAuthorized,
} from '@scrapper-gate/shared-frontend/domain/auth';
import { Route, Switch, useHistory } from 'react-router-dom';
import { browserExtensionRoutes } from '@scrapper-gate/shared/routing';

export const Popup = () => {
  const { isAuthorized } = useIsAuthorized();
  const history = useHistory();

  useEffect(() => {
    if (!isAuthorized) {
      history.push(browserExtensionRoutes.popup.login);
    } else {
      history.push(browserExtensionRoutes.popup.scrappers);
    }
  }, [history, isAuthorized]);

  return (
    <PopupContainer height="500px" width="350px">
      <Switch>
        {!isAuthorized && (
          <Route path={browserExtensionRoutes.popup.login}>
            <Auth btnSectionWidth="100%" />
          </Route>
        )}
        {isAuthorized && (
          <Route path={browserExtensionRoutes.popup.scrappers}>
            Hello user!
          </Route>
        )}
      </Switch>
    </PopupContainer>
  );
};
