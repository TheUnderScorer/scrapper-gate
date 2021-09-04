module.exports = {
  displayName: 'frontend-flow-builder',
  preset: '../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/frontend/flow-builder',
  setupFilesAfterEnv: [`${process.cwd()}/tests/setupFrontendTests.ts`],
};
