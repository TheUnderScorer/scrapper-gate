import React from 'react';
import {
  ControlledList,
  ControlledListProps,
} from '@scrapper-gate/frontend/ui';
import { MyScrappersDocument } from '@scrapper-gate/frontend/schema';
import {
  ScrapperListItemProps,
  ScrapperListItemScrapper,
} from '../ScrapperListItem/ScrapperListItem.types';
import { ScrapperListItem } from '../ScrapperListItem/ScrapperListItem';
import { FetchPolicyProps } from '@scrapper-gate/frontend/common';

export interface MyScrappersListProps
  extends Pick<ControlledListProps, 'emptyContent'>,
    Pick<ScrapperListItemProps, 'onClick'>,
    FetchPolicyProps {
  fabLoading?: boolean;
  onCreate?: () => unknown;
  activeScrapperId?: string;
}

export const MyScrappersList = ({
  onCreate,
  onClick,
  fabLoading,
  activeScrapperId,
  fetchPolicy,
  ...props
}: MyScrappersListProps) => {
  return (
    <ControlledList<ScrapperListItemScrapper>
      fetchPolicy={fetchPolicy}
      id="my_scrappers_list"
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
  );
};