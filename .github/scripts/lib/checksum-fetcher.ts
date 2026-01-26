import { Checksums } from '../types';

/**
 * Fetches and parses checksums from a GitHub release
 * @param version - Version number (e.g., "0.28.0")
 * @param tag - Git tag (e.g., "v0.28.0")
 * @returns Parsed checksums for all platforms
 */
export async function fetchChecksums(version: string, tag: string): Promise<Checksums> {
  const url = `https://github.com/opentdf/otdfctl/releases/download/${tag}/otdfctl-${version}_checksums.txt`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch checksums: ${response.statusText}`);
  }

  const text = await response.text();
  return parseChecksums(text);
}

/**
 * Parses checksum file content
 * @param content - Raw checksum file content
 * @returns Parsed checksums for all platforms
 */
export function parseChecksums(content: string): Checksums {
  const lines = content.split('\n').filter(line => line.trim());

  return {
    darwinAmd64: extractChecksum(lines, 'darwin-amd64.tar.gz'),
    darwinArm64: extractChecksum(lines, 'darwin-arm64.tar.gz'),
    linuxAmd64: extractChecksum(lines, 'linux-amd64.tar.gz'),
    linuxArm: extractChecksum(lines, 'linux-arm.tar.gz', true),
    linuxArm64: extractChecksum(lines, 'linux-arm64.tar.gz')
  };
}

/**
 * Extracts a checksum for a specific platform
 * @param lines - Lines from checksum file
 * @param pattern - Platform pattern to match
 * @param excludeArm64 - Whether to exclude arm64 from results (for arm32)
 * @returns Extracted checksum
 */
export function extractChecksum(lines: string[], pattern: string, excludeArm64 = false): string {
  const line = lines.find(l => {
    const includes = l.includes(pattern);
    if (!includes) return false;
    if (excludeArm64 && l.includes('arm64')) return false;
    return true;
  });

  if (!line) {
    throw new Error(`Checksum not found for pattern: ${pattern}`);
  }

  const checksum = line.trim().split(/\s+/)[0];
  if (!checksum || !/^[a-f0-9]{64}$/i.test(checksum)) {
    throw new Error(`Invalid checksum format for ${pattern}: ${checksum}`);
  }

  return checksum;
}
