import React, { FC, MouseEventHandler } from 'react';
import { Check } from '@material-ui/icons';
import { Button, CircularProgress, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { PrimaryIconButton } from '../../atoms/Buttons/Buttons';

export interface SubmitButtonProps {
  didSubmit?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler;
  className?: string;
  type?: 'icon' | 'button';
}

const useStyles = makeStyles((theme: Theme) => ({
  btn: {
    width: theme.spacing(13),
  },
  base: {
    transition: theme.transitions.create('all'),
    '&.didSubmit': {
      backgroundColor: `${theme.palette.success.main} !important`,
      color: `${theme.palette.success.contrastText} !important`,
    },
  },
}));

export const SubmitButton: FC<SubmitButtonProps> = ({
  didSubmit,
  children,
  loading,
  disabled,
  onClick,
  className,
  type = 'button',
}) => {
  const classes = useStyles();

  const buttonType = didSubmit ? 'button' : 'submit';
  const color = loading || didSubmit ? 'inherit' : 'primary';

  if (type === 'button') {
    return (
      <Button
        className={classNames(
          classes.base,
          classes.btn,
          { didSubmit, loading },
          className,
          'submit-btn'
        )}
        type={buttonType}
        onClick={onClick}
        disabled={loading || disabled}
        variant="contained"
        color={color}
        startIcon={didSubmit ? <Check /> : null}
      >
        {didSubmit && 'Saved!'}
        {!didSubmit && (loading ? <CircularProgress size={20} /> : children)}
      </Button>
    );
  }

  return (
    <PrimaryIconButton
      type={buttonType}
      onClick={onClick}
      disabled={disabled || loading}
      className={classNames(
        classes.base,
        { didSubmit, loading },
        className,
        'submit-btn'
      )}
    >
      {didSubmit && <Check />}
      {!didSubmit && (loading ? <CircularProgress size={20} /> : children)}
    </PrimaryIconButton>
  );
};
