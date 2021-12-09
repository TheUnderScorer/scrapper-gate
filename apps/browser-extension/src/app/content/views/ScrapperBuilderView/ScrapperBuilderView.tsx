import { ScrapperBuilder } from '@scrapper-gate/frontend/domain/scrapper';
import { useGetScrapperForBuilderQuery } from '@scrapper-gate/frontend/schema';
import { useSnackbarOnError } from '@scrapper-gate/frontend/snackbars';
import {
  browserExtensionRoutes,
  ContentScrapperRouteParams,
} from '@scrapper-gate/shared/routing';
import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useLocation } from 'react-use';
import { IframeCodeEditor } from '../../../popup/components/IframeCodeEditor/IframeCodeEditor';
import { ContentDrawer } from '../../components/ContentDrawer/ContentDrawer';
import { ScrapperElementPicker } from '../../components/ScrapperElementPicker/ScrapperElementPicker';

export const ScrapperBuilderView = () => {
  const match = useRouteMatch<Pick<ContentScrapperRouteParams, 'scrapperId'>>();
  const snackbarOnError = useSnackbarOnError();

  const history = useHistory();

  const { data, loading } = useGetScrapperForBuilderQuery({
    variables: {
      id: match.params.scrapperId ?? '',
    },
    onError: (error) => {
      snackbarOnError(error);

      history.push('/');
    },
    fetchPolicy: 'network-only',
  });

  const location = useLocation();

  return (
    <ContentDrawer queryKey="drawerOpen">
      <ScrapperBuilder
        CodeEditor={IframeCodeEditor}
        runUrlCreator={browserExtensionRoutes.content.scrapperRun}
        ElementPicker={ScrapperElementPicker}
        browserUrl={location.href}
        initialScrapper={data?.getMyScrapper}
        loading={loading}
      />
    </ContentDrawer>
  );
};
