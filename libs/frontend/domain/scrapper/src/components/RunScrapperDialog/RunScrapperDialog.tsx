import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  DialogContentText,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { Dialog } from '@scrapper-gate/frontend/dialogs';
import { ScrapperType } from '@scrapper-gate/shared/schema';
import React from 'react';
import { RunScrapperDialogProps } from './RunScrapperDialog.types';

export const runScrapperDialogId = 'RUN_SCRAPPER';

export const RunScrapperDialog = ({
  scrapper,
  onCancel,
}: RunScrapperDialogProps) => {
  return (
    <Dialog
      onCancel={onCancel}
      id={runScrapperDialogId}
      title="Run scrapper"
      actions={<Button variant="contained">Confirm</Button>}
    >
      <DialogContentText whiteSpace="pre-wrap">
        You are about to run scrapper <strong>{scrapper.name}</strong>.
        {scrapper.type === ScrapperType.RealBrowser &&
          '\nYou will be charged for this run depending on how long it will take.'}
      </DialogContentText>
      <Accordion variant="outlined">
        <AccordionSummary expandIcon={<ExpandMore />}>
          Run parameters
        </AccordionSummary>
        <AccordionDetails>Stuff</AccordionDetails>
      </Accordion>
    </Dialog>
  );
};
