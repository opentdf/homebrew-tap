# OpenTDF Homebrew Tap

Official Homebrew tap for OpenTDF project tools.

## Installation

### Prerequisites
- macOS or Linux
- [Homebrew](https://brew.sh/) installed

### Quick Start

```bash
# Add the tap
brew tap opentdf/tap

# Install otdfctl
brew install otdfctl

# Verify installation
otdfctl version
```

### One-liner Installation

```bash
brew install opentdf/tap/otdfctl
```

## Available Formulae

### otdfctl
CLI for managing the OpenTDF Platform - simplifies setup, facilitates migration, and aids in configuration management.

**Current Version:** 0.28.0
**Supported Platforms:** macOS (Intel/Apple Silicon), Linux (x86_64/ARM/ARM64)

```bash
brew install otdfctl
```

## Updating

Formulae in this tap are automatically updated when new releases are published.

```bash
# Update tap formulae
brew update

# Upgrade installed tools
brew upgrade otdfctl
```

## Development & Contributing

### Repository Structure

```
opentdf/homebrew-tap/
├── Formula/
│   └── otdfctl.rb                     # otdfctl CLI formula
├── .github/
│   ├── workflows/
│   │   └── auto-update-otdfctl.yml    # Event-driven auto-update workflow
│   └── scripts/                        # TypeScript automation
│       ├── update-otdfctl.ts          # Main orchestration
│       ├── types.ts                   # TypeScript interfaces
│       ├── lib/
│       │   ├── checksum-fetcher.ts    # Checksum handling
│       │   ├── formula-generator.ts   # Formula generation
│       │   └── github-api.ts          # GitHub API client
│       └── *.test.ts                  # Unit tests (>80% coverage)
├── package.json                        # Node.js dependencies
├── tsconfig.json                       # TypeScript configuration
├── jest.config.js                      # Test configuration
├── CONTRIBUTING.md                     # Contributor guide
├── TYPESCRIPT_MIGRATION.md             # Migration documentation
└── README.md                           # This file
```

### Testing Formula Locally

Before submitting changes, test the formula:

```bash
# Audit formula for issues
brew audit --strict --online Formula/otdfctl.rb

# Test installation from local tap
brew install --build-from-source opentdf/tap/otdfctl

# Run formula tests
brew test otdfctl

# Uninstall after testing
brew uninstall otdfctl
```

### Testing Automation Scripts

The update automation is built with TypeScript for testability and maintainability:

```bash
# Install Node.js dependencies
npm install

# Run all tests with coverage
npm test

# Watch mode for development
npm run test:watch

# Type checking
npm run typecheck

# Build TypeScript to JavaScript
npm run build
```

**Test Coverage:** The automation scripts maintain >80% test coverage across all modules.

**Key Features:**
- **Fully testable** - Jest unit tests with mocks
- **Type safe** - TypeScript with strict mode
- **Fast local dev** - Run tests instantly without CI
- **Better error handling** - Proper try/catch with typed errors
- **Modular design** - Reusable functions for checksums, formula generation, GitHub API

For detailed documentation on the automation scripts, see [`.github/scripts/README.md`](.github/scripts/README.md).

### Manual Formula Updates

If you need to manually update a formula:

1. **Get the latest release info:**
   ```bash
   curl -s https://api.github.com/repos/opentdf/otdfctl/releases/latest | jq -r '.tag_name'
   ```

2. **Download and verify checksums:**
   ```bash
   VERSION="0.28.0"
   curl -sL "https://github.com/opentdf/otdfctl/releases/download/v${VERSION}/otdfctl-${VERSION}_checksums.txt"
   ```

3. **Update `Formula/otdfctl.rb`:**
   - Update `version` field
   - Update all `url` fields with new version
   - Update all `sha256` fields with checksums from step 2

4. **Test the updated formula:**
   ```bash
   brew audit --strict --online Formula/otdfctl.rb
   brew install --build-from-source opentdf/tap/otdfctl
   brew test otdfctl
   ```

### Automated Updates

This tap uses event-driven automation to stay up to date:

#### Event-Driven Updates
When otdfctl publishes a new release, it sends a `repository_dispatch` event to this tap, triggering an immediate update.

#### Daily Safety Net
A scheduled check runs daily at 2 AM UTC as a fallback to catch any missed releases.

#### Manual Trigger
You can also trigger updates manually:
1. Go to Actions tab in GitHub
2. Select "Auto-update otdfctl formula"
3. Click "Run workflow"
4. Optionally specify a specific version

**Workflow:** `.github/workflows/auto-update-otdfctl.yml`

**Implementation:** TypeScript automation with full test coverage
- Type-safe GitHub API integration via `actions/github-script`
- Modular design with separate modules for checksums, formula generation, and API calls
- >80% unit test coverage with Jest
- Fast local development and testing

**What gets updated:**
- Formula version number
- Download URLs for all platforms (macOS, Linux, ARM variants)
- SHA256 checksums (verified against release)

## Troubleshooting

### Installation Issues

**Problem:** `Error: No available formula with the name "opentdf/tap/otdfctl"`

**Solution:**
```bash
brew update
brew tap opentdf/tap
brew install otdfctl
```

**Problem:** SHA256 mismatch

**Solution:** The formula may be out of sync. Please open an issue or wait for the auto-update workflow to run.

**Problem:** Permission denied

**Solution:**
```bash
# Fix Homebrew permissions
sudo chown -R $(whoami) $(brew --prefix)/*
```

### Getting Help

- **Issues:** [GitHub Issues](https://github.com/opentdf/homebrew-tap/issues)
- **otdfctl Documentation:** [opentdf/otdfctl](https://github.com/opentdf/otdfctl)
- **Homebrew Documentation:** [docs.brew.sh](https://docs.brew.sh/)

## License

This tap follows the same license as the OpenTDF project: BSD-3-Clause-Clear

## Maintainers

- OpenTDF Team (@opentdf)

## Related Projects

- [otdfctl](https://github.com/opentdf/otdfctl) - OpenTDF Platform CLI
- [platform](https://github.com/opentdf/platform) - OpenTDF Platform
