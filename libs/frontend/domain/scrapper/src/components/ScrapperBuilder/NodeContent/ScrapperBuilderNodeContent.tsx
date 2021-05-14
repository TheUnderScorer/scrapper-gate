import React, { memo, useMemo } from 'react';
import { ScrapperBuilderProps } from '../ScrapperBuilder.types';
import { useFormFieldValue } from '@scrapper-gate/frontend/form';
import { sections } from '../sections';
import { Stack } from '@material-ui/core';
import { NodeContentProps } from '@scrapper-gate/frontend/ui';
import { ScrapperAction } from '@scrapper-gate/shared/schema';
import { makeStyles } from '@material-ui/core/styles';

export interface ScrapperBuilderNodeContentProps
  extends Pick<ScrapperBuilderProps, 'ElementPicker'>,
    NodeContentProps {}

const useStyles = makeStyles(() => ({
  stack: {
    minWidth: '800px',
  },
}));

const BaseScrapperBuilderNodeContent = (
  props: ScrapperBuilderNodeContentProps
) => {
  const classes = useStyles();

  const { getFieldName } = props;

  const action = useFormFieldValue<ScrapperAction>(getFieldName('action'));

  const Section = useMemo(() => sections[action], [action]);

  return (
    <Stack className={classes.stack} spacing={4} direction="column">
      {Section && <Section {...props} fieldNameCreator={props.getFieldName} />}
    </Stack>
  );
};

export const ScrapperBuilderNodeContent = memo(BaseScrapperBuilderNodeContent);
