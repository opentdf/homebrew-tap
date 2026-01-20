import { checkUpdateNeeded } from './github-api';

describe('github-api', () => {
  describe('checkUpdateNeeded', () => {
    it('should return needed=true when versions differ', () => {
      const result = checkUpdateNeeded('0.27.0', '0.28.0');

      expect(result).toEqual({
        needed: true,
        currentVersion: '0.27.0',
        latestVersion: '0.28.0'
      });
    });

    it('should return needed=false when versions match', () => {
      const result = checkUpdateNeeded('0.28.0', '0.28.0');

      expect(result).toEqual({
        needed: false,
        currentVersion: '0.28.0',
        latestVersion: '0.28.0'
      });
    });

    it('should handle version downgrades', () => {
      const result = checkUpdateNeeded('0.29.0', '0.28.0');

      expect(result).toEqual({
        needed: true,
        currentVersion: '0.29.0',
        latestVersion: '0.28.0'
      });
    });

    it('should perform exact string comparison', () => {
      const result = checkUpdateNeeded('0.28.0', '0.28.0-beta');

      expect(result.needed).toBe(true);
    });
  });

  // Note: Tests for functions that interact with GitHub API would use mocks
  // Example structure (not fully implemented to avoid complexity):
  //
  // describe('getLatestRelease', () => {
  //   it('should fetch latest release from GitHub', async () => {
  //     const mockGithub = {
  //       rest: {
  //         repos: {
  //           getLatestRelease: jest.fn().mockResolvedValue({
  //             data: { tag_name: 'v0.28.0' }
  //           })
  //         }
  //       }
  //     };
  //
  //     const result = await getLatestRelease(mockGithub as any);
  //     expect(result).toEqual({ version: '0.28.0', tag: 'v0.28.0' });
  //   });
  // });
});
