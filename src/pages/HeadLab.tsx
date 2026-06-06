import { useState } from 'react';
import { headOutputChannels, STRIDES, FEATURE_MAP_SIZES } from '../core/yoloConfig';
import { FormulaBlock } from '../components/formula/FormulaBlock';
import { TensorDisplay } from '../components/labs/TensorDisplay';
import { createShape } from '../core/tensorShape';

export function HeadLab() {
  const [nc, setNc] = useState(2);
  const [regMax, setRegMax] = useState(16);

  const no = headOutputChannels(nc, regMax);
  const p3Points = FEATURE_MAP_SIZES.P3 ** 2;
  const p4Points = FEATURE_MAP_SIZES.P4 ** 2;
  const p5Points = FEATURE_MAP_SIZES.P5 ** 2;
  const totalPoints = p3Points + p4Points + p5Points;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Detect Head Output Lab</h1>
        <p className="text-slate-400 mt-2">
          Understanding the head output [1, {no}, H, W] and how 8400 prediction points emerge.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-4">
          <h3 className="font-semibold text-white">Parameters</h3>

          <label className="block">
            <span className="text-sm text-slate-400">Number of Classes (nc): {nc}</span>
            <input type="range" min="1" max="80" value={nc} onChange={e => setNc(+e.target.value)}
              className="w-full mt-1" />
          </label>

          <label className="block">
            <span className="text-sm text-slate-400">reg_max: {regMax}</span>
            <select value={regMax} onChange={e => setRegMax(+e.target.value)} className="w-full mt-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white">
              <option value={8}>8</option>
              <option value={16}>16 (default)</option>
              <option value={32}>32</option>
            </select>
          </label>

          <div className="bg-slate-800 rounded p-3 text-sm">
            <div className="text-slate-400">Output channels:</div>
            <div className="text-xl font-bold text-green-400">{no}</div>
            <div className="text-xs text-slate-500 mt-1">
              = nc ({nc}) + 4 × reg_max ({regMax}) = {nc} + {4 * regMax}
            </div>
          </div>

          <div className="bg-slate-800 rounded p-3 text-sm">
            <div className="text-slate-400">Channel breakdown:</div>
            <div className="text-xs text-slate-300 mt-1 space-y-1">
              <div>Box branch: 4 × {regMax} = {4 * regMax} (DFL distribution)</div>
              <div>Class branch: {nc} (class logits)</div>
              <div className="font-bold">Total: {no}</div>
            </div>
          </div>
        </div>

        {/* Output per scale */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-4">
          <h3 className="font-semibold text-white">Output Per Scale</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded-lg p-4 space-y-2">
              <div className="text-sm font-semibold text-blue-400">P3 (stride {STRIDES.P3})</div>
              <TensorDisplay shape={createShape(1, no, FEATURE_MAP_SIZES.P3, FEATURE_MAP_SIZES.P3)} color="blue" />
              <div className="text-xs text-slate-400">Grid points: {FEATURE_MAP_SIZES.P3}×{FEATURE_MAP_SIZES.P3} = {p3Points}</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 space-y-2">
              <div className="text-sm font-semibold text-purple-400">P4 (stride {STRIDES.P4})</div>
              <TensorDisplay shape={createShape(1, no, FEATURE_MAP_SIZES.P4, FEATURE_MAP_SIZES.P4)} color="purple" />
              <div className="text-xs text-slate-400">Grid points: {FEATURE_MAP_SIZES.P4}×{FEATURE_MAP_SIZES.P4} = {p4Points}</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 space-y-2">
              <div className="text-sm font-semibold text-red-400">P5 (stride {STRIDES.P5})</div>
              <TensorDisplay shape={createShape(1, no, FEATURE_MAP_SIZES.P5, FEATURE_MAP_SIZES.P5)} color="red" />
              <div className="text-xs text-slate-400">Grid points: {FEATURE_MAP_SIZES.P5}×{FEATURE_MAP_SIZES.P5} = {p5Points}</div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4">
            <div className="text-sm font-semibold text-white mb-2">Flatten & Concat</div>
            <div className="text-xs font-mono text-slate-300 space-y-1">
              <div>P3: [1, {no}, {FEATURE_MAP_SIZES.P3}, {FEATURE_MAP_SIZES.P3}] → [1, {no}, {p3Points}]</div>
              <div>P4: [1, {no}, {FEATURE_MAP_SIZES.P4}, {FEATURE_MAP_SIZES.P4}] → [1, {no}, {p4Points}]</div>
              <div>P5: [1, {no}, {FEATURE_MAP_SIZES.P5}, {FEATURE_MAP_SIZES.P5}] → [1, {no}, {p5Points}]</div>
              <div className="font-bold text-green-400 pt-2">Concat: [1, {no}, {totalPoints}]</div>
              <div className="pt-1">Split → pred_dist: [1, {4 * regMax}, {totalPoints}] | pred_score: [1, {nc}, {totalPoints}]</div>
            </div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-4">
        <h3 className="font-semibold text-white">Formula</h3>
        <FormulaBlock latex={`no = nc + 4 \\times reg\\_max = ${nc} + 4 \\times ${regMax} = ${no}`} />
        <FormulaBlock latex={`N_{total} = 80^2 + 40^2 + 20^2 = ${p3Points} + ${p4Points} + ${p5Points} = ${totalPoints}`} />
      </div>
    </div>
  );
}
