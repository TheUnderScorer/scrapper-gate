import {
  BaseNodeProperties,
  FlowBuilderItem,
} from '@scrapper-gate/frontend/ui';

export const getItems = <T extends BaseNodeProperties>(
  container?: HTMLElement
) => {
  const element = (container ?? document).querySelector('.flow-builder-canvas');

  return JSON.parse(element.getAttribute('data-items')) as FlowBuilderItem<T>[];
};
