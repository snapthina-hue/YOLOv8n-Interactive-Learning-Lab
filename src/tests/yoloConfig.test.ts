import { describe, it, expect } from 'vitest';
import { scaleChannels, scaleDepth, headOutputChannels, totalAnchorPoints } from '../core/yoloConfig';

describe('scaleChannels', () => {
  it('should scale 64 * 0.25 = 16', () => {
    expect(scaleChannels(64, 0.25)).toBe(16);
  });

  it('should scale 128 * 0.25 = 32', () => {
    expect(scaleChannels(128, 0.25)).toBe(32);
  });

  it('should scale 256 * 0.25 = 64', () => {
    expect(scaleChannels(256, 0.25)).toBe(64);
  });

  it('should scale 512 * 0.25 = 128', () => {
    expect(scaleChannels(512, 0.25)).toBe(128);
  });

  it('should scale 1024 * 0.25 = 256', () => {
    expect(scaleChannels(1024, 0.25)).toBe(256);
  });
});

describe('scaleDepth', () => {
  it('should scale 6 * 0.33 = 2', () => {
    expect(scaleDepth(6, 0.33)).toBe(2);
  });

  it('should return minimum 1 for small depth', () => {
    expect(scaleDepth(1, 0.33)).toBe(1);
  });
});

describe('headOutputChannels', () => {
  it('should compute nc=2, regMax=16 -> 66', () => {
    expect(headOutputChannels(2, 16)).toBe(66);
  });

  it('should compute nc=80, regMax=16 -> 144', () => {
    expect(headOutputChannels(80, 16)).toBe(144);
  });
});

describe('totalAnchorPoints', () => {
  it('should be 8400', () => {
    expect(totalAnchorPoints()).toBe(8400);
  });
});
