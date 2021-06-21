module.exports = {
  displayName: 'backend-unit-of-work',
  preset: '../../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/backend/unit-of-work',
  setupFilesAfterEnv: [`${process.cwd()}/tests/setupBackend.ts`],
};
