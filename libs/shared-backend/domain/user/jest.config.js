const dotenv = require('dotenv');

dotenv.config({
  path: `${process.cwd()}/.local.env`,
});

module.exports = {
  displayName: 'shared-backend-domain-user',
  preset: '../../../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/libs/shared-backend/domain/user',
  setupFilesAfterEnv: [`${process.cwd()}/tests/setupBackend.ts`],
};
