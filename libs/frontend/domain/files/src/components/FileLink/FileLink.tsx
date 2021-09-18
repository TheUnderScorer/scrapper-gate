import {
  Link,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
} from '@mui/material';
import { Image as ImageIcon, VideoCall } from '@mui/icons-material';
import { Image } from '@scrapper-gate/frontend/ui';
import { FileKind } from '@scrapper-gate/shared/schema';
import React, { ReactNode } from 'react';
import { FileLinkProps } from './FileLink.types';

const iconMap: {
  [Key in FileKind]?: ReactNode;
} = {
  [FileKind.Image]: <ImageIcon />,
  [FileKind.Video]: <VideoCall />,
};

export const FileLink = ({
  file,
  asListItem,
  ListItemProps,
}: FileLinkProps) => {
  const icon = iconMap[file.kind];

  const link = (
    <Link href={file.url}>
      {file.kind === FileKind.Image ? (
        <Paper variant="outlined">
          <Image src={file.url} />
        </Paper>
      ) : (
        file.name
      )}
    </Link>
  );

  if (asListItem) {
    return (
      <ListItem {...ListItemProps}>
        {file.kind !== FileKind.Image && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText>{link}</ListItemText>
      </ListItem>
    );
  }

  return (
    <Stack direction="row" spacing={1}>
      {icon}
      link
    </Stack>
  );
};
