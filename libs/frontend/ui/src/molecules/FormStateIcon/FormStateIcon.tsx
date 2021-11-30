import { CheckSharp, ErrorSharp, InfoSharp } from '@mui/icons-material';
import {
  CircularProgress,
  IconButton,
  IconButtonProps,
  Tooltip,
} from '@mui/material';
import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useFormState } from 'react-final-form';
import { TooltipText } from '../../atoms/TooltipText/TooltipText';

export type FormStateIconProps = IconButtonProps;

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

  return (
    <Tooltip title={error ? <TooltipText>{error}</TooltipText> : ''}>
      <span>
        <IconButton
          component="span"
          disableRipple
          disableFocusRipple
          disableTouchRipple
          sx={{
            '&.success': {
              color: (theme) => theme.palette.success.main,
            },
            '&.error': {
              color: (theme) => theme.palette.error.main,
            },
          }}
          {...props}
          className={classNames(
            hasError
              ? 'error'
              : formState.validating
              ? 'validating'
              : 'success',
            props.className,
            'form-state-icon'
          )}
          size="large"
        >
          {formState.submitting ? <CircularProgress size={20} /> : stateIcon}
        </IconButton>
      </span>
    </Tooltip>
  );
};
