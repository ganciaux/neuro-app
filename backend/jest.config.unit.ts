export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
    testMatch: ['**/*.unit.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  reporters: [
    "default",
    [
      'jest-html-reporter',
      {
        pageTitle: 'Jest Test Report',
        outputPath: '<rootDir>/src/tests/test-report-unit.html'
      }
    ]
  ],
};
