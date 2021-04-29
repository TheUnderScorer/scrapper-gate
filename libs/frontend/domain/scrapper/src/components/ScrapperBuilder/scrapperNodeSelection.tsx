import { FlowBuilderNodeTypes } from '@scrapper-gate/frontend/ui';
import { ScrapperAction } from '@scrapper-gate/shared/schema';
import { scrapperActionIcons } from '../../dictionary/scrapperActionIcons';
import { scrapperActionTextMap } from '../../dictionary/scrapperActionTextMap';
import { ScrapperBuilderNodeProperties } from './ScrapperBuilder.types';
import { Selection } from '@scrapper-gate/frontend/common';

const scrapperActionNodeTypeMap = {
  [ScrapperAction.Condition]: FlowBuilderNodeTypes.Conditional,
};

export const createScrapperNodeSelection = (): Selection<ScrapperBuilderNodeProperties>[] =>
  Object.values(ScrapperAction).map((action) => ({
    value: {
      title: scrapperActionTextMap[action],
      action,
      type: scrapperActionNodeTypeMap[action] ?? FlowBuilderNodeTypes.Action,
    },
    icon: scrapperActionIcons[action],
    label: scrapperActionTextMap[action],
  }));
