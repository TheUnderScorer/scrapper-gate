/* eslint-disable @typescript-eslint/no-empty-interface */
import '@material-ui/core';
import { colors } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { Palette } from '@material-ui/core/styles/createPalette';

interface FlowBuilderColors {
  action: string;
  actionText: string;
  condition: string;
  conditionText: string;
  start: string;
  startText: string;
  end: string;
  endText: string;
}

interface Gradients {
  primaryMainToDark: string;
}

export interface BasePalette {
  primaryLight: string;
  greyVariant: typeof colors.grey;
  flowBuilderColors: FlowBuilderColors;
  gradients: Gradients;
}

export interface Emojis {
  empty: string;
  success: string;
  error: string;
}

export interface AppTheme extends Theme {
  palette: Palette & BasePalette & FlowBuilderColors;
  emojis: Emojis;
}

declare module '@material-ui/core' {
  interface ThemeOptions {
    emojis: Emojis;
  }

  interface Theme {
    emojis: Emojis;
  }
}

declare module '@material-ui/private-theming/defaultTheme' {
  export interface DefaultTheme extends AppTheme {}
}

declare module '@material-ui/core/styles/createPalette' {
  interface PaletteOptions extends BasePalette {}

  interface Palette extends BasePalette {}
}

declare module '@material-ui/core/styles/createMixins' {
  interface Mixins {
    greyBorder: () => string;
  }

  interface MixinsOptions extends Partial<Mixins> {}
}

declare module '@material-ui/core/Button/Button' {
  interface ButtonPropsColorOverrides {
    error: true;
    info: true;
    success: true;
    warning: true;
  }
}
