import React, { useCallback } from 'react';
import {
  MyScrappersList,
  ScrapperListItemScrapper,
} from '@scrapper-gate/frontend/domain/scrapper';
import { Centered, Image, useAsset } from '@scrapper-gate/frontend/ui';
import { Fab, makeStyles, Typography } from '@material-ui/core';
import { useCreateScrapperExtension } from '../hooks/useCreateScrapperExtension';
import { useContentToggle } from '../../../extension/browser/communication/hooks/useContentToggle';
import { browserExtensionRoutes } from '@scrapper-gate/shared/routing';
import { useActiveScrapperInContent } from '../hooks/useActiveScrapperInContent';

const useStyles = makeStyles((theme) => ({
  empty: {
    backgroundColor: theme.palette.primary.light,
  },
  text: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(3),
  },
}));

export const PopupScrappersView = () => {
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
      activeScrapperId={activeScrapperId}
      onClick={handleScrapperClick}
      fabLoading={loading}
      onCreate={() => createScrapper()}
      emptyContent={
        <Centered direction="column" className={classes.empty}>
          <Image alt={alt} src={asset} />
          <Typography className={classes.text} variant="subtitle1">
            No scrappers found.
          </Typography>
          <Fab
            onClick={() => createScrapper()}
            color="primary"
            variant="extended"
          >
            Create first scrapper
          </Fab>
        </Centered>
      }
    />
  );
};
