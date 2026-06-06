import type { TensorShape } from './tensorShape';
import { createShape } from './tensorShape';

export type YOLOScale = {
  name: 'n' | 's' | 'm' | 'l' | 'x';
  depth: number;
  width: number;
  maxChannels: number;
};

export const YOLO_SCALES: Record<string, YOLOScale> = {
  n: { name: 'n', depth: 0.33, width: 0.25, maxChannels: 1024 },
  s: { name: 's', depth: 0.33, width: 0.50, maxChannels: 1024 },
  m: { name: 'm', depth: 0.67, width: 0.75, maxChannels: 768 },
  l: { name: 'l', depth: 1.00, width: 1.00, maxChannels: 512 },
  x: { name: 'x', depth: 1.00, width: 1.25, maxChannels: 512 },
};

export function scaleChannels(baseChannel: number, width: number): number {
  return Math.round(baseChannel * width);
}

export function scaleDepth(baseRepeat: number, depth: number): number {
  return Math.max(Math.round(baseRepeat * depth), 1);
}

export type LayerConfig = {
  id: number;
  name: string;
  module: 'Conv' | 'C2f' | 'SPPF' | 'Upsample' | 'Concat' | 'Detect';
  inputShape: TensorShape;
  outputShape: TensorShape;
  kernel?: number;
  stride?: number;
  explanation: string;
  isFeatureOutput?: 'P3' | 'P4' | 'P5';
};

/**
 * Generate YOLOv8n backbone layer configs for input 640x640.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getBackboneLayers(_nc = 2): LayerConfig[] {
  return [
    {
      id: 0, name: 'Conv', module: 'Conv',
      inputShape: createShape(1, 3, 640, 640),
      outputShape: createShape(1, 16, 320, 320),
      kernel: 3, stride: 2,
      explanation: '3→16 channels, stride 2 halves spatial from 640 to 320',
    },
    {
      id: 1, name: 'Conv', module: 'Conv',
      inputShape: createShape(1, 16, 320, 320),
      outputShape: createShape(1, 32, 160, 160),
      kernel: 3, stride: 2,
      explanation: '16→32 channels, stride 2 halves spatial from 320 to 160',
    },
    {
      id: 2, name: 'C2f', module: 'C2f',
      inputShape: createShape(1, 32, 160, 160),
      outputShape: createShape(1, 32, 160, 160),
      explanation: 'C2f maintains 32 channels, spatial unchanged',
    },
    {
      id: 3, name: 'Conv', module: 'Conv',
      inputShape: createShape(1, 32, 160, 160),
      outputShape: createShape(1, 64, 80, 80),
      kernel: 3, stride: 2,
      explanation: '32→64 channels, stride 2 halves spatial from 160 to 80',
    },
    {
      id: 4, name: 'C2f', module: 'C2f',
      inputShape: createShape(1, 64, 80, 80),
      outputShape: createShape(1, 64, 80, 80),
      explanation: 'C2f maintains 64 channels, spatial unchanged. This is P3.',
      isFeatureOutput: 'P3',
    },
    {
      id: 5, name: 'Conv', module: 'Conv',
      inputShape: createShape(1, 64, 80, 80),
      outputShape: createShape(1, 128, 40, 40),
      kernel: 3, stride: 2,
      explanation: '64→128 channels, stride 2 halves spatial from 80 to 40',
    },
    {
      id: 6, name: 'C2f', module: 'C2f',
      inputShape: createShape(1, 128, 40, 40),
      outputShape: createShape(1, 128, 40, 40),
      explanation: 'C2f maintains 128 channels, spatial unchanged. This is P4.',
      isFeatureOutput: 'P4',
    },
    {
      id: 7, name: 'Conv', module: 'Conv',
      inputShape: createShape(1, 128, 40, 40),
      outputShape: createShape(1, 256, 20, 20),
      kernel: 3, stride: 2,
      explanation: '128→256 channels, stride 2 halves spatial from 40 to 20',
    },
    {
      id: 8, name: 'C2f', module: 'C2f',
      inputShape: createShape(1, 256, 20, 20),
      outputShape: createShape(1, 256, 20, 20),
      explanation: 'C2f maintains 256 channels, spatial unchanged',
    },
    {
      id: 9, name: 'SPPF', module: 'SPPF',
      inputShape: createShape(1, 256, 20, 20),
      outputShape: createShape(1, 256, 20, 20),
      explanation: 'SPPF aggregates context. Channel remains 256, spatial unchanged. This is P5.',
      isFeatureOutput: 'P5',
    },
  ];
}

export function headOutputChannels(nc: number, regMax: number): number {
  return nc + 4 * regMax;
}

export function totalAnchorPoints(): number {
  return 80 * 80 + 40 * 40 + 20 * 20; // 8400
}

export const STRIDES = { P3: 8, P4: 16, P5: 32 } as const;

export const FEATURE_MAP_SIZES = { P3: 80, P4: 40, P5: 20 } as const;
