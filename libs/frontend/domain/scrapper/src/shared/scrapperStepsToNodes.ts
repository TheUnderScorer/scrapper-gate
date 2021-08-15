import { Selection } from '@scrapper-gate/frontend/common';
import {
  FlowBuilderNodeTypes,
  flowBuilderUtils,
} from '@scrapper-gate/frontend/ui';
import { scrapperActionNodeTypeMap } from './scrapperActionNodeTypeMap';
import { ScrapperBuilderNodeSelection } from './scrapperNodeSelection';
import { ScrapperBuilderStep } from './types';

export const scrapperStepsToNodes = <T extends ScrapperBuilderStep>(
  steps: T[],
  selections: Selection<ScrapperBuilderNodeSelection>[]
) => {
  const stepsWithTypes = steps.map((step) => ({
    ...step,
    type: scrapperActionNodeTypeMap[step.action] ?? FlowBuilderNodeTypes.Action,
  }));

  return flowBuilderUtils.recreateNodes({
    findSelectionForItem: (item) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      selections.find((selection) => selection.value.action === item.action)!,
    items: stepsWithTypes,
    selections,
    startNodeNoContent: false,
  });
};
