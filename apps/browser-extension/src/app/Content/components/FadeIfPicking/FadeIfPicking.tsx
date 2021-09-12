import { makeStyles } from '@material-ui/styles';
import { useIsUsingElementPicker } from '@scrapper-gate/frontend/common';
import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';

const useStyles = makeStyles((theme) => {
  return {
    container: {
      transition: theme.transitions.create('opacity'),
      '&.picking': {
        opacity: 0.01,

        '&, & *': {
          userSelect: 'none',
          pointerEvents: 'none !important',
        },
      },
    },
  };
});

export const FadeIfPicking = ({ children }: PropsWithChildren<unknown>) => {
  const classes = useStyles();
  const [picking] = useIsUsingElementPicker();

  return (
    <div className={classNames(classes.container, { picking })}>{children}</div>
  );
};
