import React, { useMemo } from 'react';
import classNames from 'classnames';
import {
  CircularProgress,
  IconButton,
  IconButtonProps,
  Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CheckSharp, ErrorSharp } from '@material-ui/icons';
import { useFormContext } from 'react-hook-form';
import { formErrorKey } from '@scrapper-gate/shared-frontend/form';
import { TooltipText } from '../../atoms/TooltipText/TooltipText';

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
  const form = useFormContext();

  const hasError = useMemo(
    () => Object.values(form.formState.errors).length > 0,
    [form.formState.errors]
  );

  const error = useMemo(() => {
    if (form.formState.errors[formErrorKey]) {
      return form.formState.errors[formErrorKey];
    }

    return form.formState.errors[0]?.message ?? 'Validation error';
  }, [form.formState.errors]);

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
          {form.formState.isSubmitting ? (
            <CircularProgress size={20} />
          ) : (
            stateIcon
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
};
