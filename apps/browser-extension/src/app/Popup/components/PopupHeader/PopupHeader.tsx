import React from 'react';
import {
  AppBar,
  IconButton,
  makeStyles,
  Stack,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { MenuSharp } from '@material-ui/icons';
import { Route, Switch } from 'react-router-dom';
import { browserExtensionRoutes } from '@scrapper-gate/shared/routing';
import { BooleanParam, useQueryParam } from 'use-query-params';
import { popupDrawerQueryKey } from '../PopupDrawer/PopupDrawer';

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
}));

export const PopupHeader = () => {
  const classes = useStyles();

  const [, setDrawerOpen] = useQueryParam(popupDrawerQueryKey, BooleanParam);

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
            <Stack alignItems="center" direction="row" spacing={1}>
              <Route path={browserExtensionRoutes.popup.scrappers}>
                Scrappers
              </Route>
            </Stack>
          </Switch>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
