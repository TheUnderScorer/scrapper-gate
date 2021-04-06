/* eslint-disable @typescript-eslint/no-empty-interface */
import { PaletteColorOptions } from '@material-ui/core';
import { Palette, PaletteColor } from '@material-ui/core/styles/createPalette';
import { Theme } from '@material-ui/core/styles';

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

export interface BasePalette<TOption> {
  primaryLight?: TOption;
  greyVariant: TOption;
  flowBuilderColors: FlowBuilderColors;
}

export interface AppTheme extends Theme {
  palette: Palette & BasePalette<PaletteColor> & FlowBuilderColors;
}

declare module '@material-ui/core/styles/createPalette' {
  interface PaletteOptions extends BasePalette<PaletteColorOptions> {}

  interface Palette extends BasePalette<PaletteColor> {}
}

declare module '@material-ui/core/styles/createMixins' {
  interface Mixins {
    greyBorder: () => string;
  }

  interface MixinsOptions extends Partial<Mixins> {}
}
