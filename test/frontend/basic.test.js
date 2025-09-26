import { describe, it, expect } from 'vitest';

describe('Basic Test', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have access to DOM', () => {
    const div = document.createElement('div');
    expect(div).toBeDefined();
  });
});