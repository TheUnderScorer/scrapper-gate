import {
  BaseNodeProperties,
  FlowBuilderItem,
} from '../../../libs/frontend/flow-builder/src/FlowBuilder.types';

export const getItems = <T extends BaseNodeProperties>(
  container?: HTMLElement
) => {
  const element = (container ?? document).querySelector('.flow-builder-canvas');

  if (!element?.getAttribute('data-items')) {
    return [];
  }

  return JSON.parse(
    element.getAttribute('data-items')!
  ) as FlowBuilderItem<T>[];
};
