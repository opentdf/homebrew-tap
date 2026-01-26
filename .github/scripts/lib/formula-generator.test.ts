import { generateFormula, extractCurrentVersion } from './formula-generator';
import { Checksums } from '../types';

describe('formula-generator', () => {
  const mockChecksums: Checksums = {
    darwinArm64: 'fc90fedb9dd4f643b7e48083ee5e35fc4633da21ca8d096f95b150105dfed103',
    darwinAmd64: '97861084b3c6dc6a9796b4c725f3a66cbc38ef7642029bde702ff0300d3c0f54',
    linuxAmd64: '0c6fc0a6c944c267730e3eca720e40bfdad77fb1de18bf11eaaed5a90ea547ef',
    linuxArm: 'f8511e08814f89b2794cde848d52d633cb982a8108be1baedb31dcb6e91c72c0',
    linuxArm64: '6e00ed2b9e842f7ead28526b1053ac6c6a64a46e4ebfdf6807d97bace272edd7'
  };

  describe('generateFormula', () => {
    it('should generate valid Ruby formula with correct version', () => {
      const formula = generateFormula('0.28.0', 'v0.28.0', mockChecksums);

      expect(formula).toContain('class Otdfctl < Formula');
      expect(formula).toContain('version "0.28.0"');
      expect(formula).toContain('license "BSD-3-Clause-Clear"');
    });

    it('should include all platform URLs', () => {
      const formula = generateFormula('0.28.0', 'v0.28.0', mockChecksums);

      expect(formula).toContain('otdfctl-0.28.0-darwin-arm64.tar.gz');
      expect(formula).toContain('otdfctl-0.28.0-darwin-amd64.tar.gz');
      expect(formula).toContain('otdfctl-0.28.0-linux-amd64.tar.gz');
      expect(formula).toContain('otdfctl-0.28.0-linux-arm.tar.gz');
      expect(formula).toContain('otdfctl-0.28.0-linux-arm64.tar.gz');
    });

    it('should include all checksums', () => {
      const formula = generateFormula('0.28.0', 'v0.28.0', mockChecksums);

      expect(formula).toContain(mockChecksums.darwinArm64);
      expect(formula).toContain(mockChecksums.darwinAmd64);
      expect(formula).toContain(mockChecksums.linuxAmd64);
      expect(formula).toContain(mockChecksums.linuxArm);
      expect(formula).toContain(mockChecksums.linuxArm64);
    });

    it('should use correct tag in URLs', () => {
      const formula = generateFormula('1.0.0', 'v1.0.0', mockChecksums);

      expect(formula).toContain('releases/download/v1.0.0/');
      expect(formula).toContain('otdfctl-1.0.0-');
    });

    it('should include install and test methods', () => {
      const formula = generateFormula('0.28.0', 'v0.28.0', mockChecksums);

      expect(formula).toContain('def install');
      expect(formula).toContain('bin.install "target/otdfctl-#{version}-#{os}-#{arch}" => "otdfctl"');
      expect(formula).toContain('test do');
      expect(formula).toContain('assert_match version.to_s, shell_output("#{bin}/otdfctl --version")');
    });
  });

  describe('extractCurrentVersion', () => {
    it('should extract version from formula content', () => {
      const formulaContent = `class Otdfctl < Formula
  desc "CLI for managing the OpenTDF Platform"
  homepage "https://github.com/opentdf/otdfctl"
  version "0.28.0"
  license "BSD-3-Clause-Clear"`;

      const version = extractCurrentVersion(formulaContent);
      expect(version).toBe('0.28.0');
    });

    it('should handle different version formats', () => {
      const formulaContent = 'version "1.2.3"';
      const version = extractCurrentVersion(formulaContent);
      expect(version).toBe('1.2.3');
    });

    it('should throw if version not found', () => {
      const invalidContent = 'class Otdfctl < Formula\n  desc "Test"';
      expect(() => extractCurrentVersion(invalidContent)).toThrow('Could not extract version');
    });

    it('should extract first version if multiple present', () => {
      const multipleVersions = 'version "0.28.0"\nversion "0.27.0"';
      const version = extractCurrentVersion(multipleVersions);
      expect(version).toBe('0.28.0');
    });
  });
});
