module.exports = {
  displayName: 'frontend-ui',
  preset: '../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/frontend/ui',
  setupFilesAfterEnv: [`${process.cwd()}/tests/setupFrontendTests.ts`],
};
