import React, { useState } from 'react';
import { SaveSharp } from '@material-ui/icons';
import { useInterval } from 'react-use';
import SubmitButton from './SubmitButton';

export default {
  title: 'UI/Submit Button',
};

export const AsButton = () => {
  return <SubmitButton>Save</SubmitButton>;
};

export const AsButtonDidSubmit = () => {
  return <SubmitButton didSubmit>Save</SubmitButton>;
};

export const AsButtonLoading = () => {
  return <SubmitButton loading />;
};

export const AsIconButton = () => {
  return (
    <SubmitButton type="icon">
      <SaveSharp />
    </SubmitButton>
  );
};

export const AsIconButtonLoading = () => {
  return (
    <SubmitButton type="icon" loading>
      <SaveSharp />
    </SubmitButton>
  );
};

export const AsIconButtonDidSubmit = () => {
  return (
    <SubmitButton type="icon" didSubmit>
      <SaveSharp />
    </SubmitButton>
  );
};

export const AsIconButtonSwitchingState = () => {
  const [didSubmit, setDidSubmit] = useState(false);

  useInterval(() => {
    setDidSubmit((prev) => !prev);
  }, 2000);

  return (
    <SubmitButton type="icon" didSubmit={didSubmit}>
      <SaveSharp />
    </SubmitButton>
  );
};
