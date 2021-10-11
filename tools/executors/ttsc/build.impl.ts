import { logger } from '@nrwl/devkit';
import depCheck from 'depcheck';
import fs from 'fs';
import pipe from 'p-pipe';
import path from 'path';
import { PackageJson } from 'type-fest';
import { $ } from 'zx';
import {
  removeFileExtensionFromTsPaths,
  restoreTsConfig,
} from '../../removeFileExtensionFromTsPaths';

interface Options {
  targetDirectory: string;
  depCheckIgnorePatterns?: string[];
  tsConfigPath?: string;
  packageJsonFile?: string;
}

type ResolvedOptions = Required<Options>;

export default async function build(options: Options) {
  logger.info('Starting ttsc build...');

  const resolvedOptions = resolveOptions(options);

  async function init() {
    await removeFileExtensionFromTsPaths();

    const pkg: PackageJson = JSON.parse(
      fs.readFileSync(resolvedOptions.packageJsonFile).toString()
    );

    return {
      ...pkg,
    };
  }

  function setupPackage(newPkg: PackageJson & { release?: string }) {
    delete newPkg.devDependencies;
    delete newPkg.scripts;
    delete newPkg.release;

    newPkg.name = `${newPkg.name}-api`;

    return newPkg;
  }

  async function setupDependencies(newPkg: PackageJson) {
    const depCheckResult = await depCheck(process.cwd(), {
      detectors: [
        // the target detectors
        depCheck.detector.requireCallExpression,
        depCheck.detector.importDeclaration,
      ],
      skipMissing: true,
      ignoreDirs: options.depCheckIgnorePatterns,
    });

    newPkg.dependencies = Object.fromEntries(
      Object.entries(newPkg.dependencies ?? {}).filter(([dependency]) => {
        return Boolean(depCheckResult.using[dependency]);
      })
    );

    return newPkg;
  }

  async function build(newPkg: PackageJson) {
    logger.info('Building api...');

    const {
      compilerOptions: { outDir },
    } = JSON.parse(
      fs.readFileSync(path.resolve(resolvedOptions.tsConfigPath)).toString()
    );

    try {
      const tsConfigPath = path.resolve(resolvedOptions.tsConfigPath);

      await $`npx ttsc -p ${tsConfigPath}`;
    } catch {
      logger.error('Build failed :(');

      return false;
    }

    logger.log('Api built!');

    const newPkgPath = path.resolve(
      resolvedOptions.targetDirectory,
      outDir,
      'package.json'
    );

    fs.writeFileSync(newPkgPath, JSON.stringify(newPkg, null, ' '));

    logger.log('Created package.json file.');

    return true;
  }

  let success = false;

  try {
    success = await pipe(init, setupPackage, setupDependencies, build)();
  } finally {
    logger.log('Cleaning up...');
    await restoreTsConfig();
  }

  return {
    success,
  };
}

const resolveOptions = (options: Options): ResolvedOptions => ({
  ...options,
  depCheckIgnorePatterns: options.depCheckIgnorePatterns ?? [],
  packageJsonFile:
    options.packageJsonFile ?? path.resolve(process.cwd(), 'package.json'),
  tsConfigPath:
    options.tsConfigPath ??
    path.resolve(options.targetDirectory, 'tsconfig.json'),
});
