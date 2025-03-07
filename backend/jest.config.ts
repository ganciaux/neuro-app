export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    testMatch: ['**/*.spec.ts'],
  };