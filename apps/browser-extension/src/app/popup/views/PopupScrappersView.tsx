import { FetchPolicyProps } from '@scrapper-gate/frontend/common';
import { MyScrappersList } from '@scrapper-gate/frontend/domain/scrapper';
import { EmptyContentArt } from '@scrapper-gate/frontend/ui';
import { browserExtensionRoutes } from '@scrapper-gate/shared/routing';
import { ScrapperListItemFragment } from '@scrapper-gate/shared/schema';
import React from 'react';
import { useActiveScrapperIdInContent } from '../hooks/useActiveScrapperIdInContent';
import { useContentEntityToggle } from '../hooks/useContentEntityToggle';
import { useCreateScrapperExtension } from '../hooks/useCreateScrapperExtension';

export const PopupScrappersView = ({ fetchPolicy }: FetchPolicyProps) => {
  const createScrapper = useCreateScrapperExtension();

  const scrapperRouteParams = useActiveScrapperIdInContent();

  const handleScrapperClick = useContentEntityToggle<ScrapperListItemFragment>({
    activeEntityInContentId: scrapperRouteParams?.scrapperId,
    showEntityInContent: (scrapper) => ({
      visible: true,
      path: browserExtensionRoutes.content.scrapper({
        scrapperId: scrapper.id,
        drawerOpen: true,
      }),
    }),
  });

  return (
    <MyScrappersList
      fetchPolicy={fetchPolicy}
      activeScrapperId={scrapperRouteParams?.scrapperId}
      onScrapperClick={handleScrapperClick}
      onCreate={createScrapper}
      emptyContent={
        <EmptyContentArt
          id="my_scrappers_list"
          onCreate={createScrapper}
          createText="Create scrapper"
          title="No scrappers found."
          subTitle="Scrappers lets you fetch data from sites in seconds."
        />
      }
    />
  );
};