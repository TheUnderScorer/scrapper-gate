import React, { useCallback, useEffect } from 'react';
import { useFormState } from 'react-final-form';
import { useEvent, usePrevious } from 'react-use';
import { useSetFormAsNonDirty } from '../../hooks/useSetFormAsNonDirty';
import { UnsavedFormAlertProps } from './UnsavedFormAlert.types';

export const UnsavedFormAlert = ({
  message = 'You have unsaved changes!',
}: UnsavedFormAlertProps) => {
  const formState = useFormState({
    subscription: {
      dirty: true,
      dirtySinceLastSubmit: true,
      submitting: true,
    },
  });

  const previousSubmitting = usePrevious(formState.submitting);

  const setFormAsNonDirty = useSetFormAsNonDirty();

  useEffect(() => {
    if (!formState.submitting && previousSubmitting) {
      setFormAsNonDirty();
    }
  }, [formState.submitting, previousSubmitting, setFormAsNonDirty]);

  const handleBeforeUnload = useCallback(
    (event: Event) => {
      if (!formState.dirty && !formState.dirtySinceLastSubmit) {
        return;
      }

      event.preventDefault();

      Object.assign(event, {
        returnValue: message,
      });
    },
    [formState, message]
  );

  useEvent('beforeunload', handleBeforeUnload, window);

  return null;
};
