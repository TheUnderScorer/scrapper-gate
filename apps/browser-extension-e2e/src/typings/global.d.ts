import { BrowserContext } from 'playwright';

declare global {
  namespace NodeJS {
    interface Global {
      browser: BrowserContext;
    }
  }
}
