import { Drawer, DrawerProps } from '@mui/material';
import React from 'react';
import { BooleanParam, useQueryParam } from 'use-query-params';

export interface QueryDrawerProps extends Omit<DrawerProps, 'open'> {
  queryKey: string;
}

export const QueryDrawer = ({
  queryKey,
  children,
  onClose,
  ...rest
}: QueryDrawerProps) => {
  const [open, setOpen] = useQueryParam(queryKey, BooleanParam);

  return (
    <Drawer
      {...rest}
      open={Boolean(open)}
      onClose={(event, reason) => {
        setOpen(false, 'pushIn');

        onClose?.(event, reason);
      }}
    >
      {children}
    </Drawer>
  );
};
