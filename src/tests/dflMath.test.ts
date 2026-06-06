import { describe, it, expect } from 'vitest';
import { softmax, dflExpectedValue, sigmoid } from '../core/dflMath';

describe('softmax', () => {
  it('should produce probabilities that sum to 1', () => {
    const logits = [1, 2, 3, 4, 5];
    const probs = softmax(logits);
    const sum = probs.reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 5);
  });

  it('should give highest prob to largest logit', () => {
    const logits = [0, 0, 0, 10, 0];
    const probs = softmax(logits);
    expect(probs[3]).toBeGreaterThan(0.99);
  });
});

describe('dflExpectedValue', () => {
  it('should return index of peak when distribution is one-hot', () => {
    const probs = [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    expect(dflExpectedValue(probs)).toBe(5);
  });

  it('should return weighted average', () => {
    const probs = [0.5, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    expect(dflExpectedValue(probs)).toBeCloseTo(0.5, 5);
  });
});

describe('sigmoid', () => {
  it('should return 0.5 for input 0', () => {
    expect(sigmoid(0)).toBe(0.5);
  });

  it('should return ~0.916 for input 2.4', () => {
    expect(sigmoid(2.4)).toBeCloseTo(0.9168, 3);
  });

  it('should return ~0.310 for input -0.8', () => {
    expect(sigmoid(-0.8)).toBeCloseTo(0.3100, 3);
  });
});
