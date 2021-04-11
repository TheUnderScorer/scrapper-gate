import { FormStateIcon } from './FormStateIcon';
import { FormProvider, useForm } from 'react-hook-form';
import { useMount } from 'react-use';
import { wait } from '@scrapper-gate/shared/common';
import {
  formErrorKey,
  FormTextField,
} from '@scrapper-gate/shared-frontend/form';
import React from 'react';

export default {
  title: 'UI/Form State Icon',
  component: FormStateIcon,
};

export const Regular = () => {
  const form = useForm();

  return (
    <FormProvider {...form}>
      <FormStateIcon />
    </FormProvider>
  );
};

export const Submitting = () => {
  const form = useForm();

  useMount(() => {
    form.handleSubmit(async () => {
      await wait(99999999);
    })();
  });

  return (
    <FormProvider {...form}>
      <FormStateIcon />
    </FormProvider>
  );
};

export const FormError = () => {
  const form = useForm();

  useMount(() => {
    form.setError(formErrorKey, { message: 'Something went wrong :/' });
  });

  return (
    <FormProvider {...form}>
      <FormStateIcon />
    </FormProvider>
  );
};

export const ValidationError = () => {
  const form = useForm();

  useMount(() => {
    form.setError('test', { message: 'Field error' });
  });

  return (
    <FormProvider {...form}>
      <FormStateIcon />
      <FormTextField
        name="test"
        label="Test"
        defaultValue=""
        control={form.control}
      />
    </FormProvider>
  );
};
