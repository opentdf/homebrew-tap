import { GitHub } from '@actions/github/lib/utils';
import { Context } from '@actions/github/lib/context';
import * as core from '@actions/core';
import {
  getLatestRelease,
  getCurrentFormulaVersion,
  checkUpdateNeeded,
  updateFormulaFile,
  createPullRequest
} from './lib/github-api';
import { fetchChecksums } from './lib/checksum-fetcher';
import { generateFormula } from './lib/formula-generator';

/**
 * Parameters passed from github-script action
 */
export interface UpdateOtdfctlParams {
  github: InstanceType<typeof GitHub>;
  context: Context;
  core: typeof core;
}

/**
 * Main entry point for the otdfctl formula update workflow
 * @param params - GitHub Actions context and utilities
 */
export async function updateOtdfctl({ github, context, core }: UpdateOtdfctlParams): Promise<void> {
  try {
    core.info('Starting otdfctl formula update check...');

    // Get manual version input if provided
    const manualVersion = process.env.INPUT_VERSION;

    // Get latest release information
    const versionInfo = await getLatestRelease(github, manualVersion);
    core.info(`Latest version: ${versionInfo.version} (${versionInfo.tag})`);

    // Get current formula version
    const currentVersion = await getCurrentFormulaVersion(github, context);
    core.info(`Current formula version: ${currentVersion}`);

    // Check if update is needed
    const updateCheck = checkUpdateNeeded(currentVersion, versionInfo.version);

    if (!updateCheck.needed) {
      core.info('✅ Formula is already up to date. No action needed.');
      return;
    }

    core.info(`🔄 Update needed: ${currentVersion} → ${versionInfo.version}`);

    // Fetch checksums for the new version
    core.info('Downloading checksums...');
    const checksums = await fetchChecksums(versionInfo.version, versionInfo.tag);
    core.info('✅ Checksums downloaded and parsed');

    // Generate new formula content
    core.info('Generating updated formula...');
    const formulaContent = generateFormula(versionInfo.version, versionInfo.tag, checksums);
    core.info('✅ Formula generated');

    // Update the formula file
    core.info('Updating formula file...');
    await updateFormulaFile(github, context, formulaContent);
    core.info('✅ Formula file updated');

    // Determine trigger source
    const triggerSource = context.eventName === 'workflow_dispatch'
      ? 'Manual trigger'
      : 'Scheduled daily check';

    // Create pull request
    core.info('Creating pull request...');
    await createPullRequest(github, context, versionInfo, currentVersion, triggerSource);
    core.info('✅ Pull request created successfully');

    core.info(`🎉 Successfully updated otdfctl from ${currentVersion} to ${versionInfo.version}`);

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    core.setFailed(`Formula update failed: ${message}`);
    throw error;
  }
}
