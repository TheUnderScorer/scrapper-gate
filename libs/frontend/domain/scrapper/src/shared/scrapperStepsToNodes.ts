import { Selection } from '@scrapper-gate/frontend/common';
import {
  FlowBuilderNodeTypes,
  flowBuilderUtils,
  RecreateNodesParams,
} from '@scrapper-gate/frontend/flow-builder';
import { Duration } from '@scrapper-gate/shared/common';
import { scrapperActionNodeTypeMap } from './scrapperActionNodeTypeMap';
import { ScrapperBuilderNodeSelection } from './scrapperNodeSelection';
import { ScrapperBuilderStep } from './types';

interface ScrapperStepsToNodesParams<T extends ScrapperBuilderStep>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extends Pick<RecreateNodesParams<any, any>, 'startNodePosition'> {
  steps: T[];
  selections: Selection<ScrapperBuilderNodeSelection>[];
}

export const scrapperStepsToNodes = <T extends ScrapperBuilderStep>({
  steps,
  selections,
  startNodePosition,
}: ScrapperStepsToNodesParams<T>) => {
  const stepsWithTypes = steps.map((step) => ({
    ...step,
    type: scrapperActionNodeTypeMap[step.action] ?? FlowBuilderNodeTypes.Action,
    ...Duration.fromDurationRecordsToInput({
      waitDuration: step.waitDuration,
      waitIntervalTimeout: step.waitIntervalTimeout,
      waitIntervalCheck: step.waitIntervalCheck,
    }),
  }));

  return flowBuilderUtils.recreateNodes({
    findSelectionForItem: (item) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      selections.find((selection) => selection.value.action === item.action)!,
    items: stepsWithTypes,
    selections,
    startNodeNoContent: false,
    startNodePosition,
  });
};
