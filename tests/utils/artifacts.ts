import fs, { createWriteStream } from 'fs';
import path from 'path';

export const getArtifactDirectoryPath = (cwd = process.cwd()) =>
  path.join(cwd, 'artifacts');

function getArtifactPaths(name: string) {
  const artifactPath = getArtifactDirectoryPath();
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
