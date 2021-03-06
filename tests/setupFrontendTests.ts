import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { cleanup as cleanupHooks } from '@testing-library/react-hooks';
import 'mockzilla-webextension';
import '../libs/frontend/block-editor/src/typings/slate/index.d';

(global as any).ResizeObserver =
  (global as any).ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

afterEach(() => {
  cleanup();
  cleanupHooks();
});
