module.exports = {
  displayName: 'frontend-form',
  preset: '../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/frontend/form',
  setupFilesAfterEnv: [`${process.cwd()}/tests/setupFrontendTests.ts`],
};
