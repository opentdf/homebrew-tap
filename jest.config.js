/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['.github/scripts'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    '.github/scripts/lib/**/*.ts',
    '!.github/scripts/**/*.test.ts',
    '!.github/scripts/dist/**'
  ],
  coverageThreshold: {
    '.github/scripts/lib/formula-generator.ts': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    },
    '.github/scripts/lib/checksum-fetcher.ts': {
      branches: 80,
      functions: 80,
      lines: 70,
      statements: 70
    }
  },
  verbose: true
};
