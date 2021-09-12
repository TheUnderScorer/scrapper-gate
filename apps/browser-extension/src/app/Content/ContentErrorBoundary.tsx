import { Typography } from '@material-ui/core';
import { SimpleDialog } from '@scrapper-gate/frontend/ui';
import { PropsWithChildren } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export const ContentErrorBoundary = ({
  children,
}: PropsWithChildren<unknown>) => {
  return (
    <ErrorBoundary
      fallbackRender={(props) => (
        <SimpleDialog title="Error occurred!">
          <Typography>{props.error.message}</Typography>
        </SimpleDialog>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};
