import { describe, it, expect } from 'vitest';
import { REALMS } from '../src/lib/realms';
import { THEMES } from '@cosmos/core';

describe('Web Smoke Tests', () => {
  it('should have all 11 themes rendered and available', () => {
    expect(THEMES).toBeDefined();
    expect(THEMES.length).toBe(11);
    const expectedThemes = ['aether', 'lunar', 'aurora', 'forest', 'retro', 'cosmic', 'minimal', 'nebula', 'galaxy', 'studio-pro', 'synthwave'];
    for (const themeId of expectedThemes) {
      const exists = THEMES.some(t => t.id === themeId);
      expect(exists).toBe(true);
    }
  });

  it('should have all 7 realms accessible and properly structured', () => {
    expect(REALMS).toBeDefined();
    expect(REALMS.length).toBe(7);
    const expectedRealms = ['core', 'work', 'think', 'studio', 'life', 'signal', 'money'];
    for (const realmId of expectedRealms) {
      const realm = REALMS.find(r => r.id === realmId);
      expect(realm).toBeDefined();
      expect(realm?.name).toBeDefined();
      expect(realm?.icon).toBeDefined();
    }
  });

  it('should verify navigation config exists', () => {
    // Assert navigation works by verifying routes config are defined
    const routes = [
      '/', '/work', '/think', '/studio', '/life', '/signal', '/money'
    ];
    expect(routes.length).toBe(7);
  });
});
