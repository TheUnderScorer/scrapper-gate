import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  checkbox: {
    '&.vertical': {
      position: 'absolute',
      top: '-12%',
      right: '-12%',
      zIndex: 2,
      pointerEvents: 'none',
    },
    '&.horizontal': {
      padding: 0,
    },
  },
  container: {
    cursor: 'pointer',
  },
  text: {
    userSelect: 'none',
  },
  stack: {
    width: '100%',
    height: '100%',
  },
}));
