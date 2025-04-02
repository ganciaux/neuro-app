export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.spec.ts'], // ou ["**/*.test.ts"] selon vos fichiers
    moduleFileExtensions: ['ts', 'js', 'json'],
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    collectCoverageFrom: ['src/**/*.ts'], // Si vous voulez la couverture de test
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
  };