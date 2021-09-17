import fs from 'fs';
import path from 'path';
import pPipe from 'p-pipe';
import { fileURLToPath } from 'url';

const dirName = path.dirname(fileURLToPath(import.meta.url));

const tsConfigPath = path.resolve(dirName, '../tsconfig.base.json');
const tsConfigCopyName = path.resolve(dirName, '../tsconfig.copy.json');

const createCopy = () => fs.copyFileSync(tsConfigPath, tsConfigCopyName);
const readTsConfig = () => JSON.parse(fs.readFileSync(tsConfigPath).toString());

function removeExtensions(tsConfig) {
  const mappedCompilerPaths = Object.entries(
    tsConfig.compilerOptions.paths
  ).map(([alias, paths]) => {
    const mappedPaths = paths.map((tsPath) => {
      const ext = path.extname(tsPath);

      return tsPath.replace(ext, '');
    });

    return [alias, mappedPaths];
  });

  tsConfig.compilerOptions.paths = Object.fromEntries(mappedCompilerPaths);

  return tsConfig;
}

const writeTsConfig = (tsConfig) =>
  fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, ' '));

export function restoreTsConfig() {
  fs.unlinkSync(tsConfigPath);
  fs.copyFileSync(tsConfigCopyName, tsConfigPath);
  fs.unlinkSync(tsConfigCopyName);
}

export async function removeFileExtensionFromTsPaths() {
  await pPipe(createCopy, readTsConfig, removeExtensions, writeTsConfig)();
}
