import fs from 'fs';
import path from 'path';

const dirname = import.meta.url.replace(/^file:\/\//, '').replace(/\/[^\/]+$/, '');
const packageJson = JSON.parse(fs.readFileSync(path.join(dirname, '../package.json'), 'utf8'));

const manifestPaths = [
  path.resolve(dirname, '../manifest.json'),
  path.resolve(dirname, '../../../dist/apps/browser-extension/manifest.json')
];

manifestPaths.forEach(manifestPath => {
  if (!fs.existsSync(manifestPath)) {
    return;
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath).toString());

  manifest.version = packageJson.version;

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
});
