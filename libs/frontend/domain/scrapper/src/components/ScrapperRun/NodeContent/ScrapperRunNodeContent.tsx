import { List, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useFormFieldValue } from '@scrapper-gate/frontend/form';
import { NodeContentProps } from '@scrapper-gate/frontend/ui';
import { DateFormat, toDisplayText } from '@scrapper-gate/shared/common';
import { format } from 'date-fns';
import React, { useMemo } from 'react';
import { ScrapperRunNodeProperties } from '../ScrapperRun.types';

const useStyles = makeStyles(() => ({
  list: {
    '&.MuiList-root': {
      marginTop: 0,
    },
  },
}));

export const ScrapperRunNodeContent = ({ getFieldName }: NodeContentProps) => {
  const classes = useStyles();

  const runResult = useFormFieldValue<ScrapperRunNodeProperties['runResult']>(
    getFieldName('runResult')
  );

  const values = useMemo(
    () => runResult?.values?.map((value) => value.value).join(', '),
    [runResult]
  );

  return (
    <List className={classes.list}>
      {runResult?.step?.key && (
        <ListItem disableGutters>
          <ListItemText primary="Key" secondary={runResult.step.key} />
        </ListItem>
      )}
      {values && (
        <ListItem disableGutters>
          <ListItemText primary="Value" secondary={values} />
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
