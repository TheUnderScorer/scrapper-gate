import { MyScrappersQuery } from '@scrapper-gate/shared/schema';
import { ListItemProps } from '@material-ui/core';

export type ScrapperListItemScrapper = MyScrappersQuery['getMyScrappers']['items'][0];

export interface ScrapperListItemProps extends Pick<ListItemProps, 'selected'> {
  scrapper: ScrapperListItemScrapper;
  onClick?: (scrapper: ScrapperListItemScrapper) => unknown;
}
