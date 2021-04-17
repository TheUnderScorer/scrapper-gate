import React from 'react';
import { Drawer, DrawerProps } from '@material-ui/core';
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
      open={open}
      onClose={(event, reason) => {
        setOpen(false);

        onClose?.(event, reason);
      }}
    >
      {children}
    </Drawer>
  );
};
