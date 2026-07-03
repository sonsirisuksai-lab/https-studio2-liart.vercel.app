import { describe, it, expect } from 'vitest';
import { DEFAULT_LAYOUTS } from '../../web/src/lib/layout-engine';

describe('Layout Engine', () => {
  it('should have 4 default layouts', () => {
    expect(DEFAULT_LAYOUTS.length).toBe(4);
  });

  it('should contain required layout types', () => {
    const ids = DEFAULT_LAYOUTS.map(l => l.id);
    expect(ids).toContain('dock-default');
    expect(ids).toContain('split-default');
    expect(ids).toContain('grid-default');
    expect(ids).toContain('canvas-default');
  });

  it('should have valid layout definitions', () => {
    for (const layout of DEFAULT_LAYOUTS) {
      expect(layout.id).toBeDefined();
      expect(layout.name).toBeDefined();
      expect(layout.type).toBeDefined();
    }
  });
});
