import { Global, ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { createTheme, CssBaseline } from '@material-ui/core';
import { SimplePaletteColorOptions } from '@material-ui/core/styles/createPalette';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/styles';
import { useContainerStore } from '@scrapper-gate/frontend/common';
import React, { KeyboardEvent, PropsWithChildren, useMemo } from 'react';
import { Key } from 'ts-key-enum';
import { palette } from './palette';
import { themeStyles } from './themeStyles';
import './typings/material-ui';

export interface ThemeProviderProps {
  htmlFontSize?: number;
  isContent?: boolean;
  container?: HTMLElement;
}

const allowedKeys = [Key.ArrowUp, Key.ArrowDown, Key.Enter];

const conditionalStopPropagation = (event: KeyboardEvent) => {
  if (allowedKeys.includes(event.key as Key)) {
    return;
  }

  event.stopPropagation();
};

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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      parseInt(getComputedStyle(document.querySelector('html')!).fontSize, 10),
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
                color: (palette.primary as SimplePaletteColorOptions)
                  .contrastText,
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
          MuiAccordion: {
            variants: [
              {
                props: {
                  variant: 'transparent',
                },
                style: {
                  background: 'transparent',
                  border: 'none',
                },
              },
            ],
          },
          MuiDialog: {
            defaultProps: {
              container,
              disableEnforceFocus: isContent,
              disableAutoFocus: isContent,
              disableRestoreFocus: isContent,
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
              onKeyDown: conditionalStopPropagation,
              onKeyUp: conditionalStopPropagation,
              onKeyPress: conditionalStopPropagation,
            },
          },
          MuiTextField: {
            defaultProps: {
              onKeyDown: conditionalStopPropagation,
              onKeyUp: conditionalStopPropagation,
              onKeyPress: conditionalStopPropagation,
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
