import { Tooltip, Typography } from '@mui/material';
import { GridCellParams } from '@material-ui/data-grid';
import { getDisplayValue } from '@scrapper-gate/shared/common';
import React, { useMemo } from 'react';

export interface RowValueProps extends GridCellParams {
  dateFormat?: string;
}

export const RowValue = ({
  value,
  dateFormat,
  isEditable,
  field,
}: RowValueProps) => {
  const displayValue = useMemo(
    () =>
      getDisplayValue({
        value,
        dateFormat,
      }),
    [dateFormat, value]
  );

  return (
    <Tooltip title="Click to edit" open={isEditable ? undefined : false}>
      <Typography className={`row-value-${field}`}>
        {displayValue || '-'}
      </Typography>
    </Tooltip>
  );
};
