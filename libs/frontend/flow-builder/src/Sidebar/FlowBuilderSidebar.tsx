import { Box, List, Skeleton, Stack, Typography } from '@mui/material';
import { Selection } from '@scrapper-gate/frontend/common';
import {
  Centered,
  FilterTextField,
  ResizablePanel,
  SkeletonListItem,
} from '@scrapper-gate/frontend/ui';
import React, { useState } from 'react';
import { range } from 'remeda';
import { BaseNodeSelectionProperties } from '../FlowBuilder.types';
import { useFlowBuilderContextSelector } from '../providers/FlowBuilderProps.provider';
import { useFlowBuilderSelection } from '../providers/FlowBuilderSelection.provider';
import { FlowBuilderSidebarItem } from './Item/FlowBuilderSidebarItem';

export const FlowBuilderSidebar = () => {
  const { selection } = useFlowBuilderSelection();

  const [filteredSelection, setFilteredSelection] = useState(selection);

  const loading = useFlowBuilderContextSelector((ctx) => ctx.loading);

  return (
    <ResizablePanel
      initialWidth="25%"
      enable={{
        right: true,
      }}
      minWidth="200px"
      maxWidth="400px"
      paperProps={{
        square: true,
        elevation: 1,
        variant: 'outlined',
        sx: {
          padding: (theme) => theme.spacing(2),
          borderLeft: 'none',
          borderTop: 'none',
          borderBottom: 'none',
        },
      }}
    >
      {loading && (
        <Box height="100%" width="100%">
          <Stack direction="column">
            <Skeleton width="100%" variant="text" />
            <Skeleton width="100%" variant="text" height={40} />
            <Box mt={2}>
              <Stack direction="column" spacing={1}>
                {range(0, 5).map((index) => (
                  <SkeletonListItem key={index} />
                ))}
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
      {!loading && (
        <Stack spacing={2} direction="column" sx={{ height: '100%' }}>
          <Typography variant="h6">List of steps</Typography>
          <FilterTextField<Selection<BaseNodeSelectionProperties>>
            items={selection ?? []}
            onItemsChange={setFilteredSelection}
            filterKeys={['label']}
            placeholder="Search steps..."
          />
          {Boolean(filteredSelection?.length) && (
            <List
              sx={{
                overflow: 'auto',
                flex: 1,
                marginBottom: (theme) => theme.spacing(4),

                '& .item-Conditional': {
                  paddingLeft: (theme) => theme.spacing(2.5),
                },
              }}
            >
              {filteredSelection?.map((selection) => (
                <FlowBuilderSidebarItem
                  className={`item-${selection.value.type}`}
                  item={selection}
                  key={selection.label}
                />
              ))}
            </List>
          )}
          {!filteredSelection?.length && (
            <Centered>
              <Typography variant="body2">No steps found</Typography>
            </Centered>
          )}
        </Stack>
      )}
    </ResizablePanel>
  );
};
