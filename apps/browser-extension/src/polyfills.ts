/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Polyfill stable language features. These imports will be optimized by `@babel/preset-env`.
 *
 * See: https://github.com/zloirock/core-js#babel
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'webextension-polyfill';
import { browser } from 'webextension-polyfill-ts';

(window as any).browser = browser;
(window as any).global = window;
