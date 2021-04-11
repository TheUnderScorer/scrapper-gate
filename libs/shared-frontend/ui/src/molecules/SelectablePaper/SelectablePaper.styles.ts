import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  grid: {
    width: '100%',
    height: '100%',
  },
  paper: {
    transition: theme.transitions.create('all'),
    width: '100%',
    height: '100%',
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '&.disabled': {
      backgroundColor: theme.palette.action.disabledBackground,
      cursor: 'not-allowed',
    },

    '&.checked': {
      backgroundColor: theme.palette.primary.light,
      borderColor: theme.palette.primary.dark,

      '& .MuiTypography-root': {
        fontWeight: theme.typography.fontWeightBold,
      },
    },
  },
}));
