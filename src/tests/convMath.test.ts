import { describe, it, expect } from 'vitest';
import { convOutputSize, convOutputShape, convParams } from '../core/convMath';
import { createShape } from '../core/tensorShape';

describe('convOutputSize', () => {
  it('should compute 640 -> 320 with k=3 s=2 p=1', () => {
    expect(convOutputSize(640, 3, 2, 1)).toBe(320);
  });

  it('should compute 320 -> 160 with k=3 s=2 p=1', () => {
    expect(convOutputSize(320, 3, 2, 1)).toBe(160);
  });

  it('should compute 160 -> 80 with k=3 s=2 p=1', () => {
    expect(convOutputSize(160, 3, 2, 1)).toBe(80);
  });

  it('should compute 4 -> 2 with k=3 s=2 p=1', () => {
    expect(convOutputSize(4, 3, 2, 1)).toBe(2);
  });

  it('should compute 5 -> 5 with k=3 s=1 p=1', () => {
    expect(convOutputSize(5, 3, 1, 1)).toBe(5);
  });
});

describe('convOutputShape', () => {
  it('should compute [1,3,640,640] -> [1,16,320,320]', () => {
    const input = createShape(1, 3, 640, 640);
    const output = convOutputShape(input, 16, 3, 2, 1);
    expect(output).toEqual({ batch: 1, channels: 16, height: 320, width: 320 });
  });

  it('should compute [1,16,320,320] -> [1,32,160,160]', () => {
    const input = createShape(1, 16, 320, 320);
    const output = convOutputShape(input, 32, 3, 2, 1);
    expect(output).toEqual({ batch: 1, channels: 32, height: 160, width: 160 });
  });
});

describe('convParams', () => {
  it('should compute params for 3->16 k=3 no bias', () => {
    expect(convParams(3, 16, 3, false)).toBe(432);
  });

  it('should compute params for 16->32 k=3 no bias', () => {
    expect(convParams(16, 32, 3, false)).toBe(4608);
  });

  it('should compute params for 32->64 k=3 no bias', () => {
    expect(convParams(32, 64, 3, false)).toBe(18432);
  });
});
