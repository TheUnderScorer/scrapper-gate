import { logger } from '@nrwl/devkit';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { equals } from 'remeda';
import yargs from 'yargs';
import { $ } from 'zx';

interface DepsData {
  packageLockMd5: string;
}

const image = 'ghcr.io/theunderscorer/scrapper-gate-base';

const args = yargs(process.argv)
  .option('createDockerBuilder', {
    type: 'boolean',
    default: false,
    alias: 'create-docker-builder',
  })
  .option('rebuildCacheOnly', {
    type: 'boolean',
    default: false,
    alias: 'rebuild-cache-only',
  })
  .option('branch', {
    type: 'string',
  }).argv;

const depsDataPath = path.resolve(__dirname, '.baseImageDepsData.json');

const readDepsData = (): DepsData | null => {
  if (!fs.existsSync(depsDataPath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(depsDataPath).toString());
};

const getGitBranch = () =>
  $`git rev-parse --abbrev-ref HEAD`.then((result) => result.toString().trim());

const createNewDepsData = (): DepsData => {
  const pkgLock = fs
    .readFileSync(path.resolve(__dirname, '../../package-lock.json'))
    .toString();

  return {
    packageLockMd5: crypto
      .createHash('md5')
      .update(pkgLock)
      .digest('hex')
      .toString(),
  };
};

const hasDepsChanged = () => {
  const currentCache = readDepsData();
  const newCacheData = createNewDepsData();

  return {
    depsChanged: !equals(currentCache, newCacheData),
    newCacheData,
  };
};

const writeNewDepsData = async (data: DepsData) => {
  fs.writeFileSync(depsDataPath, JSON.stringify(data));

  await $`git commit -m 'Update base image deps data' -- ${depsDataPath}`;
  await $`git push`;
};

const imageExists = async (image: string) => {
  try {
    const response =
      await $`docker manifest inspect ${image} > /dev/null ; echo $?`;

    return response.toString() === '0';
  } catch {
    return false;
  }
};

const main = async (): Promise<void> => {
  const branch = args.branch ?? (await getGitBranch());
  const imageTag = branch === 'master' ? 'latest' : branch.replace(/\//g, '-');

  const { depsChanged, newCacheData } = hasDepsChanged();
  const imgExists = await imageExists(`${image}:${imageTag}`);

  logger.info(`Current git branch: ${branch}`);

  if (args.rebuildCacheOnly) {
    logger.info('Rebuilding dependencies file...');

    return writeNewDepsData(newCacheData);
  }

  if (depsChanged || !imgExists) {
    if (depsChanged) {
      logger.info('Dependencies changed, rebuilding base image...');
    } else if (!imgExists) {
      logger.info(`Creating base image for current branch.`);
    }

    if (args.createDockerBuilder) {
      await $`docker buildx create --name mybuilder`;
      await $`docker buildx use mybuilder`;
    }

    await $`docker buildx build -f ./docker/base/Dockerfile -t ${image}:${imageTag} --platform linux/amd64,linux/arm64/v8 --push .`;

    await writeNewDepsData(newCacheData);
  }
};

main().catch((error) => {
  console.error(error);

  process.exit(1);
});
