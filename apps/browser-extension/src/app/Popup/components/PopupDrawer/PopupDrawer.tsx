import { Assignment, Logout, Web } from '@mui/icons-material';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  styled,
} from '@mui/material';
import { useLogout } from '@scrapper-gate/frontend/domain/auth';
import { UserAvatar } from '@scrapper-gate/frontend/domain/user';
import { useGetCurrentUserQuery } from '@scrapper-gate/frontend/schema';
import {
  Layout,
  MenuItemProperties,
  QueryDrawer,
} from '@scrapper-gate/frontend/ui';
import { browserExtensionRoutes } from '@scrapper-gate/shared/routing';
import React, { useMemo } from 'react';
import { useLocation } from 'react-router';
import { useHistory } from 'react-router-dom';

export const popupDrawerQueryKey = 'popupDrawer';

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: `${theme.spacing(1)} 0`,
}));

export const PopupDrawer = () => {
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
        id: 'scrapper_runs',
        content: 'Scrapper runs',
        selected: location.pathname.includes(
          browserExtensionRoutes.popup.scrapperRuns
        ),
        onClick: () => history.push(browserExtensionRoutes.popup.scrapperRuns),
      },
      {
        type: 'divider',
        id: 'divider',
      },
      {
        id: 'logout',
        icon: <Logout />,
        content: 'Logout',
        className: 'logout',
        onClick: logout,
        sx: {
          '&, & svg': {
            color: (theme) => theme.palette.error.main,
          },
        },
      },
    ],
    [history, location.pathname, logout]
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
        sx={{
          minWidth: '250px',
          paddingTop: (theme) => theme.spacing(2),
        }}
        headerHeight={70}
        header={
          data?.me && (
            <Box height="100%" display="flex" alignItems="center">
              <UserAvatar
                alignItems="flex-start"
                user={data.me}
                showName
                sx={{
                  padding: (theme) => `0 ${theme.spacing(2)}`,
                }}
              />
            </Box>
          )
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
                  return <StyledDivider key={item.id} variant="fullWidth" />;
                }

                return (
                  <ListItem
                    className={item.className}
                    onClick={item.onClick}
                    component="button"
                    button
                    selected={item.selected}
                    key={item.id}
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
