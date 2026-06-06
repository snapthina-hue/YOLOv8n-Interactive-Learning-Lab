import { useState, useRef, useEffect, useMemo } from 'react';
import p5 from 'p5';
import { boxIoU, nms, type BoundingBox } from '../core/bboxMath';
import { FormulaBlock } from '../components/formula/FormulaBlock';

type BoxEntry = BoundingBox & { confidence: number; label: string };

const defaultBoxes: BoxEntry[] = [
  { x1: 150, y1: 100, x2: 350, y2: 300, confidence: 0.92, label: 'A' },
  { x1: 170, y1: 120, x2: 370, y2: 320, confidence: 0.85, label: 'B' },
  { x1: 180, y1: 110, x2: 360, y2: 310, confidence: 0.78, label: 'C' },
  { x1: 400, y1: 350, x2: 550, y2: 500, confidence: 0.70, label: 'D' },
];

export function NMSLab() {
  const [boxes, setBoxes] = useState<BoxEntry[]>(defaultBoxes);
  const [threshold, setThreshold] = useState(0.5);
  const canvasRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  const scores = boxes.map(b => b.confidence);
  const kept = nms(boxes, scores, threshold);
  const keptSet = useMemo(() => new Set(kept), [kept]);

  // Compute IoU matrix
  const iouMatrix: number[][] = boxes.map((a, i) =>
    boxes.map((b, j) => (i === j ? 1 : boxIoU(a, b)))
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    if (p5Ref.current) p5Ref.current.remove();

    const sketch = (p: p5) => {


      p.setup = () => {
        p.createCanvas(500, 400);
      };

      p.draw = () => {
        p.background(15, 23, 42);
        const sf = 500 / 640;

        // Draw suppressed boxes (dashed-like)
        boxes.forEach((box, i) => {
          if (keptSet.has(i)) return;
          p.noFill();
          p.stroke(107, 114, 128);
          p.strokeWeight(1);
          (p.drawingContext as CanvasRenderingContext2D).setLineDash([4, 4]);
          p.rect(box.x1 * sf, box.y1 * sf, (box.x2 - box.x1) * sf, (box.y2 - box.y1) * sf);
          (p.drawingContext as CanvasRenderingContext2D).setLineDash([]);

          p.fill(107, 114, 128);
          p.noStroke();
          p.textSize(11);
          p.text(`${box.label} (${box.confidence.toFixed(2)}) ✗`, box.x1 * sf, box.y1 * sf - 4);
        });

        // Draw kept boxes
        boxes.forEach((box, i) => {
          if (!keptSet.has(i)) return;
          p.noFill();
          p.stroke(34, 197, 94);
          p.strokeWeight(2.5);
          p.rect(box.x1 * sf, box.y1 * sf, (box.x2 - box.x1) * sf, (box.y2 - box.y1) * sf);

          p.fill(34, 197, 94);
          p.noStroke();
          p.textSize(12);
          p.text(`${box.label} (${box.confidence.toFixed(2)}) ✓`, box.x1 * sf, box.y1 * sf - 4);
        });

        p.noLoop();
      };
    };

    p5Ref.current = new p5(sketch, canvasRef.current);
    return () => { p5Ref.current?.remove(); p5Ref.current = null; };
  }, [boxes, threshold, kept, keptSet]);

  const updateBoxConf = (idx: number, conf: number) => {
    setBoxes(prev => prev.map((b, i) => i === idx ? { ...b, confidence: conf } : b));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">NMS Lab</h1>
        <p className="text-slate-400 mt-2">
          Non-Maximum Suppression: filter duplicate boxes based on IoU threshold.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-4">
          <h3 className="font-semibold text-white">Parameters</h3>

          <label className="block">
            <span className="text-sm text-slate-400">IoU Threshold: {threshold.toFixed(2)}</span>
            <input type="range" min="0.1" max="0.9" step="0.05" value={threshold}
              onChange={e => setThreshold(+e.target.value)} className="w-full mt-1" />
          </label>

          <div className="space-y-2">
            {boxes.map((box, i) => (
              <div key={box.label} className={`p-2 rounded text-sm ${keptSet.has(i) ? 'bg-green-900/50 border border-green-700' : 'bg-slate-800 border border-slate-700'}`}>
                <div className="flex justify-between items-center">
                  <span className="font-mono">Box {box.label}</span>
                  <span className={keptSet.has(i) ? 'text-green-400' : 'text-red-400'}>
                    {keptSet.has(i) ? 'KEPT' : 'SUPPRESSED'}
                  </span>
                </div>
                <label className="block mt-1">
                  <span className="text-xs text-slate-400">Conf: {box.confidence.toFixed(2)}</span>
                  <input type="range" min="0.1" max="0.99" step="0.01" value={box.confidence}
                    onChange={e => updateBoxConf(i, +e.target.value)} className="w-full" />
                </label>
              </div>
            ))}
          </div>

          <button
            onClick={() => setBoxes(defaultBoxes)}
            className="w-full py-2 bg-slate-700 text-white rounded hover:bg-slate-600 text-sm"
          >
            Reset Boxes
          </button>
        </div>

        {/* Canvas */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl p-5 border border-slate-800">
          <div ref={canvasRef} className="flex justify-center" />

          {/* IoU Matrix */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-white mb-2">IoU Matrix</h4>
            <div className="overflow-x-auto">
              <table className="text-xs font-mono text-slate-300">
                <thead>
                  <tr>
                    <th className="px-2 py-1"></th>
                    {boxes.map(b => <th key={b.label} className="px-2 py-1">{b.label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {boxes.map((row, i) => (
                    <tr key={row.label}>
                      <td className="px-2 py-1 font-bold">{row.label}</td>
                      {iouMatrix[i].map((val, j) => (
                        <td key={j} className={`px-2 py-1 ${val > threshold && i !== j ? 'text-red-400 font-bold' : ''}`}>
                          {val.toFixed(2)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-4">
        <h3 className="font-semibold text-white">IoU Formula</h3>
        <FormulaBlock latex={`IoU = \\frac{Area(B_1 \\cap B_2)}{Area(B_1 \\cup B_2)}`} />
        <FormulaBlock latex={`\\text{Suppress if: } IoU(B_{best}, B_i) > T_{nms} = ${threshold.toFixed(2)}`} />

        <div className="bg-slate-800 rounded p-3 text-sm text-slate-300">
          <h4 className="font-semibold text-white mb-2">NMS Algorithm:</h4>
          <ol className="list-decimal list-inside space-y-1">
            <li>Sort boxes by confidence (descending)</li>
            <li>Take box with highest confidence → keep it</li>
            <li>Compute IoU with remaining boxes</li>
            <li>Remove boxes with IoU {'>'} threshold</li>
            <li>Repeat until no candidates remain</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
