# YOLOv8n Interactive Learning Lab

> From Image Pixels to Object Detection Output

Interactive educational website built with **React + TypeScript + p5.js** that teaches YOLOv8n object detection visually, mathematically, and layer-by-layer.

## Features

- **Conv2D Lab** — Interactive convolution with real-time visualization of kernel movement, stride, padding
- **Backbone Visualizer** — Layer-by-layer view from `[1,3,640,640]` → P3/P4/P5
- **Neck Fusion Lab** — Top-down & bottom-up multi-scale feature fusion with shape computation
- **Detect Head Lab** — Understanding output `[1,66,H,W]` and 8400 anchor points
- **Anchor + Box Decode Lab** — Grid-to-pixel conversion, DFL decode, l/t/r/b → xyxy
- **NMS Lab** — Non-Maximum Suppression with IoU calculation & interactive filtering
- **Formula Library** — Complete mathematical reference for YOLOv8n pipeline
- **End-to-End Pipeline** — Step-by-step forward pass from input to final detections

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite |
| Visualization | p5.js |
| Math Rendering | KaTeX |
| Styling | Tailwind CSS v4 |
| State | Zustand |
| Routing | React Router v7 |
| Testing | Vitest |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Type check
npm run typecheck

# Build for production
npm run build
```

## Project Structure

```
src/
├── core/              # Pure math/formula engine (unit tested)
│   ├── tensorShape.ts
│   ├── convMath.ts
│   ├── yoloConfig.ts
│   ├── anchorMath.ts
│   ├── dflMath.ts
│   ├── bboxMath.ts
│   └── metricsMath.ts
├── components/        # Reusable UI components
│   ├── layout/        # Navbar, Layout
│   ├── labs/          # TensorDisplay, etc.
│   └── formula/       # FormulaBlock, InlineFormula
├── pages/             # Route pages (labs, formula library, pipeline)
├── tests/             # Vitest unit tests for core engine
└── index.css          # Tailwind + KaTeX styles
```

## Core Formula Engine

The `src/core/` directory contains pure, tested functions:

```typescript
convOutputSize(640, 3, 2, 1)        // → 320
headOutputChannels(2, 16)           // → 66
gridToAnchor(10, 20, 16)            // → { cx: 328, cy: 168 }
ltrbToXYXY(328, 168, 30.24, 19.2, 38.4, 28)  // → box coordinates
boxIoU(boxA, boxB)                  // → IoU value
nms(boxes, scores, 0.5)             // → kept indices
```

## Key Concepts Covered

1. Tensor format `[B, C, H, W]`
2. Conv2D multi-channel operation
3. Stride & channel scaling in YOLOv8n
4. C2f block (split → bottleneck → concat)
5. SPPF (Spatial Pyramid Pooling Fast)
6. Neck: top-down + bottom-up fusion
7. Detect head: box + class branches
8. Anchor points from grid cells
9. DFL (Distribution Focal Loss) decode
10. Box decode: `cx,cy,l,t,r,b` → `x1,y1,x2,y2`
11. Non-Maximum Suppression (NMS)
12. Evaluation metrics (mAP, Precision, Recall)

## License

MIT
