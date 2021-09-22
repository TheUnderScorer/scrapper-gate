import { Avatar, Tooltip } from '@mui/material';
import { first, toDisplayText } from '@scrapper-gate/shared/common';
import { VariableScope } from '@scrapper-gate/shared/schema';
import React, { useMemo } from 'react';

export interface VariableIconProps {
  scope: VariableScope;
}

export const VariableIcon = ({ scope }: VariableIconProps) => {
  const title = useMemo(() => `${toDisplayText(scope)} variable`, [scope]);

  return (
    <Tooltip title={title}>
      <Avatar variant="square">{first(scope)}</Avatar>
    </Tooltip>
  );
};
