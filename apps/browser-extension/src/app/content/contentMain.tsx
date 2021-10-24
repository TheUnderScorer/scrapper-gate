import { Global } from '@emotion/react';
import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { ApiClientProvider } from '@scrapper-gate/frontend/api-client';
import { QueryParamProvider } from '@scrapper-gate/frontend/common';
import { DialogController } from '@scrapper-gate/frontend/dialogs';
import { SnackbarProvider } from '@scrapper-gate/frontend/snackbars';
import { palette, ThemeProvider } from '@scrapper-gate/frontend/theme';
import {
  hiddenNumericArrows,
  highlight,
  reactFlowBuilderStyles,
  Scoped,
  SnackbarActions,
} from '@scrapper-gate/frontend/ui';
import { logger } from '@scrapper-gate/shared/logger/console';
import React from 'react';
import ReactDOM from 'react-dom';
import 'react-flow-renderer/dist/style.css';
import './content.css';
import { ContentRouter } from '../../extension/contentScript/components/ContentRouter';
import { contentContainer } from '../../extension/contentScript/contentContainer';
import '../../wdyr';
import { useTokensStore } from '../auth/useTokensStore';
import { ContentRoot } from './views/ContentRoot';
import { ContentErrorBoundary } from './ContentErrorBoundary';

logger.debug('Starting content script... ;)');

document.body.appendChild(contentContainer);

ReactDOM.render(
  <React.StrictMode>
    <Global styles={[highlight(palette.primaryLight)]} />
    <Scoped>
      {(shadowRoot, container) => (
        <ContentErrorBoundary>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ContentRouter>
              <QueryParamProvider>
                <ThemeProvider isContent container={container}>
                  <Global
                    styles={[reactFlowBuilderStyles, hiddenNumericArrows]}
                  />
                  <ApiClientProvider useTokensStore={useTokensStore}>
                    <SnackbarProvider
                      domRoot={container}
                      action={(key) => <SnackbarActions key={key} />}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                    >
                      <DialogController>
                        <ContentRoot />
                      </DialogController>
                    </SnackbarProvider>
                  </ApiClientProvider>
                </ThemeProvider>
              </QueryParamProvider>
            </ContentRouter>
          </LocalizationProvider>
        </ContentErrorBoundary>
      )}
    </Scoped>
  </React.StrictMode>,
  contentContainer
);
