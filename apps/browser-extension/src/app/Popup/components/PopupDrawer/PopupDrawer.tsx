import React, { useMemo } from 'react';
import { Layout, QueryDrawer } from '@scrapper-gate/frontend/ui';
import { MenuItemProperties } from '@scrapper-gate/frontend/common';
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@material-ui/core';
import { Assignment, Logout, Web } from '@material-ui/icons';
import { UserAvatar } from '@scrapper-gate/frontend/domain/user';
import { useGetCurrentUserQuery } from '@scrapper-gate/frontend/schema';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { browserExtensionRoutes } from '@scrapper-gate/shared/routing';
import { useLocation } from 'react-router';
import { useLogout } from '@scrapper-gate/frontend/domain/auth';

export const popupDrawerQueryKey = 'popupDrawer';

const useStyles = makeStyles((theme) => ({
  layout: {
    minWidth: '250px',
    paddingTop: theme.spacing(2),
  },
  avatar: {
    padding: `0 ${theme.spacing(2)}`,
  },
  logout: {
    '&, & svg': {
      color: theme.palette.error.main,
    },
  },
  divider: {
    margin: `${theme.spacing(1)} 0`,
  },
}));

export const PopupDrawer = () => {
  const classes = useStyles();

  const location = useLocation();
  const history = useHistory();

  const logout = useLogout();

  const drawerItems: MenuItemProperties[] = useMemo(
    () => [
      {
        id: 'scrapper_subheader',
        type: 'subHeader',
        content: 'Scrapper',
      },
      {
        icon: <Web />,
        content: 'My scrappers',
        selected: location.pathname.includes(
          browserExtensionRoutes.popup.scrappers
        ),
        id: 'my_scrappers',
        onClick: () => history.push(browserExtensionRoutes.popup.scrappers),
      },
      {
        icon: <Assignment />,
        id: 'scrapper_results',
        content: 'Scrapper results',
        selected: location.pathname.includes(
          browserExtensionRoutes.popup.scrapperResults
        ),
        onClick: () =>
          history.push(browserExtensionRoutes.popup.scrapperResults),
      },
      {
        type: 'divider',
        id: 'divider',
      },
      {
        id: 'logout',
        icon: <Logout />,
        content: 'Logout',
        className: classes.logout,
        onClick: logout,
      },
    ],
    [classes.logout, history, location.pathname, logout]
  );

  const { data } = useGetCurrentUserQuery();

  if (!data) {
    return null;
  }

  return (
    <QueryDrawer
      keepMounted={false}
      anchor="left"
      queryKey={popupDrawerQueryKey}
    >
      <Layout
        className={classes.layout}
        headerHeight={70}
        header={
          <UserAvatar
            className={classes.avatar}
            alignItems="flex-start"
            user={data.me}
            showName
          />
        }
        body={
          <>
            <Divider variant="fullWidth" />
            <List component="div">
              {drawerItems.map((item) => {
                if (item.type === 'subHeader') {
                  return (
                    <ListSubheader key={item.id} component="div">
                      {item.content}
                    </ListSubheader>
                  );
                }

                if (item.type === 'divider') {
                  return (
                    <Divider
                      key={item.id}
                      className={classes.divider}
                      variant="fullWidth"
                    />
                  );
                }

                return (
                  <ListItem
                    className={item.className}
                    onClick={item.onClick}
                    component="button"
                    button
                    selected={item.selected}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText>{item.content}</ListItemText>
                  </ListItem>
                );
              })}
            </List>
          </>
        }
      />
    </QueryDrawer>
  );
};
