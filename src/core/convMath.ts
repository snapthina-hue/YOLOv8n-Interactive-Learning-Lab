import type { TensorShape } from './tensorShape';
import { createShape } from './tensorShape';

/**
 * Compute output spatial dimension for Conv2D.
 * H_out = floor((H_in + 2P - K) / S) + 1
 */
export function convOutputSize(inputSize: number, kernel: number, stride: number, padding: number): number {
  return Math.floor((inputSize + 2 * padding - kernel) / stride) + 1;
}

/**
 * Compute full output shape for Conv2D given input shape and params.
 */
export function convOutputShape(
  input: TensorShape,
  outChannels: number,
  kernel: number,
  stride: number,
  padding: number
): TensorShape {
  const hOut = convOutputSize(input.height, kernel, stride, padding);
  const wOut = convOutputSize(input.width, kernel, stride, padding);
  return createShape(input.batch, outChannels, hOut, wOut);
}

/**
 * Compute number of parameters in a Conv2D layer (without bias by default).
 */
export function convParams(inChannels: number, outChannels: number, kernel: number, bias = false): number {
  const params = outChannels * inChannels * kernel * kernel;
  return bias ? params + outChannels : params;
}

/**
 * Compute a single output value at position (o, i, j).
 * This is the educational formula for showing how convolution works.
 */
export function convOutputValue(
  input: number[][][],  // [C_in][H][W]
  weights: number[][][][],  // [C_out][C_in][K][K]
  bias: number[],
  outChannel: number,
  outRow: number,
  outCol: number,
  stride: number,
  padding: number
): number {
  const cIn = input.length;
  const k = weights[0][0].length;
  let sum = bias[outChannel] || 0;

  for (let c = 0; c < cIn; c++) {
    for (let u = 0; u < k; u++) {
      for (let v = 0; v < k; v++) {
        const row = outRow * stride + u - padding;
        const col = outCol * stride + v - padding;
        const inputVal = (row >= 0 && row < input[c].length && col >= 0 && col < input[c][0].length)
          ? input[c][row][col]
          : 0;
        sum += inputVal * weights[outChannel][c][u][v];
      }
    }
  }
  return sum;
}
