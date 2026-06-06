---
name: testing-yolov8n-lab
description: Test the YOLOv8n Interactive Learning Lab end-to-end. Use when verifying UI modules, p5.js visualizations, or formula computations after code changes.
---

# Testing YOLOv8n Interactive Learning Lab

## Prerequisites

- Node.js 22+ installed
- Dependencies installed: `npm install`
- Dev server running: `npm run dev` (serves at http://localhost:5173)

## Unit Tests

Run `npm run test` — expects 37 tests passing across 5 test files in `src/tests/`.

## Lint & Typecheck

- `npm run lint` — ESLint with TypeScript rules
- `npm run typecheck` — `tsc --noEmit`

Both must pass cleanly before PR creation.

## End-to-End Browser Testing

The app has 8 interactive modules accessible via navbar links. Each module has specific acceptance criteria with exact numeric values to verify.

### Navigation Structure

| Route | Module | Key Verification |
|-------|--------|------------------|
| `/` | Home | 8 module cards + stats (640×640, 8400, 3 Scales, 3.2M) |
| `/labs/conv` | Conv Lab | Formula computation with sliders (input 4-32) |
| `/labs/backbone` | Backbone | Click layer buttons → shape display |
| `/labs/neck` | Neck Fusion | Step buttons for 12 fusion operations |
| `/labs/head` | Head Lab | nc slider + reg_max dropdown → output channels |
| `/labs/anchor` | Anchor+Box | Scale select + grid sliders → coordinates |
| `/labs/nms` | NMS Lab | Confidence sliders + IoU threshold → kept/suppressed |
| `/formulas` | Formula Library | KaTeX rendered formulas (10+ categories) |
| `/pipeline` | Pipeline | 13 clickable steps with shape timeline |

### Acceptance Criteria Values

These are the exact values to verify in the UI:

- **AC-001 (Conv)**: With input=8, kernel=3, stride=2, padding=1 → output=4. Formula: `(8+2(1)-3)/2+1=4`
- **AC-002 (Backbone)**: Click Layer 4 (C2f P3) → output `[1, 64, 80, 80]`
- **AC-003 (Neck)**: Step 1 "Upsample P5" → `[1,256,20,20]` to `[1,256,40,40]`
- **AC-004 (Head)**: nc=2, reg_max=16 → output channels = 66
- **AC-005 (Head)**: Concat shape `[1, 66, 8400]`, total points = 80²+40²+20² = 8400
- **AC-006 (Anchor)**: P4, i=10, j=20 → cx=328.0, cy=168.0
- **AC-007 (Box Decode)**: l=1.89, t=1.20, r=2.40, b=1.75 → Box `[297.76, 148.80, 366.40, 196.00]`
- **AC-008 (NMS)**: Box A (0.92) KEPT, Box B (0.85) SUPPRESSED, Box C (0.78) SUPPRESSED, Box D (0.70) KEPT

### Testing Tips

- The Conv Lab slider range is 4-32 (not 640). The formula engine is the same; just verify with displayed values.
- Backbone layers are clickable buttons showing `[type] [shape]` — Layer 4 has a green "P3" badge.
- NMS Lab has default boxes pre-configured with overlapping regions. IoU matrix shows values >threshold highlighted in color.
- p5.js canvases render animated visualizations — verify they appear (not blank white boxes).
- All formulas should render as proper math notation via KaTeX (not raw LaTeX strings).
- The Pipeline page has Previous/Next navigation buttons and a scrollable step bar at the top.

### Common Issues

- If p5.js canvas shows blank, check browser console for WebGL errors — the sketches use 2D mode.
- TypeScript strict mode requires `type` keyword for type-only imports.
- Tailwind v4 uses the new `@import` syntax — check `src/index.css` for configuration.
- If the dev server port 5173 is occupied, Vite auto-increments to 5174+.

## Devin Secrets Needed

None — this is a fully client-side app with no external API dependencies.
