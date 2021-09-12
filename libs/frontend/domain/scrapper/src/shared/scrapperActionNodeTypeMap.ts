import { FlowBuilderNodeTypes } from '@scrapper-gate/frontend/flow-builder';
import { ScrapperAction } from '@scrapper-gate/shared/schema';

export type ScrapperActionNodeTypeMap = {
  [Key in ScrapperAction]?: FlowBuilderNodeTypes;
};

export const scrapperActionNodeTypeMap: ScrapperActionNodeTypeMap = {
  [ScrapperAction.Condition]: FlowBuilderNodeTypes.Conditional,
};
