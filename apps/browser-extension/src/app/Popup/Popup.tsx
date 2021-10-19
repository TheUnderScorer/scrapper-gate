import { Box, CircularProgress } from '@mui/material';
import { AppType, useAppType } from '@scrapper-gate/frontend/common';
import { useIsAuthorized } from '@scrapper-gate/frontend/domain/auth';
import { Centered, Layout } from '@scrapper-gate/frontend/ui';
import { browserExtensionRoutes } from '@scrapper-gate/shared/routing';
import React, { useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useMount } from 'react-use';
import { PopupDrawer } from './components/PopupDrawer/PopupDrawer';
import { PopupHeader } from './components/PopupHeader/PopupHeader';
import { PopupAuthView } from './views/PopupAuthView';
import { PopupScrapperRunsView } from './views/PopupScrapperRunsView';
import { PopupScrappersView } from './views/PopupScrappersView';

export const Popup = () => {
  const { isAuthorized, loading } = useIsAuthorized();
  const history = useHistory();

  const setAppType = useAppType((store) => store.setAppType);

  useEffect(() => {
    if (!isAuthorized) {
      history.push(browserExtensionRoutes.popup.login);

      return;
    }

    history.push(browserExtensionRoutes.popup.scrappers);
  }, [history, isAuthorized]);

  useMount(() => {
    setAppType(AppType.ExtensionPopup);
  });

  return (
    <Switch>
      {loading && (
        <Box width="500px" height="500px">
          <Centered>
            <CircularProgress />
          </Centered>
        </Box>
      )}
      {!loading && (
        <>
          {!isAuthorized && (
            <Route path={browserExtensionRoutes.popup.login}>
              <PopupAuthView />
            </Route>
          )}
          {isAuthorized && (
            <Box className="popup-content" width="500px" height="500px">
              <PopupDrawer />
              <Layout
                noGutters
                header={<PopupHeader />}
                headerHeight={56}
                body={
                  <>
                    <Route path={browserExtensionRoutes.popup.scrappers}>
                      <PopupScrappersView />
                    </Route>
                    <Route path={browserExtensionRoutes.popup.scrapperRuns}>
                      <PopupScrapperRunsView />
                    </Route>
                  </>
                }
              />
            </Box>
          )}
        </>
      )}
    </Switch>
  );
};
