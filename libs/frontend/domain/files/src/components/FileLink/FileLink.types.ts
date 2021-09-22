import { ListItemProps } from '@mui/material';
import { FileLinkFileFragment } from '@scrapper-gate/shared/schema';

export interface FileLinkProps {
  file: FileLinkFileFragment;
  asListItem?: boolean;
  ListItemProps?: ListItemProps;
}
