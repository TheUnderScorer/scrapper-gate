import { Form } from 'react-final-form';
import React from 'react';
import { act, render, RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HtmlElementPicker } from './HtmlElementPicker';
import {
  HtmlElementPickerProps,
  HtmlElementPickerValidationRules,
} from './HtmlElementPicker.types';
import { first, prefix, wait } from '@scrapper-gate/shared/common';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';

const getCmp = (props: Partial<HtmlElementPickerProps>) => (
  <Form
    onSubmit={jest.fn()}
    render={() => (
      <ThemeProvider>
        <HtmlElementPicker
          className="test"
          label="Html Picker"
          name="test"
          {...props}
        />
      </ThemeProvider>
    )}
  />
);

const renderCmp = (props: Partial<HtmlElementPickerProps> = {}) =>
  render(getCmp(props));

const addSelector = async (value: string, cmp: RenderResult) => {
  const input = cmp.container.querySelector<HTMLInputElement>(
    '.html-element-picker-input input'
  );
  const addBtn = cmp.container.querySelector('.add-selector');

  await act(async () => {
    await userEvent.type(input, value);
  });

  act(() => {
    userEvent.click(addBtn);
  });
};

const selectElement = (
  component: RenderResult,
  targetElement: HTMLDivElement
) => {
  const togglePicker = component.container.querySelector('.toggle-picker');

  act(() => {
    userEvent.click(togglePicker);
  });

  act(() => {
    userEvent.hover(targetElement);
    userEvent.click(targetElement);
  });
};

describe('<HtmlElementPicker />', () => {
  it('should fill input with selector of picked element', async () => {
    const component = renderCmp();
    const togglePicker = component.container.querySelector('.toggle-picker');

    const targetElement = document.createElement('div');
    targetElement.classList.add('test-element');

    component.baseElement.appendChild(targetElement);

    act(() => {
      userEvent.click(togglePicker);
    });

    act(() => {
      userEvent.hover(targetElement);
    });

    const hoverBox = component.baseElement.querySelector(
      `.${prefix('hover-box')}`
    );
    expect(hoverBox).not.toBeNull();

    act(() => {
      userEvent.dblClick(targetElement);
    });

    const listItem = await component.findAllByText('.test-element (1)');
    expect(listItem).not.toBeNull();

    await waitFor(() => {
      expect(targetElement).toHaveClass(prefix('highlight'));
    });
  });

  it('should validate if element exists in DOM', async () => {
    const component = renderCmp({
      validationRules: [HtmlElementPickerValidationRules.ElementsExist],
    });
    await addSelector('#test', component);

    await waitFor(
      () =>
        expect(component.container).toHaveTextContent(
          /No elements found matching given selector/
        ),
      {
        interval: 500,
        timeout: 5000,
      }
    );
  });

  it('should check if selector is valid', async () => {
    const component = renderCmp({
      validationRules: [HtmlElementPickerValidationRules.ValidSelector],
    });

    await act(async () => {
      await addSelector('!#.', component);
    });

    await waitFor(
      () =>
        expect(component.container).toHaveTextContent(
          /Invalid selector provided/
        ),
      {
        interval: 500,
        timeout: 3000,
      }
    );
  });

  it('should ignore elements inside "ignoredElementsContainer"', () => {
    const container = document.createElement('div');

    const component = renderCmp({ ignoredElementsContainer: container });
    component.baseElement.appendChild(container);

    const togglePicker = component.container.querySelector('.toggle-picker');

    const targetElement = document.createElement('div');
    targetElement.classList.add('test-element');

    container.appendChild(targetElement);

    act(() => {
      userEvent.click(togglePicker);
    });

    act(() => {
      userEvent.click(targetElement);
    });

    const listItems = component.container.querySelectorAll(
      '.selector-list-item'
    );
    expect(listItems).toHaveLength(0);
  });

  it('should support clicking multiple elements if it is enabled', async () => {
    const component = renderCmp();

    const targetElement1 = document.createElement('div');
    const targetElement2 = document.createElement('div');

    targetElement1.id = 'test-element';
    targetElement2.id = 'element-test';

    component.baseElement.appendChild(targetElement1);
    component.baseElement.appendChild(targetElement2);

    component.rerender(
      getCmp({
        container: component.container,
        ignoredElementsContainer: component.container,
      })
    );

    const togglePicker = component.container.querySelector('.toggle-picker');

    await act(async () => {
      userEvent.click(togglePicker);

      await wait(500);
    });

    act(() => {
      userEvent.hover(targetElement1);
    });

    act(() => {
      userEvent.dblClick(targetElement1);
    });

    act(() => {
      userEvent.hover(targetElement2);
    });

    act(() => {
      userEvent.dblClick(targetElement2);
    });

    const list = component.container.querySelector('.selectors-list');
    expect(list).toHaveTextContent('#test-element');
    expect(list).toHaveTextContent('#element-test');
  });

  it('should prevent clicking elements if toggle for that is enabled', async () => {
    const handleClick = jest.fn();

    const component = renderCmp();

    const targetElement = document.createElement('div');
    targetElement.classList.add('test-element');
    targetElement.addEventListener('click', handleClick);

    component.baseElement.appendChild(targetElement);

    component.rerender(
      getCmp({
        container: component.baseElement,
      })
    );

    const togglePicker = component.container.querySelector('.toggle-picker');

    act(() => {
      userEvent.click(togglePicker);
    });

    act(() => {
      userEvent.hover(targetElement);
    });

    const switchEl = component.baseElement.querySelector(
      '.enable-click-control'
    );

    act(() => {
      userEvent.click(targetElement);
    });

    let event: MouseEvent = handleClick.mock.calls[0][0];
    expect(event.defaultPrevented).toBeTruthy();

    act(() => {
      userEvent.click(switchEl);
    });

    act(() => {
      userEvent.click(targetElement);
    });

    // eslint-disable-next-line prefer-destructuring
    event = handleClick.mock.calls[1][0];
    expect(event.defaultPrevented).toBeFalsy();
  });

  it('should display dropdown on selected element and support selecting from it', async () => {
    const component = renderCmp();

    const targetElement = document.createElement('div');
    targetElement.id = 'test_element123';

    component.rerender(
      getCmp({
        container: component.baseElement,
      })
    );

    component.baseElement.appendChild(targetElement);

    selectElement(component, targetElement);

    let dropdown = component.baseElement.querySelector('.element-dropdown');

    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveTextContent('div#test_element123');

    const select = dropdown.querySelector('.select-element');

    act(() => {
      userEvent.click(select);
    });

    await wait(500);

    dropdown = component.baseElement.querySelector('.element-dropdown');

    expect(dropdown).not.toBeInTheDocument();

    expect(
      first(component.getAllByText('#test_element123 (1)'))
    ).toBeInTheDocument();
  });

  it('should deselect element on outside click', async () => {
    const component = renderCmp();

    const outsideElement = document.createElement('div');

    const targetElement = document.createElement('div');
    targetElement.id = 'test_element';

    component.rerender(
      getCmp({
        container: component.baseElement,
      })
    );

    component.baseElement.appendChild(targetElement);
    document.body.appendChild(outsideElement);

    selectElement(component, targetElement);

    let dropdown = component.baseElement.querySelector('.element-dropdown');

    expect(dropdown).toBeInTheDocument();

    act(() => {
      userEvent.click(outsideElement);
    });

    await wait(500);

    dropdown = component.baseElement.querySelector('.element-dropdown');

    expect(dropdown).not.toBeInTheDocument();
  });
});
