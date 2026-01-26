/**
 * Platform-specific checksums for otdfctl release
 */
export interface Checksums {
  darwinAmd64: string;
  darwinArm64: string;
  linuxAmd64: string;
  linuxArm: string;
  linuxArm64: string;
}

/**
 * Version information for a release
 */
export interface VersionInfo {
  version: string;  // e.g., "0.28.0"
  tag: string;      // e.g., "v0.28.0"
}

/**
 * Update check result
 */
export interface UpdateCheck {
  needed: boolean;
  currentVersion: string;
  latestVersion: string;
}
