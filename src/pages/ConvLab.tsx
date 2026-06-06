import { useState, useRef, useEffect } from 'react';
import p5 from 'p5';
import { convOutputSize, convParams } from '../core/convMath';
import { FormulaBlock } from '../components/formula/FormulaBlock';
import { TensorDisplay } from '../components/labs/TensorDisplay';
import { createShape } from '../core/tensorShape';

export function ConvLab() {
  const [inputSize, setInputSize] = useState(8);
  const [kernel, setKernel] = useState(3);
  const [stride, setStride] = useState(2);
  const [padding, setPadding] = useState(1);
  const [inChannels, setInChannels] = useState(3);
  const [outChannels, setOutChannels] = useState(16);
  const canvasRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  const outputSize = convOutputSize(inputSize, kernel, stride, padding);
  const params = convParams(inChannels, outChannels, kernel);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (p5Ref.current) {
      p5Ref.current.remove();
    }

    const sketch = (p: p5) => {
      const cellSize = Math.min(28, 300 / Math.max(inputSize, outputSize));
      const gap = 60;

      p.setup = () => {
        const totalW = inputSize * cellSize + gap + outputSize * cellSize + 40;
        p.createCanvas(Math.max(totalW, 500), Math.max(inputSize * cellSize, outputSize * cellSize) + 60);
      };

      p.draw = () => {
        p.background(15, 23, 42);

        // Draw input grid
        p.push();
        p.translate(20, 30);
        p.fill(200);
        p.noStroke();
        p.textSize(11);
        p.text(`Input ${inputSize}×${inputSize}`, 0, -10);

        for (let i = 0; i < inputSize; i++) {
          for (let j = 0; j < inputSize; j++) {
            p.fill(30, 64, 175, 150);
            p.stroke(59, 130, 246);
            p.strokeWeight(1);
            p.rect(j * cellSize, i * cellSize, cellSize - 1, cellSize - 1, 2);
          }
        }

        // Draw kernel overlay
        const kRow = Math.floor(p.frameCount / 10) % Math.max(1, inputSize - kernel + 2 * padding + 1);
        const kCol = Math.floor(p.frameCount / 5) % Math.max(1, inputSize - kernel + 2 * padding + 1);
        const startR = kRow * stride - padding;
        const startC = kCol * stride - padding;

        p.fill(250, 204, 21, 80);
        p.stroke(250, 204, 21);
        p.strokeWeight(2);
        for (let u = 0; u < kernel; u++) {
          for (let v = 0; v < kernel; v++) {
            const r = startR + u;
            const c = startC + v;
            if (r >= 0 && r < inputSize && c >= 0 && c < inputSize) {
              p.rect(c * cellSize, r * cellSize, cellSize - 1, cellSize - 1, 2);
            }
          }
        }
        p.pop();

        // Draw output grid
        p.push();
        p.translate(20 + inputSize * cellSize + gap, 30);
        p.fill(200);
        p.noStroke();
        p.textSize(11);
        p.text(`Output ${outputSize}×${outputSize}`, 0, -10);

        for (let i = 0; i < outputSize; i++) {
          for (let j = 0; j < outputSize; j++) {
            p.fill(22, 78, 99, 150);
            p.stroke(34, 211, 238);
            p.strokeWeight(1);
            p.rect(j * cellSize, i * cellSize, cellSize - 1, cellSize - 1, 2);
          }
        }
        p.pop();

        // Arrow
        const arrowX = 20 + inputSize * cellSize + gap / 2;
        const arrowY = (Math.max(inputSize, outputSize) * cellSize) / 2 + 30;
        p.stroke(148, 163, 184);
        p.strokeWeight(2);
        p.line(arrowX - 15, arrowY, arrowX + 15, arrowY);
        p.line(arrowX + 10, arrowY - 5, arrowX + 15, arrowY);
        p.line(arrowX + 10, arrowY + 5, arrowX + 15, arrowY);
      };
    };

    p5Ref.current = new p5(sketch, canvasRef.current);

    return () => {
      p5Ref.current?.remove();
      p5Ref.current = null;
    };
  }, [inputSize, kernel, stride, padding, outputSize]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Conv2D Interactive Lab</h1>
        <p className="text-slate-400 mt-2">
          Understand how convolution transforms tensor shape with kernel, stride, and padding.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-4">
          <h3 className="font-semibold text-white">Parameters</h3>

          <label className="block">
            <span className="text-sm text-slate-400">Input Size: {inputSize}</span>
            <input type="range" min="4" max="32" value={inputSize} onChange={e => setInputSize(+e.target.value)}
              className="w-full mt-1" />
          </label>

          <label className="block">
            <span className="text-sm text-slate-400">Kernel: {kernel}</span>
            <select value={kernel} onChange={e => setKernel(+e.target.value)} className="w-full mt-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white">
              <option value={1}>1</option>
              <option value={3}>3</option>
              <option value={5}>5</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-slate-400">Stride: {stride}</span>
            <select value={stride} onChange={e => setStride(+e.target.value)} className="w-full mt-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white">
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-slate-400">Padding: {padding}</span>
            <select value={padding} onChange={e => setPadding(+e.target.value)} className="w-full mt-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white">
              <option value={0}>0</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-slate-400">Input Channels: {inChannels}</span>
            <select value={inChannels} onChange={e => setInChannels(+e.target.value)} className="w-full mt-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white">
              <option value={1}>1 (Grayscale)</option>
              <option value={3}>3 (RGB)</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-slate-400">Output Filters: {outChannels}</span>
            <select value={outChannels} onChange={e => setOutChannels(+e.target.value)} className="w-full mt-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white">
              <option value={1}>1</option>
              <option value={4}>4</option>
              <option value={16}>16</option>
              <option value={32}>32</option>
              <option value={64}>64</option>
            </select>
          </label>
        </div>

        {/* Canvas */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl p-5 border border-slate-800">
          <div ref={canvasRef} className="flex justify-center" />

          <div className="mt-4 flex flex-wrap gap-3">
            <TensorDisplay shape={createShape(1, inChannels, inputSize, inputSize)} label="Input" color="blue" />
            <span className="self-center text-slate-500 text-2xl">→</span>
            <TensorDisplay shape={createShape(1, outChannels, outputSize, outputSize)} label="Output" color="green" />
          </div>
        </div>
      </div>

      {/* Formula Section */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-4">
        <h3 className="font-semibold text-white">Formula</h3>
        <FormulaBlock latex={`H_{out} = \\left\\lfloor \\frac{H_{in} + 2P - K}{S} \\right\\rfloor + 1 = \\left\\lfloor \\frac{${inputSize} + 2(${padding}) - ${kernel}}{${stride}} \\right\\rfloor + 1 = ${outputSize}`} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
          <div className="bg-slate-800 rounded p-3">
            <div className="text-slate-400 mb-1">Parameters (no bias):</div>
            <FormulaBlock latex={`Params = C_{out} \\times C_{in} \\times K^2 = ${outChannels} \\times ${inChannels} \\times ${kernel}^2 = ${params}`} className="bg-slate-900" />
          </div>
          <div className="bg-slate-800 rounded p-3">
            <div className="text-slate-400 mb-1">Why channel changes:</div>
            <p>This layer has <strong>{outChannels} filters</strong>. Each filter reads all {inChannels} input channel(s) and produces 1 output feature map.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
