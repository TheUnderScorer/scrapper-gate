import { Fab, makeStyles } from '@material-ui/core';
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

const useStyles = makeStyles((theme) => ({
  empty: {
    backgroundColor: theme.palette.primary.light,
  },
  text: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(3),
  },
  info: {
    marginTop: theme.spacing(2),
  },
}));

export const PopupScrappersView = ({ fetchPolicy }: FetchPolicyProps) => {
  const classes = useStyles();

  const { asset, alt } = useAsset('notFoundSolid');

  const [createScrapper, { loading }] = useCreateScrapperExtension();

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
      fabLoading={loading}
      onCreate={() => createScrapper()}
      emptyContent={
        <Centered direction="column" className={classes.empty}>
          <Image alt={alt} src={asset} />
          <InformationBox
            spacing={2}
            className={classes.info}
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
