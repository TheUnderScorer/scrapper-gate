import { Perhaps } from '@scrapper-gate/shared/common';

export enum ElementNavigatorDirection {
  Children = 'Children',
  Parent = 'Parent',
  Left = 'Left',
  Right = 'Right',
}

export const navigateElement = (
  element: HTMLElement,
  direction: ElementNavigatorDirection
) => {
  switch (direction) {
    case ElementNavigatorDirection.Children:
      return element.children[0];

    case ElementNavigatorDirection.Parent:
      return element.parentElement;

    case ElementNavigatorDirection.Left:
      return element.previousElementSibling;

    case ElementNavigatorDirection.Right:
      return element.nextElementSibling;

    default:
      throw new TypeError('Invalid direction');
  }
};

export const canBeNavigated = (
  element?: Perhaps<HTMLElement>
): Record<ElementNavigatorDirection, boolean> => {
  return {
    Parent: Boolean(element?.parentNode),
    Children: Boolean(element?.children?.length),
    Left: Boolean(element?.previousElementSibling),
    Right: Boolean(element?.nextElementSibling),
  };
};
