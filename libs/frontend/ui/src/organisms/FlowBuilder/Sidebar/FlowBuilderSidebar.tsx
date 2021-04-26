import React, { useState } from 'react';
import { List, Stack, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FlowBuilderSidebarItem } from './Item/FlowBuilderSidebarItem';
import { useFlowBuilderSelection } from '../providers/FlowBuilderSelection.provider';
import {
  BaseNodeSelectionProperties,
  Centered,
  FilterTextField,
  ResizablePanel,
} from '@scrapper-gate/frontend/ui';
import { Selection } from '@scrapper-gate/frontend/common';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    borderLeft: 'none',
    borderTop: 'none',
    borderBottom: 'none',
  },
  grid: {
    height: '100%',
  },
  list: {
    overflow: 'auto',
    flex: 1,
    marginBottom: theme.spacing(4),

    '& .item-Conditional': {
      paddingLeft: theme.spacing(2.5),
    },
  },
}));

export const FlowBuilderSidebar = () => {
  const classes = useStyles();

  const { selection } = useFlowBuilderSelection();

  const [filteredSelection, setFilteredSelection] = useState(selection);

  return (
    <ResizablePanel
      initialWidth="25%"
      enable={{
        right: true,
      }}
      minWidth="200px"
      maxWidth="600px"
      paperProps={{
        square: true,
        elevation: 1,
        variant: 'outlined',
        className: classes.paper,
      }}
    >
      <Stack spacing={2} direction="column" className={classes.grid}>
        <Typography variant="h6">List of steps</Typography>
        <FilterTextField<Selection<BaseNodeSelectionProperties>>
          items={selection}
          onItemsChange={setFilteredSelection}
          filterKeys={['label']}
          placeholder="Search steps..."
        />
        {Boolean(filteredSelection?.length) && (
          <List className={classes.list}>
            {filteredSelection.map((selection) => (
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
    </ResizablePanel>
  );
};
