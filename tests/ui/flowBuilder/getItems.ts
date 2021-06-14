import {
  BaseNodeProperties,
  FlowBuilderItem,
} from '../../../libs/frontend/ui/src/organisms/FlowBuilder/FlowBuilder.types';

export const getItems = <T extends BaseNodeProperties>(
  container?: HTMLElement
) => {
  const element = (container ?? document).querySelector('.flow-builder-canvas');

  return JSON.parse(element.getAttribute('data-items')) as FlowBuilderItem<T>[];
};
