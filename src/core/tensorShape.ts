export type TensorShape = {
  batch: number;
  channels: number;
  height: number;
  width: number;
};

export function createShape(b: number, c: number, h: number, w: number): TensorShape {
  return { batch: b, channels: c, height: h, width: w };
}

export function shapeToString(s: TensorShape): string {
  return `[${s.batch}, ${s.channels}, ${s.height}, ${s.width}]`;
}

export function totalElements(s: TensorShape): number {
  return s.batch * s.channels * s.height * s.width;
}

export function spatialSize(s: TensorShape): number {
  return s.height * s.width;
}
