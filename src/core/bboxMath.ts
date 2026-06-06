export type BoundingBox = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  confidence?: number;
  classId?: number;
  className?: string;
};

/**
 * Decode anchor point + l,t,r,b pixel distances to xyxy bounding box.
 */
export function ltrbToXYXY(
  cx: number, cy: number,
  l_px: number, t_px: number, r_px: number, b_px: number
): BoundingBox {
  return {
    x1: cx - l_px,
    y1: cy - t_px,
    x2: cx + r_px,
    y2: cy + b_px,
  };
}

/**
 * Compute area of a bounding box.
 */
export function boxArea(box: BoundingBox): number {
  return Math.max(0, box.x2 - box.x1) * Math.max(0, box.y2 - box.y1);
}

/**
 * Compute Intersection over Union between two boxes.
 */
export function boxIoU(a: BoundingBox, b: BoundingBox): number {
  const xA = Math.max(a.x1, b.x1);
  const yA = Math.max(a.y1, b.y1);
  const xB = Math.min(a.x2, b.x2);
  const yB = Math.min(a.y2, b.y2);

  const wI = Math.max(0, xB - xA);
  const hI = Math.max(0, yB - yA);
  const areaI = wI * hI;

  const areaA = boxArea(a);
  const areaB = boxArea(b);
  const areaU = areaA + areaB - areaI;

  return areaU > 0 ? areaI / areaU : 0;
}

/**
 * Non-Maximum Suppression.
 * Returns indices of kept boxes, sorted by confidence descending.
 */
export function nms(boxes: BoundingBox[], scores: number[], threshold: number): number[] {
  const indices = scores
    .map((_, i) => i)
    .sort((a, b) => scores[b] - scores[a]);

  const kept: number[] = [];
  const suppressed = new Set<number>();

  for (const idx of indices) {
    if (suppressed.has(idx)) continue;
    kept.push(idx);

    for (const other of indices) {
      if (other === idx || suppressed.has(other)) continue;
      if (boxIoU(boxes[idx], boxes[other]) > threshold) {
        suppressed.add(other);
      }
    }
  }

  return kept;
}

/**
 * Clip box coordinates to image bounds.
 */
export function clipBox(box: BoundingBox, imgWidth: number, imgHeight: number): BoundingBox {
  return {
    ...box,
    x1: Math.max(0, Math.min(box.x1, imgWidth)),
    y1: Math.max(0, Math.min(box.y1, imgHeight)),
    x2: Math.max(0, Math.min(box.x2, imgWidth)),
    y2: Math.max(0, Math.min(box.y2, imgHeight)),
  };
}
