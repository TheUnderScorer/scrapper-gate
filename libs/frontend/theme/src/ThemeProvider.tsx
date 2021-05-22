import { Global, ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { CssBaseline } from '@material-ui/core';
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/styles';
import {
  stopPropagation,
  useContainerStore,
} from '@scrapper-gate/frontend/common';
import React, { PropsWithChildren, useMemo } from 'react';
import { palette } from './palette';
import { themeStyles } from './themeStyles';
import './typings/material-ui';

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
      createTheme({
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
        emojis: {
          empty: '😯',
          error: '😵',
          success: '😁',
        },
      }),
    [container, htmlFontSize, isContent, rest.htmlFontSize]
  );

  const styles = useMemo(() => themeStyles(theme), [theme]);

  return (
    <EmotionThemeProvider theme={theme}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Global styles={styles} />
        {children}
      </MuiThemeProvider>
    </EmotionThemeProvider>
  );
};
