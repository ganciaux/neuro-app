export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    testMatch: ['**/*.spec.ts'],
    reporters: [
      "default",
      [ "jest-html-reporter", {
        pageTitle: "Jest Test Report",
        outputPath: "src/tests/test-report.html"
      }]
    ],
    testPathIgnorePatterns: [
      '/node_modules/', 
      '/users.routes.spec.ts',
      //'auth.routes.spec.ts'
    ],
  };