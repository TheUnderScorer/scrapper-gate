import { ListItemProps } from '@material-ui/core';
import { Scrapper } from '@scrapper-gate/shared/schema';

export type ScrapperListItemScrapper = Pick<
  Scrapper,
  'id' | 'name' | 'state' | 'isRunning' | 'createdAt'
>;

export interface ScrapperListItemProps extends Pick<ListItemProps, 'selected'> {
  scrapper: ScrapperListItemScrapper;
  onClick?: (scrapper: ScrapperListItemScrapper) => unknown;
}
