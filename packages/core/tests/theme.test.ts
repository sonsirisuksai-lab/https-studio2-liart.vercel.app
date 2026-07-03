import { describe, it, expect } from 'vitest';
import { THEMES, DEFAULT_THEME } from '../src/lib/themes';

describe('Theme Engine', () => {
  it('should have 11 themes available', () => {
    expect(THEMES.length).toBe(11);
  });

  it('should have a valid default theme', () => {
    expect(DEFAULT_THEME).toBe('aether');
    const defaultThemeExists = THEMES.some(t => t.id === DEFAULT_THEME);
    expect(defaultThemeExists).toBe(true);
  });

  it('should have unique ids for all themes', () => {
    const ids = THEMES.map(t => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(THEMES.length);
  });
});
