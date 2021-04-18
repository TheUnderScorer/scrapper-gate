import { colors, createMuiTheme, PaletteOptions } from '@material-ui/core';
import { getContrast } from '@scrapper-gate/shared/common';

const defaultTheme = createMuiTheme();

const primary = {
  dark: colors.deepPurple['800'],
  main: colors.deepPurple['500'],
  light: colors.deepPurple['100'],
};

export const palette: PaletteOptions = {
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
};
