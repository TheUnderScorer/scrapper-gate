import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControlLabel,
  Switch,
  Typography,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import React from 'react';

export default {
  title: 'UI/Accordion',
};

export const Transparent = () => {
  return (
    <Box width="400px">
      <Accordion variant="transparent">
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
      </Accordion>
    </Box>
  );
};
