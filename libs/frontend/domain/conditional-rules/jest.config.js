/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  displayName: 'frontend-domain-conditional-rules',
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  setupFilesAfterEnv: [`${process.cwd()}/tests/setupFrontendTests.ts`],
  coverageDirectory:
    '../../../../coverage/libs/frontend/domain/conditional-rules',
};
