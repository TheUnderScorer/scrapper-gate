import { List, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useReturnUrlProvider } from '@scrapper-gate/frontend/common';
import { useFormFieldValue } from '@scrapper-gate/frontend/form';
import { NodeContentProps } from '@scrapper-gate/frontend/ui';
import { DateFormat, toDisplayText } from '@scrapper-gate/shared/common';
import classNames from 'classnames';
import { format } from 'date-fns';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ScrapperRunNodeProperties,
  ScrapperRunProps,
  ScrapperRunScrapper,
} from '../ScrapperRun.types';

const useStyles = makeStyles(() => ({
  list: {
    '&.MuiList-root': {
      marginTop: 0,
    },
  },
}));

export interface ScrapperRunNodeContentProps
  extends NodeContentProps,
    Pick<ScrapperRunProps, 'scrapperUrlCreator'> {}

export const ScrapperRunNodeContent = ({
  getFieldName,
  scrapperUrlCreator,
}: ScrapperRunNodeContentProps) => {
  const classes = useStyles();

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
    () => runResult?.values?.map((value) => value.value).join(', '),
    [runResult]
  );

  const returnUrl = useReturnUrlProvider();

  return (
    <List className={classNames(classes.list, 'scrapper-run-node-content')}>
      {values && (
        <ListItem disableGutters>
          {<ListItemText primary="Value" secondary={values} />}
        </ListItem>
      )}
      {runResult?.step?.key && (
        <ListItem disableGutters>
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
          <ListItemText
            primary="Status"
            secondary={toDisplayText(runResult.state)}
          />
        </ListItem>
      )}
      {runResult?.startedAt && (
        <ListItem disableGutters>
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
          <ListItemText
            primary="Ended at"
            secondary={format(new Date(runResult.endedAt), DateFormat.DateTime)}
          />
        </ListItem>
      )}
      {runResult?.performance?.duration && (
        <ListItem disableGutters>
          <ListItemText>
            This step took <i>{runResult.performance.duration.toFixed(2)}MS</i>
          </ListItemText>
        </ListItem>
      )}
    </List>
  );
};
