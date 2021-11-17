import { Paper, Tab, Tabs } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { FlowBuilderTabsSelection } from '../FlowBuilder.types';

const PREFIX = 'FlowBuilderTabs';

const classes = {
  tabs: `${PREFIX}-tabs`,
  paper: `${PREFIX}-paper`,
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  [`& .${classes.tabs}`]: {
    backgroundColor: 'inherit',
  },

  [`&.${classes.paper}`]: {
    borderLeft: 'none',
    borderRight: 'none',
    backgroundColor: theme.palette.greyVariant?.['100'],
  },
}));

export interface FlowBuilderTabsProps {
  value: unknown;
  onChange: (value: string) => unknown;
  tabs?: Array<FlowBuilderTabsSelection>;
  mainTabLabel?: string;
}

export const mainTab = 'main';

export const FlowBuilderTabs = ({
  value,
  onChange,
  mainTabLabel = 'Steps',
  tabs,
}: FlowBuilderTabsProps) => {
  return (
    <StyledPaper square variant="outlined" className={classes.paper}>
      <Tabs
        indicatorColor="primary"
        value={value ?? mainTab}
        onChange={(event, value) => onChange(value)}
        className={classes.tabs}
      >
        <Tab label={mainTabLabel} value={mainTab} />
        {tabs?.map((tab) => (
          <Tab label={tab.label} value={tab.value} key={tab.value} />
        ))}
      </Tabs>
    </StyledPaper>
  );
};
