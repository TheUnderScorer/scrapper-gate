import { createTheme, Tooltip } from '@mui/material';
import { withStyles } from '@mui/styles';

export const LightTooltip = withStyles(
  (theme) => ({
    tooltip: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.common.black,
      boxShadow: theme.shadows[5],
      maxWidth: 600,
    },
    arrow: {
      color: theme.palette.background.paper,
    },
  }),
  {
    withTheme: true,
    defaultTheme: createTheme(),
  }
)(Tooltip);
