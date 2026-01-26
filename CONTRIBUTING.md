# Contributing to OpenTDF Homebrew Tap

Thank you for contributing to the OpenTDF Homebrew Tap! This guide will help you get started.

## How to Contribute

### Reporting Issues

If you encounter problems:

1. Check [existing issues](https://github.com/opentdf/homebrew-tap/issues)
2. Open a new issue with:
   - Clear description of the problem
   - Your OS and architecture (`uname -a`)
   - Homebrew version (`brew --version`)
   - Steps to reproduce
   - Expected vs actual behavior

### Suggesting New Formulae

To suggest adding a new OpenTDF tool:

1. Open an issue titled "Add formula: [tool-name]"
2. Provide:
   - GitHub repository URL
   - Description of the tool
   - Latest release version
   - Supported platforms

### Submitting Changes

#### Prerequisites

- Fork the repository
- Clone your fork locally
- Ensure Homebrew is installed
- Read our [Testing Guide](TESTING.md)

#### Development Workflow

1. **Create a branch:**
   ```bash
   git checkout -b feature/add-new-formula
   # or
   git checkout -b fix/otdfctl-version
   ```

2. **Make your changes:**
   - Add/modify formula in `Formula/` directory
   - Update `README.md` if adding new formula
   - Add auto-update workflow if applicable

3. **Test locally:**
   ```bash
   # Syntax check
   ruby -c Formula/your-formula.rb

   # Local installation test
   brew tap opentdf/tap file://$(pwd)
   brew install opentdf/tap/your-formula
   brew test your-formula

   # Audit
   brew audit opentdf/tap/your-formula

   # Clean up
   brew uninstall your-formula
   brew untap opentdf/tap
   ```

4. **Commit changes:**
   ```bash
   git add .
   git commit -m "type: description"
   ```

   Commit types:
   - `feat:` New formula or major enhancement
   - `fix:` Bug fix or correction
   - `chore:` Maintenance, updates, automation
   - `docs:` Documentation only
   - `test:` Testing improvements

5. **Push and create PR:**
   ```bash
   git push origin your-branch-name
   ```

   Then open a Pull Request on GitHub.

#### Pull Request Guidelines

Your PR should:

- **Have a clear title:** `feat: add formula for platform service` or `fix: update otdfctl to v0.29.0`
- **Include description:**
  - What changes were made
  - Why the changes are needed
  - Testing performed
  - Related issues (if any)
- **Pass all checks:**
  - Syntax validation
  - Formula audit
  - Test installation
- **Update documentation:** README.md, TESTING.md if needed

#### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New formula
- [ ] Formula update
- [ ] Bug fix
- [ ] Documentation
- [ ] Automation/workflow

## Testing Performed
- [ ] Syntax check passed
- [ ] Local installation successful
- [ ] Formula test passed
- [ ] Audit passed
- [ ] Tested on: [OS/Architecture]

## Checklist
- [ ] Formula follows [Homebrew style guide](https://docs.brew.sh/Formula-Cookbook)
- [ ] All platforms/architectures tested (or N/A documented)
- [ ] README updated
- [ ] Auto-update workflow added/updated (if applicable)
- [ ] Version and checksums verified

## Related Issues
Closes #[issue number]
```

### Adding a New Formula

Follow this process to add a new OpenTDF tool:

1. **Research the tool:**
   ```bash
   # Check latest release
   curl -s https://api.github.com/repos/opentdf/[tool]/releases/latest | jq -r '.tag_name'

   # Download checksums
   VERSION="X.Y.Z"
   curl -sL "https://github.com/opentdf/[tool]/releases/download/v${VERSION}/[tool]-${VERSION}_checksums.txt"
   ```

2. **Create formula file:**
   - Use `Formula/otdfctl.rb` as a template
   - Update all fields appropriately
   - Verify all platform/architecture combinations
   - Update SHA256 checksums

3. **Create auto-update workflow:**
   - Copy `.github/workflows/auto-update-otdfctl.yml`
   - Rename to `auto-update-[tool].yml`
   - Update all references to tool name

4. **Update documentation:**
   - Add section to README.md
   - Include usage examples
   - Document any special requirements

5. **Test thoroughly:**
   - Follow [TESTING.md](TESTING.md) guide
   - Test on multiple platforms if possible
   - Verify auto-update workflow syntax

6. **Submit PR:**
   - Create PR with comprehensive description
   - Link to tool's repository and release
   - Include test results

### Updating Existing Formulae

#### Automated Updates

Most updates happen automatically via GitHub Actions:

1. Workflow detects new release
2. Downloads checksums
3. Updates formula
4. Creates PR automatically

**Your role:**
- Review auto-generated PR
- Test the update
- Approve and merge

#### Manual Updates

If auto-update fails or isn't set up:

1. **Get new version info:**
   ```bash
   VERSION="X.Y.Z"
   curl -sL "https://github.com/opentdf/[tool]/releases/download/v${VERSION}/[tool]-${VERSION}_checksums.txt"
   ```

2. **Update formula:**
   - Change `version` field
   - Update all `url` fields
   - Update all `sha256` fields

3. **Test locally:**
   ```bash
   ruby -c Formula/[tool].rb
   brew tap opentdf/tap file://$(pwd)
   brew upgrade opentdf/tap/[tool]
   brew test [tool]
   ```

4. **Submit PR:**
   ```
   chore: update [tool] to vX.Y.Z

   - Updated version from A.B.C to X.Y.Z
   - Updated checksums for all platforms
   - Tested on [your platform]

   Release notes: [link]
   ```

## Code Style

### Formula Style

Follow [Homebrew Ruby Style Guide](https://docs.brew.sh/Ruby-Style-Guide):

- Use 2-space indentation
- Use double quotes for strings
- Keep lines under 80 characters when possible
- Order blocks: macos → linux
- Order architectures: arm → intel

### Example:

```ruby
class ToolName < Formula
  desc "Short description"
  homepage "https://github.com/opentdf/tool"
  version "1.0.0"
  license "BSD-3-Clause-Clear"

  on_macos do
    if Hardware::CPU.arm?
      url "https://..."
      sha256 "..."
    else
      url "https://..."
      sha256 "..."
    end
  end

  on_linux do
    # ...
  end

  def install
    bin.install "binary-name"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/binary-name version")
  end
end
```

### Workflow Style

For GitHub Actions workflows:

- Use descriptive job/step names
- Include comments for complex logic
- Use proper YAML indentation (2 spaces)
- Pin action versions (`@v4`, not `@latest`)
- Set appropriate permissions

## Review Process

### What Reviewers Look For

1. **Correctness:**
   - Formula syntax valid
   - Checksums match release
   - Version numbers correct
   - URLs accessible

2. **Completeness:**
   - All platforms covered
   - Test block present
   - Metadata complete
   - Documentation updated

3. **Style:**
   - Follows Homebrew conventions
   - Consistent formatting
   - Clear commit messages

4. **Testing:**
   - Evidence of local testing
   - Audit passed
   - Installation successful

### Response Time

- Initial review: Within 3-7 days
- Follow-up reviews: Within 2-3 days
- Auto-update PRs: Within 1-2 days (priority)

## Getting Help

### Resources

- [Homebrew Documentation](https://docs.brew.sh/)
- [Formula Cookbook](https://docs.brew.sh/Formula-Cookbook)
- [Acceptable Formulae](https://docs.brew.sh/Acceptable-Formulae)
- [Ruby Style Guide](https://docs.brew.sh/Ruby-Style-Guide)

### Support Channels

- **Issues:** Use GitHub Issues for bugs, questions, or suggestions
- **Discussions:** GitHub Discussions for general questions
- **OpenTDF Community:** Join OpenTDF community channels for broader discussions

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (BSD-3-Clause-Clear).

## Recognition

Contributors will be recognized in:
- Git commit history
- Release notes for significant contributions
- README acknowledgments for major features

Thank you for helping improve the OpenTDF Homebrew Tap! 🎉
