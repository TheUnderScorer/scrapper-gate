import { makeStyles } from '@material-ui/core/styles';
import { CSSProperties } from 'react';

export const useStyles = makeStyles((theme) => ({
  item: {
    pointerEvents: 'all',
  },
  fab: {
    position: 'absolute',
    pointerEvents: 'all',
    top: theme.spacing(2),
    left: theme.spacing(2),
    zIndex: theme.zIndex.modal - 1,
  },
  fabDrawer: {
    top: '50%',
    right: '-30px',
    position: 'absolute',
    zIndex: theme.zIndex.modal + 1,
  },
  drawer: ({ width }: Pick<CSSProperties, 'width'>) => ({
    zIndex: theme.zIndex.modal,
    width,
  }),
  paper: ({ width }: Pick<CSSProperties, 'width'>) => ({
    width,
    overflowY: 'visible',
  }),
  gridContainer: {
    height: '100%',
  },
  gridItem: {
    flex: 1,
  },
  toolbar: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
  },
}));
