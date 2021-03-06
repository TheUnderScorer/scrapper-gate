module.exports = {
  displayName: 'lambdas',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/lambdas',
  setupFilesAfterEnv: [`${process.cwd()}/tests/setupBackend.ts`],
  testTimeout: 99999,
};
