import { ApiClientProvider } from '@scrapper-gate/frontend/api-client';
import { QueryParamProvider } from '@scrapper-gate/frontend/common';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import { browserExtensionRoutes } from '@scrapper-gate/shared/routing';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { useTokensStore } from '../auth/useTokensStore';
import { PopupCodeEditor } from './views/PopupCodeEditor/PopupCodeEditor';
import { PopupRoot } from './views/PopupRoot';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <QueryParamProvider>
        <ThemeProvider>
          <ApiClientProvider useTokensStore={useTokensStore}>
            <Switch>
              <Route path={browserExtensionRoutes.popup.codeEditor()}>
                <PopupCodeEditor />
              </Route>
              <Route path="/">
                <PopupRoot />
              </Route>
            </Switch>
          </ApiClientProvider>
        </ThemeProvider>
      </QueryParamProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
