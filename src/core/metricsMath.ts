/**
 * Precision = TP / (TP + FP)
 */
export function precision(tp: number, fp: number): number {
  return tp + fp > 0 ? tp / (tp + fp) : 0;
}

/**
 * Recall = TP / (TP + FN)
 */
export function recall(tp: number, fn: number): number {
  return tp + fn > 0 ? tp / (tp + fn) : 0;
}

/**
 * F1 Score = 2 * (P * R) / (P + R)
 */
export function f1Score(p: number, r: number): number {
  return p + r > 0 ? (2 * p * r) / (p + r) : 0;
}

/**
 * Compute CIoU components (educational).
 */
export function ciouComponents(
  predBox: { x1: number; y1: number; x2: number; y2: number },
  gtBox: { x1: number; y1: number; x2: number; y2: number },
  iou: number
) {
  const predCx = (predBox.x1 + predBox.x2) / 2;
  const predCy = (predBox.y1 + predBox.y2) / 2;
  const gtCx = (gtBox.x1 + gtBox.x2) / 2;
  const gtCy = (gtBox.y1 + gtBox.y2) / 2;

  // Distance between centers squared
  const rho2 = (predCx - gtCx) ** 2 + (predCy - gtCy) ** 2;

  // Enclosing box diagonal squared
  const encX1 = Math.min(predBox.x1, gtBox.x1);
  const encY1 = Math.min(predBox.y1, gtBox.y1);
  const encX2 = Math.max(predBox.x2, gtBox.x2);
  const encY2 = Math.max(predBox.y2, gtBox.y2);
  const c2 = (encX2 - encX1) ** 2 + (encY2 - encY1) ** 2;

  // Aspect ratio penalty
  const predW = predBox.x2 - predBox.x1;
  const predH = predBox.y2 - predBox.y1;
  const gtW = gtBox.x2 - gtBox.x1;
  const gtH = gtBox.y2 - gtBox.y1;
  const v = (4 / (Math.PI * Math.PI)) * (Math.atan(gtW / gtH) - Math.atan(predW / predH)) ** 2;
  const alpha = v / (1 - iou + v + 1e-7);

  const ciou = iou - rho2 / (c2 + 1e-7) - alpha * v;
  return { ciou, rho2, c2, v, alpha };
}
