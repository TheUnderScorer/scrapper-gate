import { Selection } from '@scrapper-gate/frontend/common';
import {
  BaseNodeSelectionProperties,
  FlowBuilderNodeTypes,
} from '@scrapper-gate/frontend/ui';
import { ScrapperAction } from '@scrapper-gate/shared/schema';
import { scrapperActionIcons } from '../dictionary/scrapperActionIcons';
import { scrapperActionTextMap } from '../dictionary/scrapperActionTextMap';
import { scrapperActionNodeTypeMap } from './scrapperActionNodeTypeMap';
import { ScrapperBuilderStep } from './types';

export type ScrapperBuilderNodeSelection = BaseNodeSelectionProperties &
  Omit<ScrapperBuilderStep, 'id' | 'action'> &
  Pick<Partial<ScrapperBuilderStep>, 'action'>;
export const createScrapperNodeSelection =
  (): Selection<ScrapperBuilderNodeSelection>[] =>
    Object.values(ScrapperAction).map((action) => ({
      value: {
        id: '',
        title: scrapperActionTextMap[action],
        action,
        type: scrapperActionNodeTypeMap[action] ?? FlowBuilderNodeTypes.Action,
      },
      icon: scrapperActionIcons[action],
      label: scrapperActionTextMap[action],
    }));
