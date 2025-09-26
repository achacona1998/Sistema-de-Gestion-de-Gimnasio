import { describe, it, expect } from 'vitest';

describe('Test básico', () => {
  it('debe pasar un test simple', () => {
    expect(1 + 1).toBe(2);
  });

  it('debe verificar que las funciones básicas funcionan', () => {
    const suma = (a, b) => a + b;
    expect(suma(2, 3)).toBe(5);
  });

  it('debe verificar arrays', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
  });

  it('debe verificar objetos', () => {
    const obj = { name: 'Test', value: 42 };
    expect(obj).toHaveProperty('name');
    expect(obj.name).toBe('Test');
  });
});