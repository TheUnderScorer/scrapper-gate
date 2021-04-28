import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => {
  return {
    summary: {
      '&.primary': {
        backgroundColor: theme.palette.primary.main,
        '& *': {
          color: theme.palette.primary.contrastText,
        },
      },
      '& .MuiAccordionSummary-content': {
        cursor: 'default',
      },
    },
    cardExpandBtn: {
      '&, &:hover, &:active': {
        marginRight: theme.spacing(0.5),
      },
      '& svg': {
        transition: theme.transitions.create('all'),
      },
      '&:not(.expanded) svg': {
        transform: 'rotate(180deg)',
      },
    },
    secondary: {
      color: theme.palette.grey['400'],
    },
  };
});
