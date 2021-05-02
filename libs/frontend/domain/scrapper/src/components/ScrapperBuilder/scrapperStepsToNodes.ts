import {
  FlowBuilderNodeTypes,
  flowBuilderUtils,
} from '@scrapper-gate/frontend/ui';
import {
  ScrapperBuilderNodeSelection,
  ScrapperBuilderStep,
} from '@scrapper-gate/frontend/domain/scrapper';
import { scrapperActionNodeTypeMap } from './scrapperActionNodeTypeMap';
import { Selection } from '@scrapper-gate/frontend/common';

export const scrapperStepsToNodes = (
  steps: ScrapperBuilderStep[],
  selections: Selection<ScrapperBuilderNodeSelection>[]
) => {
  const stepsWithTypes = steps.map((step) => ({
    ...step,
    type: scrapperActionNodeTypeMap[step.action] ?? FlowBuilderNodeTypes.Action,
  }));

  return flowBuilderUtils.recreateNodes({
    findSelectionForItem: (item) =>
      selections.find((selection) => selection.value.action === item.action),
    items: stepsWithTypes,
    selections,
  });
};
