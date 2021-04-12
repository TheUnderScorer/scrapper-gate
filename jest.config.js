module.exports = {
  projects: [
    '<rootDir>/apps/browser-extension',
    '<rootDir>/apps/api',
    '<rootDir>/libs/shared/routing',
    '<rootDir>/libs/shared/common',
    '<rootDir>/libs/shared/logger',
    '<rootDir>/libs/shared/schema',
    '<rootDir>/libs/shared/validation',
    '<rootDir>/libs/shared/domain/auth',
    '<rootDir>/libs/shared-backend/awilix',
    '<rootDir>/libs/shared-backend/server',
    '<rootDir>/libs/shared-backend/unit-of-work',
    '<rootDir>/libs/shared-backend/cqrs',
    '<rootDir>/libs/shared-backend/database',
    '<rootDir>/libs/shared-frontend/common',
    '<rootDir>/libs/shared-frontend/domain/auth',
    '<rootDir>/libs/shared-backend/domain/auth',
    '<rootDir>/libs/shared/errors',
    '<rootDir>/libs/shared-backend/domain/user',
    '<rootDir>/libs/shared-backend/base-model',
    '<rootDir>/libs/shared/domain/user',
    '<rootDir>/libs/shared-frontend/api-client',
    '<rootDir>/libs/shared-frontend/ui',
    '<rootDir>/libs/shared-frontend/dialogs',
  ],
  setupFilesAfterEnv: [`${__dirname}/tests/setupBackend.ts`],
};
