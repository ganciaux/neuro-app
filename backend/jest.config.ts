import type { Config } from '@jest/types';

const baseConfig: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.ts'],
};

const unitConfig: Config.InitialOptions = {
  ...baseConfig,
  displayName: 'unit',
  setupFilesAfterEnv: ['<rootDir>/src/tests/unit/setup.ts'],
  testMatch: ['<rootDir>/src/**/unit/**/*.spec.ts']
};

const integrationConfig: Config.InitialOptions = {
  ...baseConfig,
  displayName: 'integration',
  setupFilesAfterEnv: ['<rootDir>/src/tests/integration/setup.ts'],
  testMatch: ['<rootDir>/src/**/integration/**/*.spec.ts'],
};

const e2eConfig: Config.InitialOptions = {
  ...baseConfig,
  displayName: 'e2e',
  globalSetup: '<rootDir>/src/tests/global-setup.ts',
  setupFilesAfterEnv: ['<rootDir>/src/tests/e2e/setup.ts'],
  testMatch: ['<rootDir>/src/**/e2e/**/*.spec.ts'],
};

const getReportPath = (name: string) => `src/tests/reports/test-${name}-report.html`;

export default {
  projects: [unitConfig, integrationConfig, e2eConfig],
  verbose: true,
  reporters: [
    "default",
    ["<rootDir>/node_modules/jest-html-reporter", { 
      outputPath: getReportPath(process.env.TEST_TYPE || "default"), 
      pageTitle: "Jest Test Report" }
    ]
  ]
};