import React, { useMemo } from 'react';
import classNames from 'classnames';
import {
  CircularProgress,
  IconButton,
  IconButtonProps,
  Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useFormState } from 'react-final-form';
import { CheckSharp, ErrorSharp } from '@material-ui/icons';
import { TooltipText } from '@scrapper-gate/frontend/ui';

export type FormStateIconProps = IconButtonProps;

const useStyles = makeStyles((theme) => ({
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

  const stateIcon = useMemo(
    () => (hasError ? <ErrorSharp /> : <CheckSharp />),
    [hasError]
  );

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
            hasError ? 'error' : 'success',
            props.className
          )}
        >
          {formState.submitting ? <CircularProgress size={20} /> : stateIcon}
        </IconButton>
      </span>
    </Tooltip>
  );
};
