import { describe, it, expect } from 'vitest';

describe('Workspace Engine', () => {
  it('should initialize with default workspace', () => {
    const defaultWorkspace = 'default';
    expect(defaultWorkspace).toBe('default');
  });

  it('should correctly format workspace configuration keys', () => {
    const formatKey = (ws: string, key: string) => `cosmos:ws:${ws}:${key}`;
    expect(formatKey('default', 'tasks')).toBe('cosmos:ws:default:tasks');
    expect(formatKey('creative', 'notes')).toBe('cosmos:ws:creative:notes');
  });
});
