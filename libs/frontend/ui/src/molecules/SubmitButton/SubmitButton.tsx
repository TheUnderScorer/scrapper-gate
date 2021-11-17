import { Check } from '@mui/icons-material';
import { Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';
import React, { MouseEventHandler, PropsWithChildren } from 'react';
import { useFormState } from 'react-final-form';
import { PrimaryIconButton } from '../../atoms/Buttons/Buttons';

const PREFIX = 'SubmitButton';

const classes = {
  btn: `${PREFIX}-btn`,
  base: `${PREFIX}-base`,
};

const StyledPrimaryIconButton = styled(PrimaryIconButton)(({ theme }) => ({
  [`& .${classes.btn}`]: {
    width: theme.spacing(13),
  },

  [`&.${classes.base}`]: {
    transition: theme.transitions.create('all'),
    '&.didSubmit': {
      backgroundColor: `${theme.palette.success.main} !important`,
      color: `${theme.palette.success.contrastText} !important`,
    },
  },
}));

export interface SubmitButtonProps {
  didSubmit?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler;
  className?: string;
  type?: 'icon' | 'button';
}

export const SubmitButton = ({
  didSubmit,
  children,
  loading,
  disabled,
  onClick,
  className,
  type = 'button',
}: PropsWithChildren<SubmitButtonProps>) => {
  const formState = useFormState({
    subscription: {
      dirty: true,
    },
  });

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
        disabled={loading || disabled || !formState.dirty}
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
    <StyledPrimaryIconButton
      type={buttonType}
      onClick={onClick}
      disabled={disabled || loading || !formState.dirty}
      className={classNames(
        classes.base,
        { didSubmit, loading },
        className,
        'submit-btn'
      )}
    >
      {didSubmit && <Check />}
      {!didSubmit && (loading ? <CircularProgress size={20} /> : children)}
    </StyledPrimaryIconButton>
  );
};
