import { ListItemProps } from '@mui/material';
import {
  Scrapper,
  ScrapperListItemFragment,
} from '@scrapper-gate/shared/schema';

export type ScrapperListItemScrapper = Pick<
  Scrapper,
  'id' | 'name' | 'isRunning' | 'createdAt'
>;

export interface ScrapperListItemProps extends Pick<ListItemProps, 'selected'> {
  scrapper: ScrapperListItemFragment;
  onScrapperClick?: (scrapper: ScrapperListItemFragment) => unknown;
}
