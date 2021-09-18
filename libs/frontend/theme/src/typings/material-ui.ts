/* eslint-disable @typescript-eslint/no-empty-interface */
import { colors, Theme } from '@mui/material';
import { Palette } from '@mui/material/styles';

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

declare module '@mui/material/styles' {
  interface ThemeOptions {
    emojis: Emojis;
  }

  interface Theme {
    emojis: Emojis;
  }
}

declare module '@mui/styles/defaultTheme' {
  export interface DefaultTheme extends AppTheme {}
}

declare module '@mui/material/styles/createPalette' {
  interface PaletteOptions extends BasePalette {}

  interface Palette extends BasePalette {}
}

declare module '@mui/material/styles/createMixins' {
  interface Mixins {
    greyBorder: () => string;
  }

  interface MixinsOptions extends Partial<Mixins> {}
}

declare module '@mui/material/Button/Button' {
  interface ButtonPropsColorOverrides {
    error: true;
    info: true;
    success: true;
    warning: true;
  }
}

declare module '@mui/material/Paper/Paper' {
  interface PaperPropsVariantOverrides {
    transparent: true;
  }
}
