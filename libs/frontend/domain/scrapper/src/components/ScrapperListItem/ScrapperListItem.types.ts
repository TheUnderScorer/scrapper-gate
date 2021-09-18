import { ListItemProps } from '@mui/material';
import { Scrapper } from '@scrapper-gate/shared/schema';

export type ScrapperListItemScrapper = Pick<
  Scrapper,
  'id' | 'name' | 'isRunning' | 'createdAt'
>;

export interface ScrapperListItemProps extends Pick<ListItemProps, 'selected'> {
  scrapper: ScrapperListItemScrapper;
  onClick?: (scrapper: ScrapperListItemScrapper) => unknown;
}
