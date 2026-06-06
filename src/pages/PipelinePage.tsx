import { useState } from 'react';
import { FormulaBlock } from '../components/formula/FormulaBlock';
import { TensorDisplay } from '../components/labs/TensorDisplay';
import { createShape } from '../core/tensorShape';

type PipelineStep = {
  id: number;
  name: string;
  section: 'input' | 'backbone' | 'neck' | 'head' | 'postprocess';
  outputShape: string;
  shape: [number, number, number, number] | [number, number, number];
  formula?: string;
  description: string;
};

const steps: PipelineStep[] = [
  { id: 0, name: 'Input Image', section: 'input', outputShape: '[1, 3, 640, 640]', shape: [1, 3, 640, 640], description: 'RGB image normalized to [0,1], formatted as [B,C,H,W].' },
  { id: 1, name: 'Conv0 (3→16, s2)', section: 'backbone', outputShape: '[1, 16, 320, 320]', shape: [1, 16, 320, 320], formula: 'H_{out} = \\lfloor (640+2-3)/2 \\rfloor + 1 = 320', description: 'First convolution with 16 filters, stride 2.' },
  { id: 2, name: 'Conv1 (16→32, s2)', section: 'backbone', outputShape: '[1, 32, 160, 160]', shape: [1, 32, 160, 160], description: 'Second convolution doubles channels, halves spatial.' },
  { id: 3, name: 'C2f + Conv → P3', section: 'backbone', outputShape: '[1, 64, 80, 80]', shape: [1, 64, 80, 80], description: 'Feature extraction at stride 8. Output = P3.' },
  { id: 4, name: 'C2f + Conv → P4', section: 'backbone', outputShape: '[1, 128, 40, 40]', shape: [1, 128, 40, 40], description: 'Feature extraction at stride 16. Output = P4.' },
  { id: 5, name: 'C2f + SPPF → P5', section: 'backbone', outputShape: '[1, 256, 20, 20]', shape: [1, 256, 20, 20], description: 'Deepest features + SPPF context aggregation. Output = P5.' },
  { id: 6, name: 'Neck Top-Down', section: 'neck', outputShape: 'P3_head=[1,64,80,80]', shape: [1, 64, 80, 80], description: 'Upsample + concat + C2f from P5 down to P3.' },
  { id: 7, name: 'Neck Bottom-Up', section: 'neck', outputShape: 'P5_head=[1,256,20,20]', shape: [1, 256, 20, 20], description: 'Downsample + concat + C2f from P3 back up to P5.' },
  { id: 8, name: 'Detect Head', section: 'head', outputShape: '[1, 66, 8400]', shape: [1, 66, 8400], formula: 'no = nc + 4 \\times reg\\_max = 2 + 64 = 66', description: 'Box branch (4×16=64 DFL) + class branch (2) per anchor point. Concat scales → 8400 points.' },
  { id: 9, name: 'DFL Decode', section: 'postprocess', outputShape: '[1, 4, 8400]', shape: [1, 4, 8400], formula: 'd = \\sum_{k=0}^{15} p_k \\cdot k', description: 'Softmax on 16-bin distributions → expected l,t,r,b values.' },
  { id: 10, name: 'Anchor + Box Decode', section: 'postprocess', outputShape: '[1, 8400, 4]', shape: [1, 8400, 4], formula: 'x_1 = cx - l \\times stride', description: 'Convert anchor points + l,t,r,b to x1,y1,x2,y2 boxes.' },
  { id: 11, name: 'Confidence Filter', section: 'postprocess', outputShape: '[N_filtered, 6]', shape: [1, 8400, 6], formula: 'conf = \\max(scores) \\geq T_{conf}', description: 'Sigmoid class scores, filter by confidence threshold.' },
  { id: 12, name: 'NMS → Final', section: 'postprocess', outputShape: '[N_det, 6]', shape: [1, 100, 6], formula: 'IoU(B_{best}, B_i) > T_{nms} \\Rightarrow \\text{suppress}', description: 'Non-Maximum Suppression removes duplicate detections.' },
];

const sectionColors: Record<string, string> = {
  input: 'border-slate-500',
  backbone: 'border-blue-500',
  neck: 'border-purple-500',
  head: 'border-red-500',
  postprocess: 'border-green-500',
};

const sectionLabels: Record<string, string> = {
  input: 'Input',
  backbone: 'Backbone',
  neck: 'Neck',
  head: 'Head',
  postprocess: 'Postprocess',
};

export function PipelinePage() {
  const [selected, setSelected] = useState(0);
  const step = steps[selected];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">End-to-End Forward Pass</h1>
        <p className="text-slate-400 mt-2">
          Complete YOLOv8n pipeline from input image to final detections (nc=2).
        </p>
      </div>

      {/* Pipeline Progress */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setSelected(i)}
              className={`px-3 py-2 rounded text-xs transition-all border-t-2 ${sectionColors[s.section]} ${
                selected === i ? 'bg-slate-700 ring-1 ring-yellow-400' : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <div className="text-white font-medium">{s.name}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{s.outputShape}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Step Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 text-xs rounded border ${sectionColors[step.section]} text-slate-300`}>
              {sectionLabels[step.section]}
            </span>
            <h3 className="font-semibold text-white">Step {step.id}: {step.name}</h3>
          </div>

          <TensorDisplay
            shape={step.shape.length === 4
              ? createShape(step.shape[0], step.shape[1], step.shape[2], step.shape[3])
              : createShape(1, step.shape[0], step.shape[1], step.shape[2])
            }
            label="Output"
            color={step.section === 'backbone' ? 'blue' : step.section === 'neck' ? 'purple' : step.section === 'head' ? 'red' : 'green'}
          />

          <p className="text-sm text-slate-300">{step.description}</p>

          {step.formula && <FormulaBlock latex={step.formula} />}
        </div>

        {/* Full Shape Timeline */}
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
          <h3 className="font-semibold text-white mb-3">Shape Timeline</h3>
          <div className="space-y-1 text-xs font-mono max-h-96 overflow-y-auto">
            {steps.map((s, i) => (
              <div
                key={s.id}
                className={`px-2 py-1.5 rounded cursor-pointer ${
                  i === selected ? 'bg-slate-700 text-yellow-300' : 'text-slate-400 hover:bg-slate-800'
                }`}
                onClick={() => setSelected(i)}
              >
                <span className="text-slate-500 w-6 inline-block">{s.id}.</span>
                <span className="text-slate-300">{s.name}</span>
                <span className="float-right">{s.outputShape}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setSelected(Math.max(0, selected - 1))}
          disabled={selected === 0}
          className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 disabled:opacity-40"
        >
          ← Previous
        </button>
        <button
          onClick={() => setSelected(Math.min(steps.length - 1, selected + 1))}
          disabled={selected === steps.length - 1}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
