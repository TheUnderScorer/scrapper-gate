import { Tooltip, withStyles } from '@material-ui/core';

export const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.common.black,
    boxShadow: theme.shadows[5],
  },
  arrow: {
    color: theme.palette.background.paper,
  },
}))(Tooltip);
