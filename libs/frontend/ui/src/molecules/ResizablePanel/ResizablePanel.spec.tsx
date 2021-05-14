import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResizablePanel } from './ResizablePanel';

describe('<ResizablePanel />', () => {
  it('should render without crashing', () => {
    const cmp = render(
      <ResizablePanel minWidth="100px" maxWidth="500px" initialWidth="300px">
        Panel contents
      </ResizablePanel>
    );

    expect(cmp).toMatchSnapshot();
  });

  it('should toggle contents when open/closed', async () => {
    const cmp = render(
      <ResizablePanel initialWidth="300px">Panel contents</ResizablePanel>
    );

    const btn = cmp.container.querySelector('.toggle-panel');

    act(() => {
      userEvent.click(btn);
    });

    const content = cmp.container.querySelector('.resizable-panel-content');
    expect(content.textContent).toEqual('');

    act(() => {
      userEvent.click(btn);
    });

    expect(content.textContent).toEqual('Panel contents');
  });
});
