export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/*.integration.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  reporters: [
    "default",
    [
      'jest-html-reporter',
      {
        pageTitle: 'Jest Test Report',
        outputPath: '<rootDir>/src/tests/test-report-integration.html'
      }
    ]
  ],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts']
};
