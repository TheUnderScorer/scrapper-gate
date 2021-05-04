module.exports = {
  displayName: 'frontend-domain-scrapper',
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/libs/frontend/domain/scrapper',
  setupFilesAfterEnv: [`${process.cwd()}/tests/setupFrontendTests.ts`],
};
