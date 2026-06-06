import { useState } from 'react';
import { FormulaBlock } from '../components/formula/FormulaBlock';
import { TensorDisplay } from '../components/labs/TensorDisplay';
import { createShape } from '../core/tensorShape';

type NeckStep = {
  id: number;
  name: string;
  path: 'top-down' | 'bottom-up';
  operation: string;
  inputShapes: { label: string; shape: [number, number, number, number] }[];
  outputShape: [number, number, number, number];
  formula?: string;
  explanation: string;
};

const neckSteps: NeckStep[] = [
  { id: 1, name: 'Upsample P5', path: 'top-down', operation: 'Upsample ×2',
    inputShapes: [{ label: 'P5', shape: [1, 256, 20, 20] }],
    outputShape: [1, 256, 40, 40], explanation: 'Spatial doubles from 20→40, channels unchanged.' },
  { id: 2, name: 'Concat P5_up + P4', path: 'top-down', operation: 'Concat',
    inputShapes: [{ label: 'P5_up', shape: [1, 256, 40, 40] }, { label: 'P4', shape: [1, 128, 40, 40] }],
    outputShape: [1, 384, 40, 40], formula: '256 + 128 = 384', explanation: 'Channel concatenation along C dimension.' },
  { id: 3, name: 'C2f → P4_td', path: 'top-down', operation: 'C2f 384→128',
    inputShapes: [{ label: 'Concat', shape: [1, 384, 40, 40] }],
    outputShape: [1, 128, 40, 40], explanation: 'C2f reduces channels from 384 to 128.' },
  { id: 4, name: 'Upsample P4_td', path: 'top-down', operation: 'Upsample ×2',
    inputShapes: [{ label: 'P4_td', shape: [1, 128, 40, 40] }],
    outputShape: [1, 128, 80, 80], explanation: 'Spatial doubles from 40→80.' },
  { id: 5, name: 'Concat P4_up + P3', path: 'top-down', operation: 'Concat',
    inputShapes: [{ label: 'P4_up', shape: [1, 128, 80, 80] }, { label: 'P3', shape: [1, 64, 80, 80] }],
    outputShape: [1, 192, 80, 80], formula: '128 + 64 = 192', explanation: 'Channel concatenation.' },
  { id: 6, name: 'C2f → P3_head', path: 'top-down', operation: 'C2f 192→64',
    inputShapes: [{ label: 'Concat', shape: [1, 192, 80, 80] }],
    outputShape: [1, 64, 80, 80], explanation: 'C2f reduces channels. This is P3_head.' },
  { id: 7, name: 'Downsample P3_head', path: 'bottom-up', operation: 'Conv s2',
    inputShapes: [{ label: 'P3_head', shape: [1, 64, 80, 80] }],
    outputShape: [1, 64, 40, 40], explanation: 'Stride-2 conv halves spatial from 80→40.' },
  { id: 8, name: 'Concat + P4_td', path: 'bottom-up', operation: 'Concat',
    inputShapes: [{ label: 'P3_down', shape: [1, 64, 40, 40] }, { label: 'P4_td', shape: [1, 128, 40, 40] }],
    outputShape: [1, 192, 40, 40], formula: '64 + 128 = 192', explanation: 'Channel concatenation.' },
  { id: 9, name: 'C2f → P4_head', path: 'bottom-up', operation: 'C2f 192→128',
    inputShapes: [{ label: 'Concat', shape: [1, 192, 40, 40] }],
    outputShape: [1, 128, 40, 40], explanation: 'C2f reduces channels. This is P4_head.' },
  { id: 10, name: 'Downsample P4_head', path: 'bottom-up', operation: 'Conv s2',
    inputShapes: [{ label: 'P4_head', shape: [1, 128, 40, 40] }],
    outputShape: [1, 128, 20, 20], explanation: 'Stride-2 conv halves spatial from 40→20.' },
  { id: 11, name: 'Concat + P5', path: 'bottom-up', operation: 'Concat',
    inputShapes: [{ label: 'P4_down', shape: [1, 128, 20, 20] }, { label: 'P5', shape: [1, 256, 20, 20] }],
    outputShape: [1, 384, 20, 20], formula: '128 + 256 = 384', explanation: 'Channel concatenation.' },
  { id: 12, name: 'C2f → P5_head', path: 'bottom-up', operation: 'C2f 384→256',
    inputShapes: [{ label: 'Concat', shape: [1, 384, 20, 20] }],
    outputShape: [1, 256, 20, 20], explanation: 'C2f reduces channels. This is P5_head.' },
];

export function NeckLab() {
  const [selected, setSelected] = useState(0);
  const step = neckSteps[selected];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Neck Fusion Lab</h1>
        <p className="text-slate-400 mt-2">
          Top-down and bottom-up multi-scale feature fusion in YOLOv8n neck.
        </p>
      </div>

      {/* Step selector */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
        <div className="mb-3 flex gap-4">
          <span className="text-sm px-2 py-1 bg-green-800 text-green-200 rounded">Top-Down</span>
          <span className="text-sm px-2 py-1 bg-amber-800 text-amber-200 rounded">Bottom-Up</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {neckSteps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setSelected(i)}
              className={`px-3 py-2 rounded text-xs font-mono transition-all ${
                selected === i ? 'ring-2 ring-yellow-400' : ''
              } ${s.path === 'top-down' ? 'bg-green-800 text-green-100' : 'bg-amber-800 text-amber-100'} hover:opacity-90`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Step detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-4">
          <h3 className="font-semibold text-white">Step {step.id}: {step.name}</h3>
          <div className="text-sm text-slate-400 bg-slate-800 rounded px-3 py-2">{step.operation}</div>

          <div className="flex flex-wrap items-center gap-3">
            {step.inputShapes.map((inp) => (
              <TensorDisplay
                key={inp.label}
                shape={createShape(...inp.shape)}
                label={inp.label}
                color={inp.label.includes('P5') ? 'red' : inp.label.includes('P4') ? 'purple' : 'blue'}
              />
            ))}
            <span className="text-slate-500 text-xl">→</span>
            <TensorDisplay shape={createShape(...step.outputShape)} label="Output" color="green" />
          </div>

          <p className="text-sm text-slate-300">{step.explanation}</p>
        </div>

        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-4">
          <h3 className="font-semibold text-white">Computation</h3>
          {step.formula && (
            <FormulaBlock latex={`\\text{Channels: } ${step.formula}`} />
          )}
          {step.operation.includes('Upsample') && (
            <FormulaBlock latex={`H_{out} = H_{in} \\times 2, \\quad W_{out} = W_{in} \\times 2`} />
          )}
          {step.operation.includes('Conv s2') && (
            <FormulaBlock latex={`H_{out} = \\left\\lfloor \\frac{H_{in} + 2(1) - 3}{2} \\right\\rfloor + 1 = \\frac{H_{in}}{2}`} />
          )}

          {/* Final output summary */}
          <div className="mt-4 p-3 bg-slate-800 rounded">
            <h4 className="text-sm font-semibold text-white mb-2">Neck Output (Head Input)</h4>
            <div className="space-y-1 text-xs font-mono text-slate-300">
              <div>P3_head = [1, 64, 80, 80]</div>
              <div>P4_head = [1, 128, 40, 40]</div>
              <div>P5_head = [1, 256, 20, 20]</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
