import { colors, createTheme } from '@mui/material';
import { getContrast } from '@scrapper-gate/shared/common';

const defaultTheme = createTheme();

const primaryColor = colors.deepPurple;

export const primary = {
  dark: primaryColor['800'],
  main: primaryColor['500'],
  light: primaryColor['100'],
  contrastText: defaultTheme.palette.common.white,
};

export const palette = {
  ...defaultTheme.palette,
  primary,
  secondary: {
    dark: primaryColor['200'],
    contrastText: primary.dark,
    main: primary.light,
    light: primaryColor['50'],
  },
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
    sourceHandle: primary.main,
    targetHandle: colors.green['300'],
  },
  gradients: {
    primaryMainToDark: `linear-gradient(45deg, ${primary.main} 30%, ${primary.dark} 90%)`,
  },
  bordersColors: {
    outlinedInput:
      defaultTheme.palette.mode === 'light'
        ? 'rgba(0, 0, 0, 0.23)'
        : 'rgba(255, 255, 255, 0.23)',
  },
};
