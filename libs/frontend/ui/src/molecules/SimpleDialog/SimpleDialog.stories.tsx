import { SimpleDialog } from './SimpleDialog';
import { useState } from 'react';
import { Button } from '@mui/material';
import React from 'react';

export default {
  title: 'UI/Simple Dialog',
  component: SimpleDialog,
};

export const Component = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Show dialog</Button>
      <SimpleDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm action"
        actions={
          <>
            <Button onClick={() => setOpen(false)} variant="text">
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)} variant="contained">
              Confirm
            </Button>
          </>
        }
      >
        Are you sure you want to do that?
      </SimpleDialog>
    </>
  );
};

export const Loading = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Show dialog</Button>
      <SimpleDialog
        fullWidth
        maxWidth="xl"
        loading
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm action"
        actions={
          <>
            <Button onClick={() => setOpen(false)} variant="text">
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)} variant="contained">
              Confirm
            </Button>
          </>
        }
      >
        Please wait...
      </SimpleDialog>
    </>
  );
};
