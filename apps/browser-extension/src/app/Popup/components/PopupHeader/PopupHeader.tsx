import React from 'react';
import {
  AppBar,
  CircularProgress,
  IconButton,
  makeStyles,
  Toolbar,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Add, MenuSharp } from '@material-ui/icons';
import { Route, Switch } from 'react-router-dom';
import { browserExtensionRoutes } from '@scrapper-gate/shared/routing';
import { BooleanParam, useQueryParam } from 'use-query-params';
import { popupDrawerQueryKey } from '../PopupDrawer/PopupDrawer';
import { useCreateScrapperExtension } from '../../hooks/useCreateScrapperExtension';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  appBar: {
    marginBottom: theme.spacing(2),
  },
  menuBtn: {
    marginRight: theme.spacing(2),
  },
  addBtn: {
    marginLeft: 'auto',
  },
}));

export const PopupHeader = () => {
  const classes = useStyles();

  const [, setDrawerOpen] = useQueryParam(popupDrawerQueryKey, BooleanParam);

  const [
    createScrapper,
    { loading: createScrapperLoading },
  ] = useCreateScrapperExtension();

  return (
    <AppBar className={classes.appBar} position="static">
      <Toolbar className={classes.toolbar}>
        <IconButton
          onClick={() => setDrawerOpen(true, 'push')}
          className={classes.menuBtn}
          edge="start"
          color="inherit"
          aria-label="Open drawer"
        >
          <MenuSharp />
        </IconButton>
        <Typography variant="h6" noWrap>
          <Switch>
            <Route path={browserExtensionRoutes.popup.scrappers}>
              Scrappers
            </Route>
          </Switch>
        </Typography>
        <Switch>
          <Route path={browserExtensionRoutes.popup.scrappers}>
            <Tooltip title="Create scrapper">
              <IconButton
                color="inherit"
                className={classes.addBtn}
                disabled={createScrapperLoading}
                onClick={() => createScrapper()}
              >
                {createScrapperLoading ? (
                  <CircularProgress size={15} color="inherit" />
                ) : (
                  <Add />
                )}
              </IconButton>
            </Tooltip>
          </Route>
        </Switch>
      </Toolbar>
    </AppBar>
  );
};
