import { ListItemProps } from '@material-ui/core';
import { FileLinkFileFragment } from '@scrapper-gate/shared/schema';

export interface FileLinkProps {
  file: FileLinkFileFragment;
  asListItem?: boolean;
  ListItemProps?: ListItemProps;
}
