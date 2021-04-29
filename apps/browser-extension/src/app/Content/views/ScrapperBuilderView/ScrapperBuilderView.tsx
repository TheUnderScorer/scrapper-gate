import React from 'react';
import { useGetScrapperForBuilderQuery } from '@scrapper-gate/frontend/schema';
import { useRouteMatch } from 'react-router-dom';
import { ContentScrapperRouteParams } from '@scrapper-gate/shared/routing';
import { ContentDrawer } from '../../components/ContentDrawer/ContentDrawer';
import { ScrapperBuilder } from '@scrapper-gate/frontend/domain/scrapper';
import { ScrapperElementPicker } from '../../components/ScrapperElementPicker/ScrapperElementPicker';
import { useLocation } from 'react-use';

export const ScrapperBuilderView = () => {
  const match = useRouteMatch<Pick<ContentScrapperRouteParams, 'scrapperId'>>();
  const { data, loading } = useGetScrapperForBuilderQuery({
    variables: {
      id: match.params.scrapperId,
    },
  });

  const location = useLocation();

  return (
    <ContentDrawer queryKey="drawerOpen">
      <ScrapperBuilder
        ElementPicker={ScrapperElementPicker}
        browserUrl={location.href}
        initialScrapper={data?.getMyScrapper}
        loading={loading}
      />
    </ContentDrawer>
  );
};
