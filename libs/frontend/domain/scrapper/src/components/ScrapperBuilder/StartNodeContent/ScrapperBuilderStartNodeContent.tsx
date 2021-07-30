import { Stack } from '@material-ui/core';
import { FieldNameCreator } from '@scrapper-gate/frontend/form';
import React from 'react';
import { Url } from '../commonFields/Url';
import { ScrapperBuilderStartNodeContentProps } from './ScrapperBuilderStartNodeContent.types';

const fieldNameCreator: FieldNameCreator = (name?: string) => name ?? '';

export const ScrapperBuilderStartNodeContent = ({
  nodeIndex,
  browserUrl,
}: ScrapperBuilderStartNodeContentProps) => {
  return (
    <Stack spacing={4}>
      <Url
        allowPreviousStepUrl={false}
        helperText="URL on which scrapper will be started. If left empty, scrapper will start on URL from first step."
        label="Start url"
        fieldNameCreator={fieldNameCreator}
        nodeIndex={nodeIndex}
        name="runSettings.initialUrl"
        initialValue={browserUrl ?? undefined}
      />
    </Stack>
  );
};
