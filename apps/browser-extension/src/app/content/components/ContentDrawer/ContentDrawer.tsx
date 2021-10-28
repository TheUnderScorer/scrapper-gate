import { KeyboardArrowLeft, Menu } from '@mui/icons-material';
import { Box, Fab, Toolbar } from '@mui/material';
import {
  Layout,
  LayoutProps,
  QueryDrawer,
  QueryDrawerProps,
} from '@scrapper-gate/frontend/ui';
import classNames from 'classnames';
import React, { PropsWithChildren, useCallback } from 'react';
import { BooleanParam, useQueryParam } from 'use-query-params';
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
  const [drawerOpen, setDrawerOpen] = useQueryParam(queryKey, BooleanParam);

  const toggleDrawer = useCallback(() => {
    setDrawerOpen(!drawerOpen);
  }, [drawerOpen, setDrawerOpen]);

  return (
    <Box width={propWidth} overflow="visible" position="fixed" height="100%">
      <FadeIfPicking>
        <Fab
          onClick={toggleDrawer}
          className={classNames({ drawerOpen })}
          color={drawerOpen ? 'default' : 'primary'}
          sx={{
            position: 'absolute',
            pointerEvents: 'all',
            top: (theme) => theme.spacing(2),
            left: (theme) => theme.spacing(2),
            zIndex: (theme) => theme.zIndex.modal - 1,
          }}
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
            sx: {
              width: propWidth,
              overflowY: 'visible',
            },
          }}
          className="manage-scrapper-drawer"
          sx={{
            zIndex: (theme) => theme.zIndex.modal,
            width: propWidth,
            pointerEvents: 'all',
          }}
          disablePortal
          keepMounted
          anchor="left"
        >
          <Fab
            onClick={toggleDrawer}
            sx={{
              top: '50%',
              right: '-30px',
              position: 'absolute',
              zIndex: (theme) => theme.zIndex.modal + 1,
            }}
            color="default"
          >
            <KeyboardArrowLeft />
          </Fab>
          <Layout
            noGutters
            headerHeight={header ? 100 : 0}
            header={
              header && (
                <Toolbar
                  sx={{
                    display: 'flex',
                    height: '100%',
                    alignItems: 'center',
                  }}
                  className="toolbar"
                >
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
