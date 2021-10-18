module.exports = {
  displayName: 'frontend-domain-variables',
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/libs/frontend/domain/variables',
  setupFilesAfterEnv: [`${process.cwd()}/tests/setupFrontendTests.ts`],
};
