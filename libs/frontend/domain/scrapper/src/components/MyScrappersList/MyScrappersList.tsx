import React from 'react';
import {
  ControlledList,
  ControlledListProps,
} from '@scrapper-gate/frontend/ui';
import { MyScrappersDocument } from '@scrapper-gate/frontend/schema';
import { ScrapperListItem } from '../ScrapperListItem/ScrapperListItem.types';

export const MyScrappersList = (
  props: Pick<ControlledListProps, 'emptyContent'>
) => {
  return (
    <ControlledList<ScrapperListItem>
      id="my_scrappers_list"
      renderItem={({ item }) => item.name}
      query={MyScrappersDocument}
      {...props}
    />
  );
};
