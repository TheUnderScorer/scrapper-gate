import { Fab } from '@mui/material';
import { FetchPolicyProps } from '@scrapper-gate/frontend/common';
import {
  MyScrappersList,
  ScrapperListItemScrapper,
} from '@scrapper-gate/frontend/domain/scrapper';
import {
  Centered,
  Image,
  InformationBox,
  useAsset,
} from '@scrapper-gate/frontend/ui';
import { browserExtensionRoutes } from '@scrapper-gate/shared/routing';
import React, { useCallback } from 'react';
import { useContentToggle } from '../../../extension/browser/communication/hooks/useContentToggle';
import { useActiveScrapperInContent } from '../hooks/useActiveScrapperInContent';
import { useCreateScrapperExtension } from '../hooks/useCreateScrapperExtension';

export const PopupScrappersView = ({ fetchPolicy }: FetchPolicyProps) => {
  const { asset, alt } = useAsset('notFoundSolid');

  const createScrapper = useCreateScrapperExtension();

  const [toggleContent] = useContentToggle();

  const { scrapperId: activeScrapperId } = useActiveScrapperInContent();

  const handleScrapperClick = useCallback(
    async (scrapper: ScrapperListItemScrapper) => {
      if (scrapper.id === activeScrapperId) {
        return toggleContent({
          visible: false,
          path: '/',
        });
      }

      await toggleContent({
        visible: true,
        path: browserExtensionRoutes.content.scrapper({
          scrapperId: scrapper.id,
          drawerOpen: true,
        }),
      });
    },
    [activeScrapperId, toggleContent]
  );

  return (
    <MyScrappersList
      fetchPolicy={fetchPolicy}
      activeScrapperId={activeScrapperId}
      onClick={handleScrapperClick}
      onCreate={() => createScrapper()}
      emptyContent={
        <Centered
          direction="column"
          sx={{
            backgroundColor: (theme) => theme.palette.primary.light,
          }}
        >
          <Image alt={alt} src={asset} />
          <InformationBox
            spacing={2}
            sx={{
              marginTop: (theme) => theme.spacing(2),
            }}
            title="No scrappers found"
            subTitle="Scrappers lets you fetch data from sites in seconds."
            action={
              <Fab
                onClick={() => createScrapper()}
                color="primary"
                variant="extended"
              >
                Create scrapper
              </Fab>
            }
          />
        </Centered>
      }
    />
  );
};
