import React, { useCallback, useMemo, useState } from 'react';
import {
  IconButton,
  InputAdornment,
  List,
  Stack,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ClearSharp } from '@material-ui/icons';
import { FlowBuilderSidebarItem } from './Item/FlowBuilderSidebarItem';
import { useFlowBuilderSelection } from '../providers/FlowBuilderSelection.provider';
import { Centered, ResizablePanel } from '@scrapper-gate/frontend/ui';

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

  const [search, setSearch] = useState('');

  const { selection } = useFlowBuilderSelection();

  const filteredSelection = useMemo(() => {
    if (!search) {
      return selection;
    }

    return selection?.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, selection]);

  const clearSearch = useCallback(() => setSearch(''), []);

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
        <TextField
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search steps..."
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={clearSearch}>
                  <ClearSharp />
                </IconButton>
              </InputAdornment>
            ),
          }}
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
