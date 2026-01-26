import { Checksums } from '../types';

/**
 * Generates the complete Ruby formula content
 * @param version - Version number (e.g., "0.28.0")
 * @param tag - Git tag (e.g., "v0.28.0")
 * @param checksums - Platform-specific checksums
 * @returns Complete Ruby formula as string
 */
export function generateFormula(version: string, tag: string, checksums: Checksums): string {
  return `class Otdfctl < Formula
  desc "CLI for managing the OpenTDF Platform"
  homepage "https://github.com/opentdf/otdfctl"
  version "${version}"
  license "BSD-3-Clause-Clear"

  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/opentdf/otdfctl/releases/download/${tag}/otdfctl-${version}-darwin-arm64.tar.gz"
      sha256 "${checksums.darwinArm64}"
    else
      url "https://github.com/opentdf/otdfctl/releases/download/${tag}/otdfctl-${version}-darwin-amd64.tar.gz"
      sha256 "${checksums.darwinAmd64}"
    end
  end

  on_linux do
    if Hardware::CPU.arm?
      if Hardware::CPU.is_64_bit?
        url "https://github.com/opentdf/otdfctl/releases/download/${tag}/otdfctl-${version}-linux-arm64.tar.gz"
        sha256 "${checksums.linuxArm64}"
      else
        url "https://github.com/opentdf/otdfctl/releases/download/${tag}/otdfctl-${version}-linux-arm.tar.gz"
        sha256 "${checksums.linuxArm}"
      end
    else
      url "https://github.com/opentdf/otdfctl/releases/download/${tag}/otdfctl-${version}-linux-amd64.tar.gz"
      sha256 "${checksums.linuxAmd64}"
    end
  end

  def install
    # Determine platform suffix matching release naming
    os = OS.mac? ? "darwin" : "linux"
    arch = if Hardware::CPU.arm?
      Hardware::CPU.is_64_bit? ? "arm64" : "arm"
    else
      "amd64"
    end

    # Binary is inside target/ directory within the tarball
    bin.install "target/otdfctl-#{version}-#{os}-#{arch}" => "otdfctl"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/otdfctl --version")
  end
end
`;
}

/**
 * Extracts current version from formula content
 * @param formulaContent - Raw formula file content
 * @returns Current version string
 */
export function extractCurrentVersion(formulaContent: string): string {
  const match = formulaContent.match(/version\s+"([^"]+)"/);
  if (!match) {
    throw new Error('Could not extract version from formula');
  }
  return match[1];
}
