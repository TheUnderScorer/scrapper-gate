import {
  Assignment,
  Error,
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
import { isCompleted } from '@scrapper-gate/shared/run-states';
import {
  Maybe,
  ScrapperRunScrapperFragment,
} from '@scrapper-gate/shared/schema';
import { format } from 'date-fns';
import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ScrapperRunNodeProperties,
  ScrapperRunProps,
} from '../ScrapperRun.types';

const StyledList = styled(List)(({ theme }) => ({
  '&.MuiList-root': {
    marginTop: 0,
  },

  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: theme.spacing(2),
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

  const scrapper = useFormFieldValue<ScrapperRunScrapperFragment>('scrapper');

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

  const completed = isCompleted(runResult?.state);

  return (
    <div>
      <Accordion
        variant="outlined"
        expanded={expanded === ScrapperRunNodeContentPanel.Details}
        onChange={handleExpandedChange(ScrapperRunNodeContentPanel.Details)}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <StyledList disablePadding className="scrapper-run-node-content">
            {values && (
              <ListItem disableGutters>
                <ListItemIcon>
                  <Storage />
                </ListItemIcon>
                {<ListItemText primary="Value" secondary={values} />}
              </ListItem>
            )}
            {runResult?.step && (
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
                        {runResult.step.key ?? 'View step'}
                      </Link>
                    ) : (
                      runResult.step.key ?? 'View step'
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

            {runResult?.error && (
              <ListItem disableGutters>
                <ListItemIcon>
                  <Error />
                </ListItemIcon>
                <ListItemText
                  primary="Error"
                  secondary={runResult.error.message}
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
                  <List
                    dense
                    sx={{
                      paddingTop: 0,
                      marginLeft: (theme) => theme.spacing(2),
                    }}
                  >
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
          </StyledList>
        </AccordionDetails>
      </Accordion>
      {completed && (
        <Accordion
          variant="outlined"
          expanded={expanded === ScrapperRunNodeContentPanel.Duration}
          onChange={handleExpandedChange(ScrapperRunNodeContentPanel.Duration)}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Duration</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <StyledList disablePadding>
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
                    <i>
                      {runResult.performance.duration.seconds.toFixed(2)}{' '}
                      seconds.
                    </i>
                  </ListItemText>
                </ListItem>
              )}
            </StyledList>
          </AccordionDetails>
        </Accordion>
      )}
    </div>
  );
};
