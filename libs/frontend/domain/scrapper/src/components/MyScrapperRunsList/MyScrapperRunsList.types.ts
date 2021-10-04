import { ControlledListProps } from '@scrapper-gate/frontend/ui';
import { ScrapperRunListItemProps } from '../ScrapperRunListItem/ScrapperRunListItem.types';

export interface MyScrapperRunsListProps
  extends Pick<ScrapperRunListItemProps, 'onRunClick'>,
    Pick<ControlledListProps, 'emptyContent' | 'fetchPolicy'> {
  activeScrapperRunId?: string;
}
