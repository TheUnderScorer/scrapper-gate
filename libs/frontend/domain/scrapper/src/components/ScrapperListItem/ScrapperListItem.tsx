import {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { Dropdown, RunState, RunStateEntity } from '@scrapper-gate/frontend/ui';
import { toDisplayText } from '@scrapper-gate/shared/common';
import React from 'react';
import { scrapperTypeIconMap } from '../../dictionary/scrapperTypeIconMap';
import { ScrapperListItemProps } from './ScrapperListItem.types';

export const ScrapperListItem = ({
  scrapper,
  onScrapperClick,
  ...props
}: ScrapperListItemProps) => {
  const theme = useTheme();

  return (
    <ListItem
      className="scrapper-list-item"
      button
      onClick={() => onScrapperClick?.(scrapper)}
      {...props}
    >
      <Tooltip title={toDisplayText(scrapper.type)}>
        <ListItemIcon>{scrapperTypeIconMap[scrapper.type]}</ListItemIcon>
      </Tooltip>
      <ListItemText
        primary={scrapper.name}
        secondary={
          <Typography color="text.secondary">
            <RunState
              showMessageAndIcon={false}
              entity={RunStateEntity.Scrapper}
              entityName={scrapper.name ?? ''}
              lastRunDate={
                scrapper.lastRun?.endedAt
                  ? new Date(scrapper.lastRun.endedAt)
                  : undefined
              }
            />
          </Typography>
        }
      />
      <ListItemSecondaryAction>
        <Dropdown
          items={[
            {
              id: 'run_scrapper',
              icon: theme.icons.run,
              content: 'Run scrapper',
              disabled: scrapper.isRunning,
            },
            {
              id: 'separator',
              type: 'divider',
            },
            {
              id: 'delete_scrapper',
              icon: theme.icons.delete,
              content: 'Delete scrapper',
              sx: {
                '&, & svg': {
                  color: (theme) => theme.palette.error.main,
                },
              },
            },
          ]}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
};
