import { MyScrapperRunsDocument } from '@scrapper-gate/frontend/schema';
import { ControlledList } from '@scrapper-gate/frontend/ui';
import { ScrapperRunListItemFragment } from '@scrapper-gate/shared/schema';
import React from 'react';
import { ScrapperRunListItem } from '../ScrapperRunListItem/ScrapperRunListItem';
import { MyScrapperRunsListProps } from './MyScrapperRunsList.types';

export const MyScrapperRunsList = ({
  activeScrapperRunId,
  emptyContent,
  fetchPolicy,
  ...rest
}: MyScrapperRunsListProps) => {
  return (
    <ControlledList<ScrapperRunListItemFragment>
      emptyContent={emptyContent}
      fetchPolicy={fetchPolicy}
      renderItem={({ item }) => (
        <ScrapperRunListItem
          scrapperRun={item}
          selected={activeScrapperRunId === item.id}
          {...rest}
        />
      )}
      id="my_scrapper_runs_list"
      query={MyScrapperRunsDocument}
    />
  );
};
