import { FlowBuilderNodeTypes } from '@scrapper-gate/frontend/flow-builder';
import { ScrapperStepInputSchema } from '@scrapper-gate/shared/validation';
import joi from 'joi';
import { isEdge } from 'react-flow-renderer';
import { ScrapperBuilderNode } from '../ScrapperBuilder.types';

const omitTypes = [FlowBuilderNodeTypes.Start, FlowBuilderNodeTypes.End];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const whenSchema = joi.object().custom((item: ScrapperBuilderNode, helpers) => {
  if (isEdge(item) || omitTypes.includes(item.type as FlowBuilderNodeTypes)) {
    return helpers.error('any');
  }

  return item;
});
export const ScrapperStepNodeSchema = joi
  .object<Pick<ScrapperBuilderNode, 'data' | 'type'>>({
    data: joi.object(),
    type: joi.string(),
  })
  .when(whenSchema, {
    then: {
      data: ScrapperStepInputSchema,
    },
  });
