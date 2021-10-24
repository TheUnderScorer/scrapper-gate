import { configureToMatchImageSnapshot } from 'jest-image-snapshot';
import path from 'path';
import { getArtifactDirectoryPath } from '../utils/artifacts';

export const registerToMatchImageSnapshot = () => {
  expect.extend({
    toMatchImageSnapshot: configureToMatchImageSnapshot({
      dumpDiffToConsole: true,
      allowSizeMismatch: true,
      failureThreshold: 0.1,
      failureThresholdType: 'percent',
      customDiffDir: path.join(
        getArtifactDirectoryPath(),
        'image-snapshot-diffs'
      ),
    }),
  });
};
