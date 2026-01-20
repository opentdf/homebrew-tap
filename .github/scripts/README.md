# Formula Update Scripts

TypeScript implementation for automated Homebrew formula updates.

## Current Scope

These scripts are currently **specific to otdfctl**. When adding support for platform or other formulae, duplicate and modify as needed. Future refactoring to a config-based approach will happen once we have 2+ working examples.

## Architecture

```
.github/scripts/
├── update-otdfctl.ts              # otdfctl formula updater
├── types.ts                       # TypeScript interfaces
├── lib/
│   ├── checksum-fetcher.ts        # Checksum download & parsing (otdfctl-specific)
│   ├── formula-generator.ts       # Ruby formula generation (otdfctl-specific)
│   └── github-api.ts              # GitHub API interactions (otdfctl-specific)
└── dist/                          # Compiled JavaScript (gitignored)
```

## Development

### Setup

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test

# Watch mode for development
npm run test:watch

# Type checking
npm run typecheck

# Coverage report
npm run test:coverage
```

### Testing

All modules have comprehensive unit tests with >80% coverage:

```bash
# Run all tests
npm test

# Run specific test file
npm test checksum-fetcher.test.ts

# Watch mode
npm run test:watch
```

### Local Testing

To test the script locally before pushing:

```bash
# Build TypeScript
npm run build

# Set up environment variables
export INPUT_VERSION="0.29.0"  # Optional: test specific version
export GITHUB_TOKEN="your_token"

# Run the script (requires GITHUB_TOKEN with appropriate permissions)
node -e "
  const { updateOtdfctl } = require('./.github/scripts/dist/update-otdfctl.js');
  const github = require('@actions/github');
  const core = require('@actions/core');
  const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
  const context = github.context;
  updateOtdfctl({ github: octokit, context, core });
"
```

## Workflow Integration

The GitHub Actions workflow:
1. Checks out the repository
2. Sets up Node.js with npm caching
3. Installs dependencies (`npm ci`)
4. Builds TypeScript (`npm run build`)
5. Runs the compiled script via `actions/github-script@v7`

## Key Features

### Type Safety
- Full TypeScript with strict mode
- Compile-time error detection
- IntelliSense support

### Testability
- Jest unit tests for all modules
- Mock GitHub API calls
- Coverage tracking (>80% threshold)

### Modularity
- Separate concerns (checksums, formula, GitHub API)
- Reusable functions
- Clear interfaces

### Error Handling
- Proper try/catch blocks
- Meaningful error messages
- Graceful failures

## Module Documentation

### update-otdfctl.ts
Main orchestration logic for otdfctl formula:
- Fetches latest otdfctl release from GitHub
- Compares with current formula version
- Downloads and parses checksums
- Generates new formula content
- Creates pull request

### lib/checksum-fetcher.ts
Handles checksum operations:
- `fetchChecksums()` - Downloads checksum file from GitHub release
- `parseChecksums()` - Parses checksum file content
- `extractChecksum()` - Extracts platform-specific checksums

### lib/formula-generator.ts
Ruby formula generation:
- `generateFormula()` - Creates complete Ruby formula
- `extractCurrentVersion()` - Parses version from existing formula

### lib/github-api.ts
GitHub API interactions:
- `getLatestRelease()` - Fetches latest release info
- `getCurrentFormulaVersion()` - Reads current formula version
- `checkUpdateNeeded()` - Compares versions
- `updateFormulaFile()` - Updates formula via GitHub API
- `createPullRequest()` - Creates PR for updates

## Adding New Functionality

1. **Add new module:**
   ```typescript
   // .github/scripts/lib/new-feature.ts
   export function newFunction(): string {
     return 'result';
   }
   ```

2. **Add tests:**
   ```typescript
   // .github/scripts/lib/new-feature.test.ts
   import { newFunction } from './new-feature';

   describe('newFunction', () => {
     it('should work', () => {
       expect(newFunction()).toBe('result');
     });
   });
   ```

3. **Import in main:**
   ```typescript
   // .github/scripts/update-otdfctl.ts
   import { newFunction } from './lib/new-feature';
   ```

4. **Build and test:**
   ```bash
   npm run build
   npm test
   ```

## Troubleshooting

### Build Errors
```bash
# Clean and rebuild
rm -rf .github/scripts/dist
npm run build
```

### Test Failures
```bash
# Run with verbose output
npm test -- --verbose

# Run specific test
npm test -- checksum-fetcher.test.ts
```

### Type Errors
```bash
# Check types without building
npm run typecheck
```

## CI/CD

The workflow automatically:
- Installs dependencies
- Builds TypeScript
- Runs the update script
- Creates PR if update needed

No manual intervention required!
