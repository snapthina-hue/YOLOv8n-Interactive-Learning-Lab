/**
 * Softmax function.
 */
export function softmax(logits: number[]): number[] {
  const maxVal = Math.max(...logits);
  const exps = logits.map(z => Math.exp(z - maxVal));
  const sumExp = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => e / sumExp);
}

/**
 * DFL expected value: weighted sum of probabilities with indices.
 * d = sum(p_k * k) for k = 0..regMax-1
 */
export function dflExpectedValue(probabilities: number[]): number {
  return probabilities.reduce((sum, p, k) => sum + p * k, 0);
}

/**
 * Decode DFL logits to a single distance value.
 * Apply softmax then compute expected value.
 */
export function decodeDFL(logits: number[]): number {
  const probs = softmax(logits);
  return dflExpectedValue(probs);
}

/**
 * Decode a full set of 64 logits (4 * regMax) into l, t, r, b distances.
 */
export function decodeLTRB(logits64: number[], regMax = 16): { l: number; t: number; r: number; b: number } {
  const l = decodeDFL(logits64.slice(0, regMax));
  const t = decodeDFL(logits64.slice(regMax, 2 * regMax));
  const r = decodeDFL(logits64.slice(2 * regMax, 3 * regMax));
  const b = decodeDFL(logits64.slice(3 * regMax, 4 * regMax));
  return { l, t, r, b };
}

/**
 * Convert grid-unit distances to pixel distances.
 */
export function ltrbToPixel(l: number, t: number, r: number, b: number, stride: number) {
  return {
    l_px: l * stride,
    t_px: t * stride,
    r_px: r * stride,
    b_px: b * stride,
  };
}

/**
 * Sigmoid activation.
 */
export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}
