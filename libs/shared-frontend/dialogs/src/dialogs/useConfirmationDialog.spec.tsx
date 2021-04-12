import { renderHook } from '@testing-library/react-hooks';
import {
  DialogController,
  useConfirmationDialog,
} from '@scrapper-gate/shared-frontend/dialogs';
import { ThemeProvider } from '@scrapper-gate/shared-frontend/theme';
import React from 'react';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('useConfirmationDialog', () => {
  it('should handle confirm action', async () => {
    const onConfirm = jest.fn();

    const hook = renderHook(
      () =>
        useConfirmationDialog({
          onConfirm,
        }),
      {
        wrapper: ({ children }) => (
          <ThemeProvider>
            {children} <DialogController />
          </ThemeProvider>
        ),
      }
    );

    hook.result.current();

    const confirm = document.querySelector('#confirm');

    act(() => {
      userEvent.click(confirm);
    });

    expect(onConfirm).toBeCalledTimes(1);
  });
});
