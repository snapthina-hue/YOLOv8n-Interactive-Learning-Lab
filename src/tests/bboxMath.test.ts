import { describe, it, expect } from 'vitest';
import { ltrbToXYXY, boxIoU, nms } from '../core/bboxMath';

describe('ltrbToXYXY', () => {
  it('should decode cx=328,cy=168,l=30.24,t=19.2,r=38.4,b=28 correctly', () => {
    const box = ltrbToXYXY(328, 168, 30.24, 19.2, 38.4, 28);
    expect(box.x1).toBeCloseTo(297.76, 2);
    expect(box.y1).toBeCloseTo(148.8, 2);
    expect(box.x2).toBeCloseTo(366.4, 2);
    expect(box.y2).toBeCloseTo(196, 2);
  });
});

describe('boxIoU', () => {
  it('should return 1 for identical boxes', () => {
    const box = { x1: 0, y1: 0, x2: 100, y2: 100 };
    expect(boxIoU(box, box)).toBeCloseTo(1, 5);
  });

  it('should return 0 for non-overlapping boxes', () => {
    const a = { x1: 0, y1: 0, x2: 50, y2: 50 };
    const b = { x1: 60, y1: 60, x2: 100, y2: 100 };
    expect(boxIoU(a, b)).toBe(0);
  });

  it('should compute partial overlap correctly', () => {
    const a = { x1: 0, y1: 0, x2: 100, y2: 100 };
    const b = { x1: 50, y1: 50, x2: 150, y2: 150 };
    // Intersection: 50*50=2500, Union: 10000+10000-2500=17500
    expect(boxIoU(a, b)).toBeCloseTo(2500 / 17500, 4);
  });
});

describe('nms', () => {
  it('should suppress lower confidence box when IoU > threshold', () => {
    const boxes = [
      { x1: 0, y1: 0, x2: 100, y2: 100 },
      { x1: 10, y1: 10, x2: 110, y2: 110 },
    ];
    const scores = [0.9, 0.7];
    const kept = nms(boxes, scores, 0.5);
    expect(kept).toEqual([0]);
  });

  it('should keep both boxes when IoU < threshold', () => {
    const boxes = [
      { x1: 0, y1: 0, x2: 50, y2: 50 },
      { x1: 200, y1: 200, x2: 300, y2: 300 },
    ];
    const scores = [0.9, 0.8];
    const kept = nms(boxes, scores, 0.5);
    expect(kept.length).toBe(2);
  });
});
