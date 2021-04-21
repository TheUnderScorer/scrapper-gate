import React, { useState } from 'react';
import {
  ControlledList,
  ControlledListProps,
} from '@scrapper-gate/frontend/ui';
import { MyScrappersDocument } from '@scrapper-gate/frontend/schema';
import { ScrapperListItemScrapper } from '../ScrapperListItem/ScrapperListItem.types';
import {
  CircularProgress,
  Fab,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';
import { useCreateScrapper } from '../../hooks/useCreateScrapper';
import { ScrapperListItem } from '../ScrapperListItem/ScrapperListItem';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export interface MyScrappersListProps
  extends Pick<ControlledListProps, 'emptyContent'> {
  onCreate?: () => unknown;
}

export const MyScrappersList = ({
  onCreate,
  ...props
}: MyScrappersListProps) => {
  const classes = useStyles();

  const [hasData, setHasData] = useState(false);

  const [createScrapper, { loading }] = useCreateScrapper();

  return (
    <>
      <ControlledList<ScrapperListItemScrapper>
        id="my_scrappers_list"
        onDataChange={(data) => setHasData(Boolean(data?.total))}
        renderItem={({ item }) => (
          <ScrapperListItem scrapper={item} key={item.id} />
        )}
        query={MyScrappersDocument}
        {...props}
      />
      {hasData && onCreate && (
        <Fab
          onClick={onCreate}
          color="primary"
          className={classes.fab}
          disabled={loading}
        >
          {loading ? <CircularProgress color="inherit" /> : <Add />}
        </Fab>
      )}
    </>
  );
};
