import {
  Global,
  ThemeProvider as DefaultEmotionThemeProvider,
  ThemeProviderProps as EmotionThemeProviderProps,
} from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { useContainerStore } from '@scrapper-gate/frontend/common';
import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming';
import React, { ComponentType, PropsWithChildren, useMemo } from 'react';
import { getTheme } from './theme';
import { themeStyles } from './themeStyles';
import './typings/material-ui';

export interface ThemeProviderProps {
  htmlFontSize?: number;
  isContent?: boolean;
  container?: HTMLElement;
  EmotionThemeProvider?: ComponentType<EmotionThemeProviderProps>;
}

export const ThemeProvider = ({
  isContent,
  children,
  container: propContainer,
  EmotionThemeProvider = DefaultEmotionThemeProvider,
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
      getTheme({
        isContent,
        container,
        htmlFontSize: htmlFontSize ?? rest.htmlFontSize,
      }),
    [container, htmlFontSize, isContent, rest]
  );

  const styles = useMemo(() => themeStyles(theme), [theme]);

  return (
    <MuiThemeProvider theme={theme}>
      <EmotionThemeProvider theme={theme}>
        <CssBaseline />
        <Global styles={styles} />
        {children}
      </EmotionThemeProvider>
    </MuiThemeProvider>
  );
};
