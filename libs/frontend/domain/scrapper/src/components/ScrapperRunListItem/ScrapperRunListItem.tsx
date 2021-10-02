import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { RunState, RunStateEntity } from '@scrapper-gate/frontend/ui';
import { toDisplayText } from '@scrapper-gate/shared/common';
import React from 'react';
import { scrapperTypeIconMap } from '../../dictionary/scrapperTypeIconMap';
import { ScrapperRunListItemProps } from './ScrapperRunListItem.types';

// TODO Store scrapper type in run
export const ScrapperRunListItem = ({
  scrapperRun,
  onRunClick,
  selected,
}: ScrapperRunListItemProps) => {
  return (
    <ListItem
      selected={selected}
      className="scrapper-run-list-item"
      button
      onClick={() => onRunClick?.(scrapperRun)}
    >
      {scrapperRun.scrapper && (
        <Tooltip title={toDisplayText(scrapperRun.scrapper.type)}>
          <ListItemIcon>
            {scrapperTypeIconMap[scrapperRun.scrapper.type]}
          </ListItemIcon>
        </Tooltip>
      )}
      <ListItemText
        primary={scrapperRun.name}
        secondary={
          <Stack direction="row" spacing={2}>
            <Typography>{scrapperRun.scrapper?.name}</Typography>
            <RunState
              runMutationCalled
              state={scrapperRun.state}
              showMessage={false}
              showIcon={true}
              entity={RunStateEntity.Scrapper}
              entityName={scrapperRun.name ?? ''}
            />
          </Stack>
        }
      />
    </ListItem>
  );
};
