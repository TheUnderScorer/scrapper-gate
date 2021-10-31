import {
  FlowBuilderItem,
  flowBuilderUtils,
} from '@scrapper-gate/frontend/flow-builder';
import { Node } from 'react-flow-renderer';
import { ScrapperBuilderNodeProperties } from '../ScrapperBuilder.types';

export function canUseUrlFromPrevStep(
  node: Node<ScrapperBuilderNodeProperties>,
  nodes: FlowBuilderItem<ScrapperBuilderNodeProperties>[],
  initialUrl?: string
) {
  let canUse = Boolean(initialUrl);

  if (canUse) {
    return canUse;
  }

  flowBuilderUtils.travelNodes({
    direction: 'in',
    node,
    items: nodes,
    callback: (node) => {
      if (node.data?.url) {
        canUse = true;
      }

      return canUse;
    },
  });

  return canUse;
}
