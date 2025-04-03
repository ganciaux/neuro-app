export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/unit/**/*.spec.ts',
    '**/integration/**/*.spec.ts',
    '**/e2e/**/*.spec.ts',
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.ts'],
  verbose: true,
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'Jest Test Report',
        outputPath: '<rootDir>/src/tests/reports/all.html',
      },
    ],
  ],
  setupFilesAfterEnv: [
    '<rootDir>/src/tests/unit/setup.ts',
    '<rootDir>/src/tests/e2e/setup.ts',
  ],
  globalSetup: '<rootDir>/src/tests/global-setup.ts',
};
