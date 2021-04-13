import './typings/material-ui';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/styles';
import { colors, createMuiTheme } from '@material-ui/core';
import React, { PropsWithChildren, useMemo } from 'react';
import { getContrast } from '@scrapper-gate/shared/common';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';

export interface ThemeProviderProps {
  htmlFontSize?: number;
  isContent?: boolean;
  container?: HTMLElement;
}

const defaultTheme = createMuiTheme();

export const ThemeProvider = ({
  isContent,
  children,
  container,
  ...rest
}: PropsWithChildren<ThemeProviderProps>) => {
  const htmlFontSize = useMemo(
    () =>
      parseInt(getComputedStyle(document.querySelector('html')).fontSize, 10),
    []
  );

  const primary = {
    dark: colors.deepPurple['800'],
    main: colors.deepPurple['500'],
    light: colors.deepPurple['100'],
  };

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          primary,
          greyVariant: colors.grey,
          flowBuilderColors: {
            condition: colors.orange['500'],
            conditionText: getContrast(colors.orange['500']),
            action: colors.blue['500'],
            actionText: getContrast(colors.blue['500']),
            start: colors.green['500'],
            startText: defaultTheme.palette.common.white,
            end: defaultTheme.palette.error.main,
            endText: defaultTheme.palette.common.white,
          },
          gradients: {
            primaryMainToDark: `linear-gradient(45deg, ${primary.main} 30%, ${primary.dark} 90%)`,
          },
        },
        components: {
          MuiButton: {
            defaultProps: {
              disableElevation: true,
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
              onKeyDown: (e) => e.stopPropagation(),
              onKeyUp: (e) => e.stopPropagation(),
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
    [container, htmlFontSize, isContent, rest]
  );

  return (
    <EmotionThemeProvider theme={theme}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </EmotionThemeProvider>
  );
};
