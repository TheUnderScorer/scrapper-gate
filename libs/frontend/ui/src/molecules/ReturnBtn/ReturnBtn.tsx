import { IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { returnUrlQueryKey } from '@scrapper-gate/shared/routing';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { StringParam, useQueryParam } from 'use-query-params';
import { ReturnBtnProps } from './ReturnBtn.types';

export const ReturnBtn = (props: ReturnBtnProps) => {
  const [returnUrl] = useQueryParam(returnUrlQueryKey, StringParam);
  const history = useHistory();

  if (!returnUrl) {
    return null;
  }

  return (
    <IconButton onClick={() => history.push(returnUrl)} {...props} size="large">
      <ArrowBack />
    </IconButton>
  );
};
