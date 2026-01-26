import { GitHub } from '@actions/github/lib/utils';
import { Context } from '@actions/github/lib/context';
import { VersionInfo, UpdateCheck } from '../types';
import { extractCurrentVersion } from './formula-generator';

/**
 * Gets the latest release information from GitHub
 * @param github - Octokit client
 * @param manualVersion - Optional manual version override
 * @returns Version information
 */
export async function getLatestRelease(
  github: InstanceType<typeof GitHub>,
  manualVersion?: string
): Promise<VersionInfo> {
  if (manualVersion) {
    return {
      version: manualVersion,
      tag: `v${manualVersion}`
    };
  }

  const { data: release } = await github.rest.repos.getLatestRelease({
    owner: 'opentdf',
    repo: 'otdfctl'
  });

  const tag = release.tag_name;
  const version = tag.replace(/^v/, '');

  return { version, tag };
}

/**
 * Gets the current version from the formula file
 * @param github - Octokit client
 * @param context - GitHub Actions context
 * @returns Current version string
 */
export async function getCurrentFormulaVersion(
  github: InstanceType<typeof GitHub>,
  context: Context
): Promise<string> {
  const { data } = await github.rest.repos.getContent({
    owner: context.repo.owner,
    repo: context.repo.repo,
    path: 'Formula/otdfctl.rb'
  });

  if (!('content' in data)) {
    throw new Error('Formula file not found or is a directory');
  }

  const content = Buffer.from(data.content, 'base64').toString('utf-8');
  return extractCurrentVersion(content);
}

/**
 * Checks if an update is needed
 * @param currentVersion - Current formula version
 * @param latestVersion - Latest available version
 * @returns Update check result
 */
export function checkUpdateNeeded(currentVersion: string, latestVersion: string): UpdateCheck {
  return {
    needed: currentVersion !== latestVersion,
    currentVersion,
    latestVersion
  };
}

/**
 * Updates the formula file via GitHub API
 * @param github - Octokit client
 * @param context - GitHub Actions context
 * @param formulaContent - New formula content
 */
export async function updateFormulaFile(
  github: InstanceType<typeof GitHub>,
  context: Context,
  formulaContent: string
): Promise<void> {
  const path = 'Formula/otdfctl.rb';

  // Get current file to get its SHA
  const { data: currentFile } = await github.rest.repos.getContent({
    owner: context.repo.owner,
    repo: context.repo.repo,
    path
  });

  if (!('sha' in currentFile)) {
    throw new Error('Formula file not found');
  }

  // Update the file
  await github.rest.repos.createOrUpdateFileContents({
    owner: context.repo.owner,
    repo: context.repo.repo,
    path,
    message: 'Update formula (automated)',
    content: Buffer.from(formulaContent).toString('base64'),
    sha: currentFile.sha
  });
}

/**
 * Creates a pull request for the update
 * @param github - Octokit client
 * @param context - GitHub Actions context
 * @param versionInfo - Version information
 * @param currentVersion - Current formula version
 * @param triggerSource - How the workflow was triggered
 */
export async function createPullRequest(
  github: InstanceType<typeof GitHub>,
  context: Context,
  versionInfo: VersionInfo,
  currentVersion: string,
  triggerSource: string
): Promise<void> {
  const branchName = `auto-update-otdfctl-${versionInfo.version}`;
  const title = `Update otdfctl to v${versionInfo.version}`;

  const body = `Auto-generated PR to update otdfctl formula to version ${versionInfo.version}.

**Trigger:** ${triggerSource}

**Changes:**
- Updated version from ${currentVersion} to ${versionInfo.version}
- Updated SHA256 checksums for all platforms

**Release Notes:** https://github.com/opentdf/otdfctl/releases/tag/${versionInfo.tag}

Please review and merge if tests pass.`;

  await github.rest.pulls.create({
    owner: context.repo.owner,
    repo: context.repo.repo,
    title,
    body,
    head: branchName,
    base: 'main'
  });
}
