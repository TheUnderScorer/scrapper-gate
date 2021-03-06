module.exports = {
  displayName: 'backend-domain-scrapper',
  preset: '../../../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  testPathIgnorePatterns: ['playwright-runner'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/libs/backend/domain/scrapper',
  setupFilesAfterEnv: [`${process.cwd()}/tests/setupBackend.ts`],
  testEnvironment: 'node',
};
