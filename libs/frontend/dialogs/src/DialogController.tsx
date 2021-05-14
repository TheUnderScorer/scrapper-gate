import React, { useMemo, useState } from 'react';
import { pick } from 'remeda';
import { Button, ButtonGroup, Stack } from '@material-ui/core';
import { DialogProperties, useDialogStore } from './useDialogStore';
import { SimpleDialog } from '@scrapper-gate/frontend/ui';

export const DialogController = () => {
  const [loading, setLoading] = useState(false);

  const {
    content,
    footerButtons,
    open,
    title,
    titleIcon,
  } = useDialogStore((store) =>
    pick(store, ['title', 'titleIcon', 'content', 'footerButtons', 'open'])
  ) as DialogProperties;
  const hideDialog = useDialogStore((store) => store.hideDialog);

  const buttons = useMemo(() => {
    return footerButtons?.({ handleClose: hideDialog, setLoading }).map(
      (button, index) => (
        <Button key={index} {...button}>
          {button.children}
        </Button>
      )
    );
  }, [footerButtons, hideDialog]);

  return (
    <SimpleDialog
      title={
        <Stack spacing={1} alignItems="center">
          {titleIcon}
          {title}
        </Stack>
      }
      open={open}
      onClose={hideDialog}
      actions={<ButtonGroup>{buttons}</ButtonGroup>}
      loading={loading}
    >
      {content}
    </SimpleDialog>
  );
};
