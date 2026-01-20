/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['.github/scripts'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    '.github/scripts/**/*.ts',
    '!.github/scripts/**/*.test.ts',
    '!.github/scripts/dist/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  verbose: true
};
