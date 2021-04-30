import { HtmlPicker } from './HtmlPicker';
import userEvent from '@testing-library/user-event';

describe('HTMLPicker', () => {
  let picker: HtmlPicker;

  afterEach(() => {
    if (picker) {
      picker.dispose();
    }
  });

  it('should display hover box on hovered elements', () => {
    const onHover = jest.fn();
    const onSelect = jest.fn();

    const targetElement = document.createElement('div');

    picker = new HtmlPicker({
      container: document.body,
      onElementHover: onHover,
      onElementSelect: onSelect,
    });

    document.body.appendChild(targetElement);

    userEvent.hover(targetElement);

    expect(picker.getCurrentTarget()).toEqual(targetElement);
    expect(onHover).toHaveBeenCalledWith(targetElement);
    expect(onHover).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledTimes(0);

    userEvent.click(targetElement);

    expect(picker.selectedElement).toEqual(targetElement);
    expect(onSelect).toHaveBeenCalledWith(targetElement);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onHover).toHaveBeenCalledTimes(2);
  });

  it('should deselect element on outside click', () => {
    const wrapper = document.createElement('div');

    const targetElement = document.createElement('span');

    document.body.appendChild(wrapper);
    wrapper.appendChild(targetElement);

    picker = new HtmlPicker({
      container: document.body,
    });

    userEvent.click(targetElement);

    expect(picker.selectedElement).toEqual(targetElement);

    userEvent.click(wrapper);

    expect(picker.selectedElement).toBeNull();
    expect(picker.getCurrentTarget()).toEqual(wrapper);
  });

  it('should not deselect element on outside click if it is ignored', () => {
    const ignoredElement = document.createElement('div');

    const targetElement = document.createElement('span');

    document.body.appendChild(targetElement);
    document.body.appendChild(ignoredElement);

    picker = new HtmlPicker({
      container: document.body,
      shouldHandleOutsideClick: (element) => element !== ignoredElement,
      preventClick: true,
    });

    userEvent.click(targetElement);

    expect(picker.selectedElement).toEqual(targetElement);

    userEvent.click(ignoredElement);

    expect(picker.selectedElement).not.toBeNull();
  });

  it('should not select elements in ignored container', () => {
    const wrapper = document.createElement('div');
    const targetElement = document.createElement('span');

    document.body.appendChild(wrapper);
    wrapper.appendChild(targetElement);

    picker = new HtmlPicker({
      container: document.body,
      ignoreElementsContainer: wrapper,
    });

    userEvent.hover(targetElement);

    expect(picker.getCurrentTarget()).toBeUndefined();
  });

  it('should not select ignored elements', () => {
    const targetElement = document.createElement('span');

    document.body.appendChild(targetElement);

    picker = new HtmlPicker({
      container: document.body,
      ignoreElements: [document.body, targetElement],
    });

    userEvent.hover(targetElement);

    expect(picker.getCurrentTarget()).toBeUndefined();
  });

  it('should only select elements that match given selector', () => {
    const targetElement = document.createElement('span');
    targetElement.classList.add('target');

    const otherElement = document.createElement('div');

    document.body.appendChild(targetElement);
    document.body.appendChild(otherElement);

    picker = new HtmlPicker({
      container: document.body,
      selectors: '.target',
    });

    userEvent.hover(otherElement);

    expect(picker.getCurrentTarget()).toBeUndefined();

    userEvent.hover(targetElement);

    expect(picker.getCurrentTarget()).toEqual(targetElement);
  });
});
