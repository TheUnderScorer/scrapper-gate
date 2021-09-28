/* eslint-disable @typescript-eslint/no-non-null-assertion */
import '@scrapper-gate/frontend/theme';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResizablePanel } from './ResizablePanel';

describe('<ResizablePanel />', () => {
  it('should render without crashing', () => {
    const cmp = render(
      <ThemeProvider>
        <ResizablePanel minWidth="100px" maxWidth="500px" initialWidth="300px">
          Panel contents
        </ResizablePanel>
      </ThemeProvider>
    );

    expect(cmp).toMatchSnapshot();
  });

  it('should toggle contents when open/closed', async () => {
    const cmp = render(
      <ThemeProvider>
        <ResizablePanel initialWidth="300px">Panel contents</ResizablePanel>
      </ThemeProvider>
    );

    const btn = cmp.container.querySelector('.toggle-panel');

    act(() => {
      userEvent.click(btn!);
    });

    const content = cmp.container.querySelector('.resizable-panel-content');

    await waitFor(() => expect(content!.textContent).toEqual(''));

    act(() => {
      userEvent.click(btn!);
    });

    expect(content!.textContent).toEqual('Panel contents');
  });
});
