import fs from 'fs';
import path from 'path';

const getArtifactPath = (cwd: string) => path.join(cwd, 'artifacts');

export async function persistTestArtifact(name: string, data: Buffer) {
  const cwd = process.cwd();
  const artifactPath = getArtifactPath(cwd);
  const filePath = path.join(artifactPath, name);

  console.log(`Resolved artifact path: ${artifactPath}`);

  if (!fs.existsSync(artifactPath)) {
    console.log('Creating artifact directory...');
    fs.mkdirSync(artifactPath);
  }

  console.log(`Saving artifact: ${filePath}`);

  fs.writeFileSync(filePath, data);
}
