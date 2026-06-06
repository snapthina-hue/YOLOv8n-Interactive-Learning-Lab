export type AnchorPoint = {
  scale: 'P3' | 'P4' | 'P5';
  i: number;
  j: number;
  stride: number;
  cx: number;
  cy: number;
};

/**
 * Convert grid position (i, j) to anchor point coordinates.
 * cx = (j + 0.5) * stride
 * cy = (i + 0.5) * stride
 */
export function gridToAnchor(i: number, j: number, stride: number): { cx: number; cy: number } {
  return {
    cx: (j + 0.5) * stride,
    cy: (i + 0.5) * stride,
  };
}

/**
 * Generate all anchor points for a given feature map size and stride.
 */
export function generateAnchors(featureSize: number, stride: number, scale: 'P3' | 'P4' | 'P5'): AnchorPoint[] {
  const anchors: AnchorPoint[] = [];
  for (let i = 0; i < featureSize; i++) {
    for (let j = 0; j < featureSize; j++) {
      const { cx, cy } = gridToAnchor(i, j, stride);
      anchors.push({ scale, i, j, stride, cx, cy });
    }
  }
  return anchors;
}

/**
 * Count total anchor points across all scales.
 */
export function totalAnchors(sizes: number[]): number {
  return sizes.reduce((sum, s) => sum + s * s, 0);
}
