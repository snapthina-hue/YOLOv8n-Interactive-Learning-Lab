import { useState, useRef, useEffect } from 'react';
import p5 from 'p5';
import { gridToAnchor } from '../core/anchorMath';
import { ltrbToXYXY } from '../core/bboxMath';
import { ltrbToPixel } from '../core/dflMath';
import { FormulaBlock } from '../components/formula/FormulaBlock';
import { STRIDES, FEATURE_MAP_SIZES } from '../core/yoloConfig';

type ScaleKey = 'P3' | 'P4' | 'P5';

export function AnchorLab() {
  const [scale, setScale] = useState<ScaleKey>('P4');
  const [gridI, setGridI] = useState(10);
  const [gridJ, setGridJ] = useState(20);
  const [lVal, setLVal] = useState(1.89);
  const [tVal, setTVal] = useState(1.20);
  const [rVal, setRVal] = useState(2.40);
  const [bVal, setBVal] = useState(1.75);
  const canvasRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  const stride = STRIDES[scale];
  const featureSize = FEATURE_MAP_SIZES[scale];
  const { cx, cy } = gridToAnchor(gridI, gridJ, stride);
  const { l_px, t_px, r_px, b_px } = ltrbToPixel(lVal, tVal, rVal, bVal, stride);
  const box = ltrbToXYXY(cx, cy, l_px, t_px, r_px, b_px);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (p5Ref.current) p5Ref.current.remove();

    const sketch = (p: p5) => {
      const canvasSize = 400;
      const scaleFactor = canvasSize / 640;

      p.setup = () => {
        p.createCanvas(canvasSize, canvasSize);
      };

      p.draw = () => {
        p.background(15, 23, 42);

        // Draw grid lines (lightly)
        p.stroke(51, 65, 85, 60);
        p.strokeWeight(0.5);
        for (let i = 0; i <= featureSize; i++) {
          const pos = (i * stride) * scaleFactor;
          p.line(pos, 0, pos, canvasSize);
          p.line(0, pos, canvasSize, pos);
        }

        // Highlight selected cell
        const cellX = gridJ * stride * scaleFactor;
        const cellY = gridI * stride * scaleFactor;
        const cellW = stride * scaleFactor;
        p.fill(59, 130, 246, 60);
        p.stroke(59, 130, 246);
        p.strokeWeight(2);
        p.rect(cellX, cellY, cellW, cellW);

        // Draw anchor point
        const anchorX = cx * scaleFactor;
        const anchorY = cy * scaleFactor;
        p.fill(59, 130, 246);
        p.noStroke();
        p.circle(anchorX, anchorY, 8);

        // Draw bounding box
        const bx1 = box.x1 * scaleFactor;
        const by1 = box.y1 * scaleFactor;
        const bx2 = box.x2 * scaleFactor;
        const by2 = box.y2 * scaleFactor;
        p.noFill();
        p.stroke(239, 68, 68);
        p.strokeWeight(2);
        p.rect(bx1, by1, bx2 - bx1, by2 - by1);

        // Draw l,t,r,b arrows from anchor
        p.stroke(34, 197, 94);
        p.strokeWeight(1.5);
        // left
        p.line(anchorX, anchorY, anchorX - l_px * scaleFactor, anchorY);
        // top
        p.line(anchorX, anchorY, anchorX, anchorY - t_px * scaleFactor);
        // right
        p.line(anchorX, anchorY, anchorX + r_px * scaleFactor, anchorY);
        // bottom
        p.line(anchorX, anchorY, anchorX, anchorY + b_px * scaleFactor);

        // Labels
        p.fill(255);
        p.noStroke();
        p.textSize(10);
        p.text(`(${cx.toFixed(0)}, ${cy.toFixed(0)})`, anchorX + 5, anchorY - 5);
      };
    };

    p5Ref.current = new p5(sketch, canvasRef.current);
    return () => { p5Ref.current?.remove(); p5Ref.current = null; };
  }, [scale, gridI, gridJ, lVal, tVal, rVal, bVal, cx, cy, stride, featureSize, box, l_px, t_px, r_px, b_px]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Anchor Point + Box Decode Lab</h1>
        <p className="text-slate-400 mt-2">
          From grid position to anchor coordinates, then DFL distances to bounding box.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-4">
          <h3 className="font-semibold text-white">Anchor Point</h3>

          <label className="block">
            <span className="text-sm text-slate-400">Scale</span>
            <select value={scale} onChange={e => setScale(e.target.value as ScaleKey)} className="w-full mt-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white">
              <option value="P3">P3 (80×80, stride 8)</option>
              <option value="P4">P4 (40×40, stride 16)</option>
              <option value="P5">P5 (20×20, stride 32)</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-slate-400">Grid i (row): {gridI}</span>
            <input type="range" min="0" max={featureSize - 1} value={gridI} onChange={e => setGridI(+e.target.value)} className="w-full mt-1" />
          </label>

          <label className="block">
            <span className="text-sm text-slate-400">Grid j (col): {gridJ}</span>
            <input type="range" min="0" max={featureSize - 1} value={gridJ} onChange={e => setGridJ(+e.target.value)} className="w-full mt-1" />
          </label>

          <div className="bg-slate-800 rounded p-3 text-sm">
            <div className="text-slate-400">Anchor Point:</div>
            <div className="font-mono text-green-400">cx = {cx.toFixed(1)}, cy = {cy.toFixed(1)}</div>
          </div>

          <h3 className="font-semibold text-white pt-2">DFL Distances (grid units)</h3>
          {[
            { label: 'l (left)', val: lVal, set: setLVal },
            { label: 't (top)', val: tVal, set: setTVal },
            { label: 'r (right)', val: rVal, set: setRVal },
            { label: 'b (bottom)', val: bVal, set: setBVal },
          ].map(({ label, val, set }) => (
            <label key={label} className="block">
              <span className="text-sm text-slate-400">{label}: {val.toFixed(2)}</span>
              <input type="range" min="0" max="15" step="0.01" value={val} onChange={e => set(+e.target.value)} className="w-full mt-1" />
            </label>
          ))}
        </div>

        {/* Canvas */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl p-5 border border-slate-800">
          <div ref={canvasRef} className="flex justify-center" />
        </div>
      </div>

      {/* Results & formulas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-3">
          <h3 className="font-semibold text-white">Anchor Formula</h3>
          <FormulaBlock latex={`cx = (j + 0.5) \\times stride = (${gridJ} + 0.5) \\times ${stride} = ${cx}`} />
          <FormulaBlock latex={`cy = (i + 0.5) \\times stride = (${gridI} + 0.5) \\times ${stride} = ${cy}`} />
        </div>

        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-3">
          <h3 className="font-semibold text-white">Box Decode</h3>
          <div className="text-xs font-mono text-slate-300 space-y-1 bg-slate-800 rounded p-3">
            <div>l_px = {lVal.toFixed(2)} × {stride} = {l_px.toFixed(2)}</div>
            <div>t_px = {tVal.toFixed(2)} × {stride} = {t_px.toFixed(2)}</div>
            <div>r_px = {rVal.toFixed(2)} × {stride} = {r_px.toFixed(2)}</div>
            <div>b_px = {bVal.toFixed(2)} × {stride} = {b_px.toFixed(2)}</div>
          </div>
          <FormulaBlock latex={`\\text{Box} = [${box.x1.toFixed(2)},\\; ${box.y1.toFixed(2)},\\; ${box.x2.toFixed(2)},\\; ${box.y2.toFixed(2)}]`} />
        </div>
      </div>
    </div>
  );
}
