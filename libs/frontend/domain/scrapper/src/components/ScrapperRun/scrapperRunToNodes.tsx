import { Selection } from '@scrapper-gate/frontend/common';
import { ScrapperBuilderNodeSelection } from '../../shared/scrapperNodeSelection';
import { scrapperStepsToNodes } from '../../shared/scrapperStepsToNodes';
import { ScrapperBuilderStep } from '../../shared/types';
import { ScrapperRunNodeAddonBefore } from './NodeAddonBefore/ScrapperRunNodeAddonBefore';
import { ScrapperRunFlowBuilder, ScrapperRunNode } from './ScrapperRun.types';

export const scrapperRunToNodes = (
  run: ScrapperRunFlowBuilder,
  selections: Selection<ScrapperBuilderNodeSelection>[]
) => {
  let steps = (run?.steps ?? []) as Array<
    ScrapperBuilderStep & Partial<ScrapperRunNode>
  >;

  if (run?.results) {
    steps = run.results.map((result) => ({
      ...result.step,
      runResult: result,
      nodeAddonBefore: (node: ScrapperRunNode) => (
        <ScrapperRunNodeAddonBefore node={node} />
      ),
    }));
  }

  return scrapperStepsToNodes({ steps: steps, selections: selections });
};
