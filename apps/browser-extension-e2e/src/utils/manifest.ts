import * as fs from 'fs';
import path from 'path';
import { Manifest } from 'webextension-polyfill';

let manifset: BrowserExtensionManifest;

interface BrowserExtensionManifest extends Manifest.WebExtensionManifest {
  action: {
    default_popup: string;
  };
}

export const readManifest = async () => {
  if (manifset) {
    return manifset;
  }

  const manifestPath = path.resolve(
    __dirname,
    '../../../../dist/apps/browser-extension/manifest.json'
  );

  if (!fs.existsSync(manifestPath)) {
    throw new Error('Manifest not found, perhaps extension is not built?');
  }

  manifset = JSON.parse(
    fs.readFileSync(manifestPath).toString()
  ) as BrowserExtensionManifest;

  return manifset;
};
