import { makeStyles, Theme } from '@material-ui/core/styles';
import { SelectablePaperProps } from './SelectablePaper';

export const useStyles = makeStyles((theme: Theme) => ({
  grid: {
    width: '100%',
    height: '100%',
  },
  paper: ({
    checkedBackgroundColor,
  }: Pick<SelectablePaperProps, 'checkedBackgroundColor'>) => ({
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
      backgroundColor:
        checkedBackgroundColor === 'primary'
          ? theme.palette.primary.main
          : theme.palette.primary.light,
      borderColor:
        checkedBackgroundColor === 'primary'
          ? undefined
          : theme.palette.primary.dark,
      color:
        checkedBackgroundColor === 'primary'
          ? theme.palette.primary.contrastText
          : undefined,

      '& .MuiTypography-root:not(.no-bold)': {
        fontWeight: theme.typography.fontWeightBold,
      },
    },
  }),
}));
