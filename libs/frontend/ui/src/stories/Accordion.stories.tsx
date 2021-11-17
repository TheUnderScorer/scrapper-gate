import { ExpandMore } from '@mui/icons-material';
import {
  Accordion as AccordionCmp,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  Box,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';
import { Meta } from '@storybook/react';
import React from 'react';

export default {
  title: 'UI/Accordion',
  component: AccordionCmp,
  argTypes: {
    variant: {
      control: {
        type: 'select',
        options: ['elevation', 'outlined', 'transparent'],
      },
    },
  },
} as Meta;

export const Accordion = (args: Pick<AccordionProps, 'variant'>) => {
  return (
    <Box width="400px">
      <AccordionCmp {...args}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Run configuration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            label="Fail if no elements were found"
            control={<Switch />}
          />
          <FormControlLabel label="Use proxy" control={<Switch />} />
        </AccordionDetails>
      </AccordionCmp>
    </Box>
  );
};

Accordion.args = {
  variant: 'transparent',
};
