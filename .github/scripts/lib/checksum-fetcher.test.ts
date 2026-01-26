import { parseChecksums, extractChecksum } from './checksum-fetcher';

describe('checksum-fetcher', () => {
  const mockChecksumContent = `fc90fedb9dd4f643b7e48083ee5e35fc4633da21ca8d096f95b150105dfed103  otdfctl-0.28.0-darwin-arm64.tar.gz
97861084b3c6dc6a9796b4c725f3a66cbc38ef7642029bde702ff0300d3c0f54  otdfctl-0.28.0-darwin-amd64.tar.gz
0c6fc0a6c944c267730e3eca720e40bfdad77fb1de18bf11eaaed5a90ea547ef  otdfctl-0.28.0-linux-amd64.tar.gz
f8511e08814f89b2794cde848d52d633cb982a8108be1baedb31dcb6e91c72c0  otdfctl-0.28.0-linux-arm.tar.gz
6e00ed2b9e842f7ead28526b1053ac6c6a64a46e4ebfdf6807d97bace272edd7  otdfctl-0.28.0-linux-arm64.tar.gz`;

  describe('parseChecksums', () => {
    it('should parse all platform checksums correctly', () => {
      const result = parseChecksums(mockChecksumContent);

      expect(result).toEqual({
        darwinArm64: 'fc90fedb9dd4f643b7e48083ee5e35fc4633da21ca8d096f95b150105dfed103',
        darwinAmd64: '97861084b3c6dc6a9796b4c725f3a66cbc38ef7642029bde702ff0300d3c0f54',
        linuxAmd64: '0c6fc0a6c944c267730e3eca720e40bfdad77fb1de18bf11eaaed5a90ea547ef',
        linuxArm: 'f8511e08814f89b2794cde848d52d633cb982a8108be1baedb31dcb6e91c72c0',
        linuxArm64: '6e00ed2b9e842f7ead28526b1053ac6c6a64a46e4ebfdf6807d97bace272edd7'
      });
    });

    it('should handle content with extra whitespace', () => {
      const contentWithWhitespace = `
        ${mockChecksumContent}

      `;

      const result = parseChecksums(contentWithWhitespace);
      expect(result.darwinArm64).toBe('fc90fedb9dd4f643b7e48083ee5e35fc4633da21ca8d096f95b150105dfed103');
    });

    it('should throw if checksum is missing', () => {
      const incompleteContent = 'fc90fedb9dd4f643b7e48083ee5e35fc4633da21ca8d096f95b150105dfed103  otdfctl-0.28.0-darwin-arm64.tar.gz';

      expect(() => parseChecksums(incompleteContent)).toThrow('Checksum not found');
    });
  });

  describe('extractChecksum', () => {
    const lines = mockChecksumContent.split('\n');

    it('should extract checksum for darwin-amd64', () => {
      const checksum = extractChecksum(lines, 'darwin-amd64.tar.gz');
      expect(checksum).toBe('97861084b3c6dc6a9796b4c725f3a66cbc38ef7642029bde702ff0300d3c0f54');
    });

    it('should extract checksum for linux-arm (excluding arm64)', () => {
      const checksum = extractChecksum(lines, 'linux-arm.tar.gz', true);
      expect(checksum).toBe('f8511e08814f89b2794cde848d52d633cb982a8108be1baedb31dcb6e91c72c0');
    });

    it('should throw if pattern not found', () => {
      expect(() => extractChecksum(lines, 'nonexistent.tar.gz')).toThrow('Checksum not found');
    });

    it('should validate checksum format (64 hex chars)', () => {
      const invalidLines = ['invalid_checksum  otdfctl-0.28.0-darwin-arm64.tar.gz'];
      expect(() => extractChecksum(invalidLines, 'darwin-arm64.tar.gz')).toThrow('Invalid checksum format');
    });
  });
});
