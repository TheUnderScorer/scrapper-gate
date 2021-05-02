import { FlowBuilderNodeTypes } from '@scrapper-gate/frontend/ui';
import { ScrapperAction } from '@scrapper-gate/shared/schema';
import { scrapperActionIcons } from '../../dictionary/scrapperActionIcons';
import { scrapperActionTextMap } from '../../dictionary/scrapperActionTextMap';
import { ScrapperBuilderNodeSelection } from './ScrapperBuilder.types';
import { Selection } from '@scrapper-gate/frontend/common';
import { scrapperActionNodeTypeMap } from './scrapperActionNodeTypeMap';

export const createScrapperNodeSelection = (): Selection<ScrapperBuilderNodeSelection>[] =>
  Object.values(ScrapperAction).map((action) => ({
    value: {
      title: scrapperActionTextMap[action],
      action,
      type: scrapperActionNodeTypeMap[action] ?? FlowBuilderNodeTypes.Action,
    },
    icon: scrapperActionIcons[action],
    label: scrapperActionTextMap[action],
  }));
