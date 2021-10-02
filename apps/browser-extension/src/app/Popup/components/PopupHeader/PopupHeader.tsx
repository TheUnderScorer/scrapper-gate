import { Add, MenuSharp } from '@mui/icons-material';
import {
  AppBar,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { browserExtensionRoutes } from '@scrapper-gate/shared/routing';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { BooleanParam, useQueryParam } from 'use-query-params';
import { useCreateScrapperExtension } from '../../hooks/useCreateScrapperExtension';
import { popupDrawerQueryKey } from '../PopupDrawer/PopupDrawer';

export const PopupHeader = () => {
  const [, setDrawerOpen] = useQueryParam(popupDrawerQueryKey, BooleanParam);

  const createScrapper = useCreateScrapperExtension();

  return (
    <AppBar
      position="static"
      sx={{
        marginBottom: (theme) => theme.spacing(2),
      }}
    >
      <Toolbar
        sx={{
          paddingLeft: (theme) => theme.spacing(2),
          paddingRight: (theme) => theme.spacing(2),
        }}
      >
        <IconButton
          onClick={() => setDrawerOpen(true, 'push')}
          edge="start"
          color="inherit"
          aria-label="Open drawer"
          size="large"
        >
          <MenuSharp />
        </IconButton>
        <Typography variant="h6" noWrap>
          <Switch>
            <Route path={browserExtensionRoutes.popup.scrappers}>
              Scrappers
            </Route>
            <Route path={browserExtensionRoutes.popup.scrapperRuns}>
              Scrapper runs
            </Route>
          </Switch>
        </Typography>
        <Switch>
          <Route path={browserExtensionRoutes.popup.scrappers}>
            <Tooltip title="Create scrapper">
              <IconButton
                color="inherit"
                sx={{
                  marginLeft: 'auto',
                }}
                onClick={() => createScrapper()}
                size="large"
              >
                <Add />
              </IconButton>
            </Tooltip>
          </Route>
        </Switch>
      </Toolbar>
    </AppBar>
  );
};
