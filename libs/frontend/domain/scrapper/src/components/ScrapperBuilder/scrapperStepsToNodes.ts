import { Selection } from '@scrapper-gate/frontend/common';
import {
  FlowBuilderNodeTypes,
  flowBuilderUtils,
} from '@scrapper-gate/frontend/ui';
import { ScrapperAction } from '@scrapper-gate/shared/schema';
import { scrapperActionNodeTypeMap } from './scrapperActionNodeTypeMap';
import {
  ScrapperBuilderNodeSelection,
  ScrapperBuilderStep,
} from './ScrapperBuilder.types';

export const scrapperStepsToNodes = (
  steps: ScrapperBuilderStep[],
  selections: Selection<ScrapperBuilderNodeSelection>[]
) => {
  const stepsWithTypes = steps.map((step) => ({
    ...step,
    type:
      (
        scrapperActionNodeTypeMap as Record<
          ScrapperAction,
          FlowBuilderNodeTypes
        >
      )[
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        step.action!
      ] ?? FlowBuilderNodeTypes.Action,
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
