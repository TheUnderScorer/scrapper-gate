import fs from 'fs';
import pPipe from 'p-pipe';
import path from 'path';
import { TsConfigJson } from 'type-fest';

const tsConfigPath = path.resolve(__dirname, '../tsconfig.base.json');
const tsConfigCopyName = path.resolve(__dirname, '../tsconfig.copy.json');

const createCopy = () => fs.copyFileSync(tsConfigPath, tsConfigCopyName);
const readTsConfig = () => JSON.parse(fs.readFileSync(tsConfigPath).toString());

let configChanged = false;

function removeExtensions(tsConfig: TsConfigJson) {
  const mappedCompilerPaths = Object.entries(
    tsConfig?.compilerOptions?.paths ?? {}
  ).map(([alias, paths]) => {
    const mappedPaths = paths.map((tsPath) => {
      const ext = path.extname(tsPath);

      return tsPath.replace(ext, '');
    });

    return [alias, mappedPaths];
  });

  tsConfig.compilerOptions!.paths = Object.fromEntries(mappedCompilerPaths);

  return tsConfig;
}

const writeTsConfig = (tsConfig: TsConfigJson) =>
  fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, ' '));

export async function restoreTsConfig() {
  if (!configChanged) {
    return;
  }

  fs.unlinkSync(tsConfigPath);
  fs.copyFileSync(tsConfigCopyName, tsConfigPath);
  fs.unlinkSync(tsConfigCopyName);
}

export async function removeFileExtensionFromTsPaths() {
  await pPipe(createCopy, readTsConfig, removeExtensions, writeTsConfig)();

  configChanged = true;
}
