import React from 'react';
import {
  MyScrappersList,
  useCreateScrapper,
} from '@scrapper-gate/frontend/domain/scrapper';
import { Centered, Image, useAsset } from '@scrapper-gate/frontend/ui';
import { Fab, makeStyles, Typography } from '@material-ui/core';

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

  const [createScrapper] = useCreateScrapper();

  return (
    <MyScrappersList
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
