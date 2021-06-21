module.exports = {
  displayName: 'api',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/api',
  setupFilesAfterEnv: [
    `${process.cwd()}/tests/setupBackend.ts`,
    `<rootDir>/src/tests/setupServer.ts`,
  ],
  testEnvironment: 'node',
  testTimeout: 99999,
};
