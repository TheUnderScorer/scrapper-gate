import React, { useState } from 'react';
import {
  ControlledList,
  ControlledListProps,
} from '@scrapper-gate/frontend/ui';
import { MyScrappersDocument } from '@scrapper-gate/frontend/schema';
import {
  ScrapperListItemProps,
  ScrapperListItemScrapper,
} from '../ScrapperListItem/ScrapperListItem.types';
import { CircularProgress, Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';
import { ScrapperListItem } from '../ScrapperListItem/ScrapperListItem';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export interface MyScrappersListProps
  extends Pick<ControlledListProps, 'emptyContent'>,
    Pick<ScrapperListItemProps, 'onClick'> {
  fabLoading?: boolean;
  onCreate?: () => unknown;
  activeScrapperId?: string;
}

export const MyScrappersList = ({
  onCreate,
  onClick,
  fabLoading,
  activeScrapperId,
  ...props
}: MyScrappersListProps) => {
  const classes = useStyles();

  const [hasData, setHasData] = useState(false);

  return (
    <>
      <ControlledList<ScrapperListItemScrapper>
        id="my_scrappers_list"
        onDataChange={(data) => setHasData(Boolean(data?.total))}
        renderItem={({ item }) => (
          <ScrapperListItem
            selected={item.id === activeScrapperId}
            onClick={onClick}
            scrapper={item}
            key={item.id}
          />
        )}
        query={MyScrappersDocument}
        {...props}
      />
      {hasData && onCreate && (
        <Fab
          onClick={onCreate}
          color="primary"
          className={classes.fab}
          disabled={fabLoading}
        >
          {fabLoading ? <CircularProgress color="inherit" /> : <Add />}
        </Fab>
      )}
    </>
  );
};
