import depCheck from 'depcheck';
import path from 'path';
import fs from 'fs';
import childProcess from 'child_process';
import pipe from 'p-pipe';
import { logger } from '@nrwl/devkit';
import { removeFileExtensionFromTsPaths, restoreTsConfig } from '../../tools/removeFileExtensionFromTsPaths.mjs';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

async function init() {
  await removeFileExtensionFromTsPaths();

  const pkg = JSON.parse(
    fs.readFileSync(path.resolve(dirname, '../../package.json')).toString()
  );

  return {
    ...pkg,
  };
}

function setupPackage(newPkg) {
  delete newPkg.devDependencies;
  delete newPkg.scripts;
  delete newPkg.release;

  newPkg.name = `${newPkg.name}-api`;

  return newPkg;
}

async function setupDependencies(newPkg) {
  const depCheckResult = await depCheck(path.resolve(dirname, '../../'), {
    detectors: [
      // the target detectors
      depCheck.detector.requireCallExpression,
      depCheck.detector.importDeclaration,
    ],
    skipMissing: true,
    ignorePatterns: [
      'libs/frontend/*',
      'jest.*',
      'package.*',
      '.eslint*',
      'serverless*',
      'tests*',
      'webpack*',
      'apps/browser-extension*',
      'apps/lambdas*',
    ],
  });

  newPkg.dependencies = Object.fromEntries(
    Object.entries(newPkg.dependencies).filter(([dependency]) => {
      return Boolean(depCheckResult.using[dependency]);
    })
  );

  return newPkg;
}

async function build(newPkg) {
  logger.info('Building api...');

  const {
    compilerOptions: { outDir },
  } = JSON.parse(
    fs.readFileSync(path.resolve(dirname, './tsconfig.app.json')).toString()
  );

  try {
    const tsConfigPath = path.resolve(dirname, './tsconfig.app.json');

    childProcess.execSync(`npx ttsc -p ${tsConfigPath}`, {
      stdio: 'inherit',
    });
  } catch {
    logger.error('Api build failed :(');

    process.exit(1);
  }

  logger.log('Api built!');

  const newPkgPath = path.resolve(dirname, path.join(outDir, 'package.json'));

  fs.writeFileSync(newPkgPath, JSON.stringify(newPkg, null, ' '));

  return newPkg;
}

try {
  await pipe(init, setupPackage, setupDependencies, build)();
} finally {
  restoreTsConfig();
}
