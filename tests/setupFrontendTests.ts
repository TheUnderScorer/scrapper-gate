import 'mockzilla-webextension';
import '@testing-library/jest-dom';

(global as any).ResizeObserver =
  (global as any).ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));
