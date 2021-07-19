/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import { wait } from '@scrapper-gate/shared/common';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { DialogController } from '../DialogController';
import { useConfirmationDialog } from '../dialogs/useConfirmationDialog';

describe('useConfirmationDialog', () => {
  it('should handle confirm action', async () => {
    const hook = renderHook(
      () =>
        useConfirmationDialog({
          title: 'Test',
          message: 'Test',
        }),
      {
        wrapper: ({ children }) => (
          <ThemeProvider>
            <DialogController>{children}</DialogController>
          </ThemeProvider>
        ),
      }
    );

    const promise = hook.result.current();

    await wait(500);

    const confirm = document.querySelector('#confirm');

    act(() => {
      userEvent.click(confirm!);
    });

    const result = await promise;

    expect(result).toEqual(true);
  });
});
