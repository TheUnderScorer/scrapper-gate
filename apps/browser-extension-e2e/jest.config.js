module.exports = {
  displayName: 'browser-extension-e2e',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/apps/browser-extension-e2e',
  setupFilesAfterEnv: ['./src/setup.ts'],
  testTimeout: 9999999,
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
};
