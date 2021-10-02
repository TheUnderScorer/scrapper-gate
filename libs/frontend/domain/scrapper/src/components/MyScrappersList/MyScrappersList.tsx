import { FetchPolicyProps } from '@scrapper-gate/frontend/common';
import { MyScrappersDocument } from '@scrapper-gate/frontend/schema';
import {
  ControlledList,
  ControlledListProps,
} from '@scrapper-gate/frontend/ui';
import { Perhaps } from '@scrapper-gate/shared/common';
import { ScrapperListItemFragment } from '@scrapper-gate/shared/schema';
import React from 'react';
import { ScrapperListItem } from '../ScrapperListItem/ScrapperListItem';
import { ScrapperListItemProps } from '../ScrapperListItem/ScrapperListItem.types';

export interface MyScrappersListProps
  extends Pick<ControlledListProps, 'emptyContent'>,
    Pick<ScrapperListItemProps, 'onScrapperClick'>,
    FetchPolicyProps {
  fabLoading?: boolean;
  onCreate?: () => unknown;
  activeScrapperId?: Perhaps<string>;
}

export const MyScrappersList = ({
  onCreate,
  onScrapperClick,
  fabLoading,
  activeScrapperId,
  fetchPolicy,
  ...props
}: MyScrappersListProps) => {
  return (
    <ControlledList<ScrapperListItemFragment>
      fetchPolicy={fetchPolicy}
      id="my_scrappers_list"
      renderItem={({ item }) => (
        <ScrapperListItem
          selected={item.id === activeScrapperId}
          onScrapperClick={onScrapperClick}
          scrapper={item}
          key={item.id}
        />
      )}
      query={MyScrappersDocument}
      {...props}
    />
  );
};
