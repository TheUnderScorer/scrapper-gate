import { ListItemProps } from '@mui/material';
import { ScrapperRunListItemFragment } from '@scrapper-gate/shared/schema';

export interface ScrapperRunListItemProps
  extends Pick<ListItemProps, 'selected'> {
  scrapperRun: ScrapperRunListItemFragment;
  onRunClick?: (scrapperRun: ScrapperRunListItemFragment) => unknown;
}
