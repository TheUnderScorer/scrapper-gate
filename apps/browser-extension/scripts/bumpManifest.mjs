import { $ } from 'zx';
import fs from 'fs';
import yargs from 'yargs';
import path from 'path';

const dirname = import.meta.url.replace(/^file:\/\//, '').replace(/\/[^\/]+$/, '');

const args = yargs(process.argv)
  .option('commitToGit', {
    type: 'boolean',
    default: false,
    alias: 'c'
  })
  .option('dryRun', {
    type: 'boolean',
    default: false
  })
  .option('newVersion', {
    type: 'string',
    required: true,
    alias: 'nv'
  }).parse();

if (args.dryRun) {
  console.log('Dry run set, skipping manifest version bump.');
} else {
  const manifestPath = path.resolve(dirname, '../manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath).toString());

  manifest.version = args.newVersion;

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`Updated manifest to version ${args.newVersion}`);

  if (args.commitToGit) {
    await $`git add ${manifestPath}`;
    await $`git commit --amend --no-edit`;
  }
}

