import React, { PropsWithChildren, useCallback } from 'react';
import { BooleanParam, useQueryParam } from 'use-query-params';
import { Box, Fab, Toolbar } from '@material-ui/core';
import classNames from 'classnames';
import { KeyboardArrowLeft, Menu } from '@material-ui/icons';
import {
  Layout,
  LayoutProps,
  QueryDrawer,
  QueryDrawerProps,
} from '@scrapper-gate/frontend/ui';
import { useStyles } from './ContentDrawer.styles';
import { FadeIfPicking } from '../FadeIfPicking/FadeIfPicking';

export interface ContentDrawerProps
  extends Pick<LayoutProps, 'footer' | 'footerHeight' | 'header'>,
    Pick<QueryDrawerProps, 'queryKey'> {
  width?: number | string;
}

export const ContentDrawer = ({
  footerHeight,
  footer,
  children,
  header,
  width: propWidth = '80vw',
  queryKey,
}: PropsWithChildren<ContentDrawerProps>) => {
  const classes = useStyles({
    width: propWidth,
  });

  const [drawerOpen, setDrawerOpen] = useQueryParam(queryKey, BooleanParam);

  const toggleDrawer = useCallback(() => {
    setDrawerOpen(!drawerOpen);
  }, [drawerOpen, setDrawerOpen]);

  return (
    <Box width={propWidth} overflow="visible" position="fixed" height="100%">
      <FadeIfPicking>
        <Fab
          onClick={toggleDrawer}
          className={classNames(classes.fab, { drawerOpen })}
          color={drawerOpen ? 'default' : 'primary'}
        >
          <Menu />
        </Fab>
      </FadeIfPicking>
      <FadeIfPicking>
        <QueryDrawer
          queryKey={queryKey}
          disableScrollLock
          disableEscapeKeyDown
          PaperProps={{
            className: classes.paper,
          }}
          className={classNames(
            classes.drawer,
            classes.item,
            'manage-scrapper-drawer'
          )}
          disablePortal
          keepMounted
          anchor="left"
        >
          <Fab
            onClick={toggleDrawer}
            className={classes.fabDrawer}
            color="default"
          >
            <KeyboardArrowLeft />
          </Fab>
          <Layout
            noGutters
            headerHeight={header ? 100 : 0}
            header={
              header && (
                <Toolbar className={classNames(classes.toolbar, 'toolbar')}>
                  {header}
                </Toolbar>
              )
            }
            footerHeight={footerHeight}
            body={children}
            footer={footer}
          />
        </QueryDrawer>
      </FadeIfPicking>
    </Box>
  );
};
