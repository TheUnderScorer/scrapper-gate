import {
  AppBar,
  IconButton,
  makeStyles,
  Toolbar,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Add, MenuSharp } from '@material-ui/icons';
import { browserExtensionRoutes } from '@scrapper-gate/shared/routing';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { BooleanParam, useQueryParam } from 'use-query-params';
import { useCreateScrapperExtension } from '../../hooks/useCreateScrapperExtension';
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
  addBtn: {
    marginLeft: 'auto',
  },
}));

export const PopupHeader = () => {
  const classes = useStyles();

  const [, setDrawerOpen] = useQueryParam(popupDrawerQueryKey, BooleanParam);

  const createScrapper = useCreateScrapperExtension();

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
                onClick={() => createScrapper()}
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
