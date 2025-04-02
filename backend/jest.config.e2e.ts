export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/*.e2e.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  reporters: [
    "default",
    [
      'jest-html-reporter',
      {
        pageTitle: 'Jest Test Report',
        outputPath: '<rootDir>/src/tests/reports/e2e.html'
      }
    ]
  ],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts']
};
