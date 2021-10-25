import '../typings/global/index';
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { cleanup as cleanupHooks } from '@testing-library/react-hooks';
import 'mockzilla-webextension';
import '../libs/frontend/block-editor/src/typings/slate/index.d';
import { mockBrowserStorage } from './mocks/mockBrowserStorage';

const { store, setupMocks } = mockBrowserStorage();

global.browserExtensionStores = {
  local: store,
};

(global as any).ResizeObserver =
  (global as any).ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

beforeEach(() => {
  setupMocks();
});

afterEach(() => {
  cleanup();
  cleanupHooks();

  store.clear();
});
