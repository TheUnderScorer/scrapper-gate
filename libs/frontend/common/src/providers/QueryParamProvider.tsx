import React, { FC } from 'react';
import {
  PushReplaceHistory,
  QueryParamProvider as BaseProvider,
} from 'use-query-params';
import { Route, useHistory, useLocation } from 'react-router-dom';

export const QueryParamProvider: FC = ({ children }) => {
  const location = useLocation();
  const history = useHistory();

  return (
    <BaseProvider
      history={(history as unknown) as PushReplaceHistory}
      location={(location as unknown) as Location}
      ReactRouterRoute={Route}
    >
      {children}
    </BaseProvider>
  );
};
