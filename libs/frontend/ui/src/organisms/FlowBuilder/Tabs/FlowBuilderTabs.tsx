import React, { ReactNode } from 'react';
import { Paper, Tab, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Selection } from '@scrapper-gate/frontend/common';

export interface FlowBuilderTabsProps {
  value: unknown;
  onChange: (value: unknown) => unknown;
  tabs?: Array<Selection & { content?: ReactNode }>;
  mainTabLabel?: string;
}

export const mainTab = 'main';

const useStyles = makeStyles((theme) => ({
  tabs: {
    backgroundColor: 'inherit',
  },
  paper: {
    borderLeft: 'none',
    borderRight: 'none',
    backgroundColor: theme.palette.greyVariant['100'],
  },
}));

export const FlowBuilderTabs = ({
  value,
  onChange,
  mainTabLabel = 'Steps',
  tabs,
}: FlowBuilderTabsProps) => {
  const classes = useStyles();

  return (
    <Paper square variant="outlined" elevation={1} className={classes.paper}>
      <Tabs
        indicatorColor="primary"
        value={value}
        onChange={(event, value) => onChange(value)}
        className={classes.tabs}
      >
        <Tab label={mainTabLabel} value={mainTab} />
        {tabs?.map((tab) => (
          <Tab label={tab.label} value={tab.value} key={tab.value.toString()} />
        ))}
      </Tabs>
    </Paper>
  );
};