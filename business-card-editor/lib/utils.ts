export function generateId(prefix = ''): string {
  return prefix + Math.random().toString(36).slice(2, 9);
}

// Generate a MongoDB-like ObjectId (24 hex chars). Not cryptographically strong,
// but sufficient for creating client-side local IDs that resemble ObjectIds.
export function generateObjectId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  const random = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  // ensure we end up with 24 chars: timestamp (8) + random (16)
  return (timestamp + random).slice(0, 24);
}

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
