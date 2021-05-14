import { ScrapperAction } from '@scrapper-gate/shared/schema';
import { FlowBuilderNodeTypes } from '@scrapper-gate/frontend/ui';

export const scrapperActionNodeTypeMap = {
  [ScrapperAction.Condition]: FlowBuilderNodeTypes.Conditional,
};
