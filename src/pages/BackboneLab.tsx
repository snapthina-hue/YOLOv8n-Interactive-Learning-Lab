import { useState } from 'react';
import { getBackboneLayers } from '../core/yoloConfig';
import { TensorDisplay } from '../components/labs/TensorDisplay';
import { FormulaBlock } from '../components/formula/FormulaBlock';
import { shapeToString } from '../core/tensorShape';

const layers = getBackboneLayers();

const moduleColors: Record<string, string> = {
  Conv: 'bg-blue-600',
  C2f: 'bg-purple-600',
  SPPF: 'bg-orange-600',
};

export function BackboneLab() {
  const [selected, setSelected] = useState<number>(0);
  const layer = layers[selected];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Backbone Layer-by-Layer</h1>
        <p className="text-slate-400 mt-2">
          YOLOv8n backbone transforms [1, 3, 640, 640] → P3/P4/P5 multi-scale features.
        </p>
      </div>

      {/* Layer Diagram */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
        <h3 className="font-semibold text-white mb-4">Architecture Flow</h3>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="px-3 py-2 bg-slate-700 rounded text-xs text-white font-mono">
            Input [1,3,640,640]
          </div>
          <span className="text-slate-500">→</span>
          {layers.map((l) => (
            <button
              key={l.id}
              onClick={() => setSelected(l.id)}
              className={`px-3 py-2 rounded text-xs font-mono transition-all ${
                selected === l.id
                  ? 'ring-2 ring-yellow-400 scale-105'
                  : ''
              } ${moduleColors[l.module] || 'bg-slate-600'} text-white hover:opacity-90`}
            >
              <div>{l.name}</div>
              <div className="text-[10px] opacity-80">{shapeToString(l.outputShape)}</div>
              {l.isFeatureOutput && (
                <div className="text-[10px] font-bold text-yellow-300">{l.isFeatureOutput}</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Layer Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-4">
          <h3 className="font-semibold text-white">
            Layer {layer.id}: {layer.name}
            {layer.isFeatureOutput && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-600 text-yellow-100 text-xs rounded">
                {layer.isFeatureOutput}
              </span>
            )}
          </h3>

          <div className="flex items-center gap-3">
            <TensorDisplay shape={layer.inputShape} label="Input" color="blue" />
            <span className="text-slate-500 text-xl">→</span>
            <TensorDisplay shape={layer.outputShape} label="Output" color="green" />
          </div>

          <div className="text-sm text-slate-300 bg-slate-800 rounded p-3">
            {layer.explanation}
          </div>

          {layer.kernel && layer.stride && (
            <div className="text-sm text-slate-400">
              <span className="text-slate-300">Kernel:</span> {layer.kernel}×{layer.kernel} |{' '}
              <span className="text-slate-300">Stride:</span> {layer.stride} |{' '}
              <span className="text-slate-300">Padding:</span> 1
            </div>
          )}
        </div>

        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-4">
          <h3 className="font-semibold text-white">Shape Computation</h3>
          {layer.module === 'Conv' && layer.stride === 2 && (
            <FormulaBlock
              latex={`H_{out} = \\left\\lfloor \\frac{${layer.inputShape.height} + 2(1) - ${layer.kernel}}{${layer.stride}} \\right\\rfloor + 1 = ${layer.outputShape.height}`}
            />
          )}
          {layer.module === 'C2f' && (
            <div className="space-y-2">
              <FormulaBlock latex={`C_{hidden} = ${layer.outputShape.channels} \\times 0.5 = ${layer.outputShape.channels / 2}`} />
              <p className="text-sm text-slate-400">C2f maintains spatial size. Channel is preserved through split → bottleneck → concat → conv.</p>
            </div>
          )}
          {layer.module === 'SPPF' && (
            <div className="space-y-2">
              <p className="text-sm text-slate-400">SPPF applies cascaded MaxPool(5×5) to increase receptive field without changing spatial size.</p>
              <FormulaBlock latex={`\\text{Concat: } 128 + 128 + 128 + 128 = 512 \\rightarrow \\text{Conv} \\rightarrow 256`} />
            </div>
          )}

          {/* Feature output markers */}
          <div className="mt-4 p-3 bg-slate-800 rounded">
            <h4 className="text-sm font-semibold text-white mb-2">Multi-Scale Features</h4>
            <div className="space-y-1 text-xs font-mono text-slate-300">
              <div className={layer.isFeatureOutput === 'P3' ? 'text-yellow-400 font-bold' : ''}>
                P3/8 = Layer 4 = [1, 64, 80, 80] — stride 8
              </div>
              <div className={layer.isFeatureOutput === 'P4' ? 'text-yellow-400 font-bold' : ''}>
                P4/16 = Layer 6 = [1, 128, 40, 40] — stride 16
              </div>
              <div className={layer.isFeatureOutput === 'P5' ? 'text-yellow-400 font-bold' : ''}>
                P5/32 = Layer 9 = [1, 256, 20, 20] — stride 32
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
