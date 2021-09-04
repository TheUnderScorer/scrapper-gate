import {
  CircularProgress,
  IconButton,
  IconButtonProps,
  Theme,
  Tooltip,
} from '@material-ui/core';
import { CheckSharp, ErrorSharp, InfoSharp } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useFormState } from 'react-final-form';
import { TooltipText } from '../../atoms/TooltipText/TooltipText';

export type FormStateIconProps = IconButtonProps;

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    '&.success': {
      color: theme.palette.success.main,
    },
    '&.error': {
      color: theme.palette.error.main,
    },
  },
}));

export const FormStateIcon = (props: FormStateIconProps) => {
  const formState = useFormState({
    subscription: {
      hasValidationErrors: true,
      submitError: true,
      error: true,
      hasSubmitErrors: true,
      submitErrors: true,
      submitting: true,
      validating: true,
    },
  });

  const hasError = Boolean(
    formState.error ||
      formState.hasSubmitErrors ||
      formState.hasValidationErrors
  );

  const error = useMemo(() => {
    if (formState.hasSubmitErrors) {
      return formState.submitError;
    }

    if (formState.error) {
      return formState.error;
    }

    return formState.hasValidationErrors ? 'Validation error' : null;
  }, [formState]);

  const stateIcon = useMemo(() => {
    if (formState.validating) {
      return <InfoSharp />;
    }

    return hasError ? <ErrorSharp /> : <CheckSharp />;
  }, [formState.validating, hasError]);

  const classes = useStyles();

  return (
    <Tooltip title={error ? <TooltipText>{error}</TooltipText> : ''}>
      <span>
        <IconButton
          component="span"
          disableRipple
          disableFocusRipple
          disableTouchRipple
          {...props}
          className={classNames(
            classes.icon,
            hasError
              ? 'error'
              : formState.validating
              ? 'validating'
              : 'success',
            props.className
          )}
        >
          {formState.submitting ? <CircularProgress size={20} /> : stateIcon}
        </IconButton>
      </span>
    </Tooltip>
  );
};
