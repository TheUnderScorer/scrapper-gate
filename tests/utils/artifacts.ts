import fs, { createWriteStream } from 'fs';
import path from 'path';

const getArtifactDirectoryPath = (cwd: string) => path.join(cwd, 'artifacts');

function getArtifactPaths(name: string) {
  const cwd = process.cwd();
  const artifactPath = getArtifactDirectoryPath(cwd);
  const filePath = path.join(artifactPath, name);

  console.log(`Resolved artifact path: ${artifactPath}`);

  if (!fs.existsSync(artifactPath)) {
    console.log('Creating artifact directory...');

    fs.mkdirSync(artifactPath);
  }

  return { artifactPath, filePath };
}

export async function persistTestArtifact(name: string, data: Buffer) {
  const { filePath } = getArtifactPaths(name);

  console.log(`Saving artifact: ${filePath}`);

  fs.writeFileSync(filePath, data);
}

export const createArtifactStream = (name: string) => {
  const { filePath } = getArtifactPaths(name);

  return createWriteStream(filePath);
};
