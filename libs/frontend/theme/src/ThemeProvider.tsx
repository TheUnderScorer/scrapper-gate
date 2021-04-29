import './typings/material-ui';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/styles';
import { createMuiTheme, CssBaseline } from '@material-ui/core';
import React, { PropsWithChildren, useMemo } from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { palette } from './palette';
import {
  stopPropagation,
  useContainerStore,
} from '@scrapper-gate/frontend/common';
import { shadeColor } from '@scrapper-gate/shared/common';

export interface ThemeProviderProps {
  htmlFontSize?: number;
  isContent?: boolean;
  container?: HTMLElement;
}

export const ThemeProvider = ({
  isContent,
  children,
  container: propContainer,
  ...rest
}: PropsWithChildren<ThemeProviderProps>) => {
  const storeContainer = useContainerStore((store) => store.container);
  const container = propContainer ?? storeContainer;

  const htmlFontSize = useMemo(
    () =>
      parseInt(getComputedStyle(document.querySelector('html')).fontSize, 10),
    []
  );

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette,
        components: {
          MuiButton: {
            defaultProps: {
              disableElevation: true,
            },
            styleOverrides: {
              containedPrimary: {
                background: palette.gradients.primaryMainToDark,
                color: palette.text.primary,
              },
            },
          },
          MuiFab: {
            styleOverrides: {
              primary: {
                '&:not[disabled]': {
                  background: palette.gradients.primaryMainToDark,
                },
              },
            },
          },
          MuiPopover: {
            defaultProps: {
              disableEnforceFocus: isContent,
              container,
            },
          },
          MuiTooltip: {
            defaultProps: {
              PopperProps: {
                container,
              },
            },
          },
          MuiModal: {
            defaultProps: {
              disableEnforceFocus: isContent,
            },
          },
          MuiMenu: {
            defaultProps: {
              container,
              style: {
                pointerEvents: 'all',
              },
            },
          },
          MuiDialog: {
            defaultProps: {
              container,
              disableEnforceFocus: isContent,
              BackdropProps: {
                style: {
                  pointerEvents: 'all',
                },
              },
              PaperProps: {
                style: {
                  pointerEvents: 'all',
                },
              },
            },
          },
          MuiInput: {
            defaultProps: {
              onKeyDown: stopPropagation,
              onKeyUp: stopPropagation,
              onKeyPress: stopPropagation,
            },
          },
          MuiTextField: {
            defaultProps: {
              onKeyDown: stopPropagation,
              onKeyUp: stopPropagation,
              onKeyPress: stopPropagation,
            },
          },
        },
        typography: {
          fontSize: 13,
          htmlFontSize: rest.htmlFontSize ?? htmlFontSize,
        },
        zIndex: {
          modal: 1400,
        },
      }),
    [container, htmlFontSize, isContent, rest.htmlFontSize]
  );

  return (
    <EmotionThemeProvider theme={theme}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </EmotionThemeProvider>
  );
};
