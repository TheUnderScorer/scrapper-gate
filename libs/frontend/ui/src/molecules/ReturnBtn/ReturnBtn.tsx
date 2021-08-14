import { IconButton } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
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
    <IconButton onClick={() => history.push(returnUrl)} {...props}>
      <ArrowBack />
    </IconButton>
  );
};
