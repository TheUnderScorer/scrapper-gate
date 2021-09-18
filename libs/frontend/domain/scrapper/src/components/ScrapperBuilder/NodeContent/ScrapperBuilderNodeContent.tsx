import { Stack } from '@mui/material';
import { NodeContentProps } from '@scrapper-gate/frontend/flow-builder';
import { useFormFieldValue } from '@scrapper-gate/frontend/form';
import { ScrapperAction } from '@scrapper-gate/shared/schema';
import React, { memo, useMemo } from 'react';
import { ScrapperBuilderProps } from '../ScrapperBuilder.types';
import { sections } from '../sections';

export interface ScrapperBuilderNodeContentProps
  extends Pick<ScrapperBuilderProps, 'ElementPicker'>,
    NodeContentProps {}

const BaseScrapperBuilderNodeContent = (
  props: ScrapperBuilderNodeContentProps
) => {
  const { getFieldName } = props;

  const action = useFormFieldValue<ScrapperAction>(getFieldName('action'));

  const Section = useMemo(() => action && sections[action], [action]);

  return (
    <Stack spacing={4} direction="column">
      {Section && <Section {...props} fieldNameCreator={props.getFieldName} />}
    </Stack>
  );
};

export const ScrapperBuilderNodeContent = memo(BaseScrapperBuilderNodeContent);
