import {
  MakeswiftSiteVersion,
  createDefaultSiteVersionManager
} from '../site-version';

describe('Site Version', () => {
  describe('MakeswiftSiteVersion enum', () => {
    it('should have Live and Working values', () => {
      expect(MakeswiftSiteVersion.Live).toBe('LIVE');
      expect(MakeswiftSiteVersion.Working).toBe('WORKING');
    });
  });
  
  describe('createDefaultSiteVersionManager', () => {
    it('should create a site version manager with default implementations', () => {
      const manager = createDefaultSiteVersionManager();
      
      // Check methods exist
      expect(typeof manager.getSiteVersion).toBe('function');
      expect(typeof manager.enablePreviewMode).toBe('function');
      expect(typeof manager.disablePreviewMode).toBe('function');
      
      // Check default behavior
      expect(manager.getSiteVersion({})).toBe(MakeswiftSiteVersion.Live);
      
      // These should not throw
      expect(() => manager.enablePreviewMode({})).not.toThrow();
      expect(() => manager.disablePreviewMode({})).not.toThrow();
    });
  });
});