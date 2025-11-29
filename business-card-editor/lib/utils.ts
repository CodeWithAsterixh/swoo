export function generateId(prefix = ''): string {
  return prefix + Math.random().toString(36).slice(2, 9);
}

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
