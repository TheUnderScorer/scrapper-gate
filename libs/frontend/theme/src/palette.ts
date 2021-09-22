import { colors, createTheme, PaletteOptions } from '@mui/material';
import { getContrast } from '@scrapper-gate/shared/common';
import tinycolor from 'tinycolor2';

const defaultTheme = createTheme();

export const primary = {
  dark: colors.deepPurple['800'],
  main: colors.deepPurple['500'],
  light: colors.deepPurple['100'],
  contrastText: defaultTheme.palette.common.white,
};

export const palette: PaletteOptions = {
  ...defaultTheme.palette,
  primary,
  primaryLight: tinycolor(primary.dark).setAlpha(0.5).toRgbString(),
  success: {
    ...defaultTheme.palette.success,
    contrastText: defaultTheme.palette.common.white,
  },
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
};
