import { describe, it, expect } from 'vitest';
import { gridToAnchor, totalAnchors } from '../core/anchorMath';

describe('gridToAnchor', () => {
  it('should compute P4 i=10 j=20 stride=16 -> cx=328, cy=168', () => {
    const { cx, cy } = gridToAnchor(10, 20, 16);
    expect(cx).toBe(328);
    expect(cy).toBe(168);
  });

  it('should compute P3 i=0 j=0 stride=8 -> cx=4, cy=4', () => {
    const { cx, cy } = gridToAnchor(0, 0, 8);
    expect(cx).toBe(4);
    expect(cy).toBe(4);
  });

  it('should compute P5 i=19 j=19 stride=32 -> cx=624, cy=624', () => {
    const { cx, cy } = gridToAnchor(19, 19, 32);
    expect(cx).toBe(624);
    expect(cy).toBe(624);
  });
});

describe('totalAnchors', () => {
  it('should compute 80*80 + 40*40 + 20*20 = 8400', () => {
    expect(totalAnchors([80, 40, 20])).toBe(8400);
  });
});
