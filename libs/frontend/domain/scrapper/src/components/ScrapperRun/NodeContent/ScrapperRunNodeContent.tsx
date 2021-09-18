import {
  Assignment,
  EventAvailable,
  EventNote,
  ExpandMore,
  Receipt,
  Schedule,
  Screenshot,
  Storage,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useReturnUrlProvider } from '@scrapper-gate/frontend/common';
import { FileLink } from '@scrapper-gate/frontend/domain/files';
import { NodeContentProps } from '@scrapper-gate/frontend/flow-builder';
import { useFormFieldValue } from '@scrapper-gate/frontend/form';
import {
  DateFormat,
  ExcludeFalsy,
  toDisplayText,
} from '@scrapper-gate/shared/common';
import { Maybe } from '@scrapper-gate/shared/schema';
import classNames from 'classnames';
import { format } from 'date-fns';
import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ScrapperRunNodeProperties,
  ScrapperRunProps,
  ScrapperRunScrapper,
} from '../ScrapperRun.types';

const PREFIX = 'ScrapperRunNodeContent';

const classes = {
  list: `${PREFIX}-list`,
  nestedList: `${PREFIX}-nestedList`,
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.list}`]: {
    '&.MuiList-root': {
      marginTop: 0,
    },
    '& .MuiListItemIcon-root': {
      minWidth: 0,
      marginRight: theme.spacing(2),
    },
  },

  [`& .${classes.nestedList}`]: {
    paddingTop: 0,
    marginLeft: theme.spacing(2),
  },
}));

enum ScrapperRunNodeContentPanel {
  Details = 'Details',
  Duration = 'Duration',
}

export interface ScrapperRunNodeContentProps
  extends NodeContentProps,
    Pick<ScrapperRunProps, 'scrapperUrlCreator'> {}

export const ScrapperRunNodeContent = ({
  getFieldName,
  scrapperUrlCreator,
}: ScrapperRunNodeContentProps) => {
  const [expanded, setExpanded] = useState<Maybe<ScrapperRunNodeContentPanel>>(
    ScrapperRunNodeContentPanel.Details
  );
  const handleExpandedChange = useCallback(
    (panel: ScrapperRunNodeContentPanel) =>
      (event: unknown, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : undefined);
      },
    []
  );

  const runResult = useFormFieldValue<ScrapperRunNodeProperties['runResult']>(
    getFieldName('runResult')
  );

  const scrapper = useFormFieldValue<ScrapperRunScrapper>('scrapper');

  const stepExists = useMemo(
    () =>
      runResult?.step?.id &&
      Boolean(scrapper?.steps?.find((step) => step.id === runResult.step.id)),
    [runResult, scrapper]
  );

  const values = useMemo(
    () =>
      runResult?.values
        ?.map((value) => value.value)
        .filter(ExcludeFalsy)
        .join(', '),
    [runResult]
  );

  const returnUrl = useReturnUrlProvider();

  return (
    <Root>
      <Accordion
        variant="outlined"
        expanded={expanded === ScrapperRunNodeContentPanel.Details}
        onChange={handleExpandedChange(ScrapperRunNodeContentPanel.Details)}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List
            disablePadding
            className={classNames(classes.list, 'scrapper-run-node-content')}
          >
            {values && (
              <ListItem disableGutters>
                <ListItemIcon>
                  <Storage />
                </ListItemIcon>
                {<ListItemText primary="Value" secondary={values} />}
              </ListItem>
            )}
            {runResult?.step?.key && (
              <ListItem disableGutters disablePadding>
                <ListItemIcon>
                  <Assignment />
                </ListItemIcon>
                <ListItemText
                  primary="Step"
                  secondary={
                    stepExists ? (
                      <Link
                        to={scrapperUrlCreator({
                          scrapperId: scrapper?.id ?? '',
                          stepId: runResult?.step?.id,
                          returnUrl,
                        })}
                      >
                        {runResult.step.key}
                      </Link>
                    ) : (
                      runResult.step.key
                    )
                  }
                />
              </ListItem>
            )}
            {runResult?.state && (
              <ListItem disableGutters>
                <ListItemIcon>
                  <Receipt />
                </ListItemIcon>
                <ListItemText
                  primary="Status"
                  secondary={toDisplayText(runResult.state)}
                />
              </ListItem>
            )}

            {Boolean(runResult?.screenshots?.length) && (
              <>
                <ListItem disableGutters>
                  <ListItemIcon>
                    <Screenshot />
                  </ListItemIcon>
                  <ListItemText>Screenshots: </ListItemText>
                </ListItem>
                <ListItem disableGutters>
                  <List className={classes.nestedList} dense>
                    {runResult?.screenshots
                      ?.filter(ExcludeFalsy)
                      .map((screenshot) => (
                        <FileLink
                          key={screenshot.id}
                          asListItem
                          ListItemProps={{ disableGutters: true }}
                          file={screenshot}
                        />
                      ))}
                  </List>
                </ListItem>
              </>
            )}
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion
        variant="outlined"
        expanded={expanded === ScrapperRunNodeContentPanel.Duration}
        onChange={handleExpandedChange(ScrapperRunNodeContentPanel.Duration)}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Duration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List disablePadding>
            {runResult?.startedAt && (
              <ListItem disableGutters>
                <ListItemIcon>
                  <EventNote />
                </ListItemIcon>
                <ListItemText
                  primary="Started at"
                  secondary={format(
                    new Date(runResult.startedAt),
                    DateFormat.DateTime
                  )}
                />
              </ListItem>
            )}

            {runResult?.endedAt && (
              <ListItem disableGutters>
                <ListItemIcon>
                  <EventAvailable />
                </ListItemIcon>
                <ListItemText
                  primary="Ended at"
                  secondary={format(
                    new Date(runResult.endedAt),
                    DateFormat.DateTime
                  )}
                />
              </ListItem>
            )}

            {runResult?.performance?.duration && (
              <ListItem disableGutters>
                <ListItemIcon>
                  <Schedule />
                </ListItemIcon>
                <ListItemText>
                  This step took{' '}
                  <i>{runResult.performance.duration.toFixed(2)}MS</i>
                </ListItemText>
              </ListItem>
            )}
          </List>
        </AccordionDetails>
      </Accordion>
    </Root>
  );
};
