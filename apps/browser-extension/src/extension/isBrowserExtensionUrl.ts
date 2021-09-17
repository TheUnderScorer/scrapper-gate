const options = ['chrome://', 'chrome-extension://'];

export const isBrowserExtensionUrl = (url: string) =>
  options.some((option) => url.includes(option));
