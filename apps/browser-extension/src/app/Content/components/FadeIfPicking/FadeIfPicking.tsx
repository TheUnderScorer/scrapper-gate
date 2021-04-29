import React, { PropsWithChildren } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import classNames from 'classnames';
import { useIsUsingElementPicker } from '@scrapper-gate/frontend/common';

const useStyles = makeStyles((theme: Theme) => {
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
