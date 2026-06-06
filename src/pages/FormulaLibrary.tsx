import { FormulaBlock } from '../components/formula/FormulaBlock';

const formulas = [
  {
    category: 'Conv2D',
    items: [
      { name: 'Output Size', latex: 'H_{out} = \\left\\lfloor \\frac{H_{in} + 2P - K}{S} \\right\\rfloor + 1' },
      { name: 'Multi-channel Conv', latex: 'Y[o,i,j] = b[o] + \\sum_{c=0}^{C_{in}-1} \\sum_{u=0}^{K-1} \\sum_{v=0}^{K-1} X[c, iS+u-P, jS+v-P] \\cdot W[o,c,u,v]' },
      { name: 'Parameters', latex: 'Params = C_{out} \\times C_{in} \\times K \\times K' },
    ],
  },
  {
    category: 'Model Scaling',
    items: [
      { name: 'Channel Scaling', latex: 'C_{scaled} = C_{base} \\times width\\_multiple' },
      { name: 'Depth Scaling', latex: 'n_{scaled} = \\max(\\text{round}(n_{base} \\times depth\\_multiple), 1)' },
    ],
  },
  {
    category: 'C2f Module',
    items: [
      { name: 'Hidden Channel', latex: 'C_{hidden} = C_2 \\times e' },
      { name: 'Concat Channel', latex: 'C_{concat} = (2 + n) \\times C_{hidden}' },
      { name: 'Bottleneck Shortcut', latex: 'Y = X + F(X)' },
    ],
  },
  {
    category: 'Head Output',
    items: [
      { name: 'Output Channels', latex: 'no = nc + 4 \\times reg\\_max' },
      { name: 'Total Anchor Points', latex: 'N = 80^2 + 40^2 + 20^2 = 8400' },
    ],
  },
  {
    category: 'Anchor Point',
    items: [
      { name: 'Center X', latex: 'cx = (j + 0.5) \\times stride' },
      { name: 'Center Y', latex: 'cy = (i + 0.5) \\times stride' },
    ],
  },
  {
    category: 'DFL Decode',
    items: [
      { name: 'Softmax', latex: 'p_k = \\frac{e^{z_k}}{\\sum_{m=0}^{reg\\_max-1} e^{z_m}}' },
      { name: 'Expected Distance', latex: 'd = \\sum_{k=0}^{reg\\_max-1} p_k \\cdot k' },
      { name: 'Pixel Distance', latex: 'l_{px} = l \\times stride' },
    ],
  },
  {
    category: 'Box Decode',
    items: [
      { name: 'x1', latex: 'x_1 = cx - l_{px}' },
      { name: 'y1', latex: 'y_1 = cy - t_{px}' },
      { name: 'x2', latex: 'x_2 = cx + r_{px}' },
      { name: 'y2', latex: 'y_2 = cy + b_{px}' },
    ],
  },
  {
    category: 'IoU & NMS',
    items: [
      { name: 'IoU', latex: 'IoU = \\frac{Area(B_1 \\cap B_2)}{Area(B_1 \\cup B_2)}' },
      { name: 'Suppress', latex: '\\text{if } IoU(B_{best}, B_i) > T_{nms} \\Rightarrow \\text{suppress } B_i' },
    ],
  },
  {
    category: 'CIoU Loss',
    items: [
      { name: 'CIoU', latex: 'CIoU = IoU - \\frac{\\rho^2(b,b^{gt})}{c^2} - \\alpha v' },
      { name: 'Aspect Ratio', latex: 'v = \\frac{4}{\\pi^2} \\left( \\arctan\\frac{w^{gt}}{h^{gt}} - \\arctan\\frac{w}{h} \\right)^2' },
      { name: 'Alpha', latex: '\\alpha = \\frac{v}{1 - IoU + v}' },
    ],
  },
  {
    category: 'Classification',
    items: [
      { name: 'Sigmoid', latex: '\\sigma(z) = \\frac{1}{1 + e^{-z}}' },
      { name: 'BCE Loss', latex: 'BCE(z, y) = -[y \\log(\\sigma(z)) + (1-y)\\log(1-\\sigma(z))]' },
    ],
  },
  {
    category: 'Total Loss',
    items: [
      { name: 'Detection Loss', latex: 'L = \\lambda_{box} L_{box} + \\lambda_{cls} L_{cls} + \\lambda_{dfl} L_{dfl}' },
    ],
  },
  {
    category: 'Metrics',
    items: [
      { name: 'Precision', latex: 'Precision = \\frac{TP}{TP + FP}' },
      { name: 'Recall', latex: 'Recall = \\frac{TP}{TP + FN}' },
      { name: 'F1', latex: 'F1 = 2 \\cdot \\frac{Precision \\cdot Recall}{Precision + Recall}' },
      { name: 'mAP', latex: 'mAP = \\frac{1}{C} \\sum_{c=1}^{C} AP_c' },
    ],
  },
];

export function FormulaLibrary() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Formula Library</h1>
        <p className="text-slate-400 mt-2">
          Complete mathematical reference for YOLOv8n object detection pipeline.
        </p>
      </div>

      <div className="space-y-8">
        {formulas.map((cat) => (
          <section key={cat.category} className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-4">{cat.category}</h2>
            <div className="space-y-3">
              {cat.items.map((item) => (
                <div key={item.name} className="flex flex-col gap-1">
                  <span className="text-sm text-slate-400">{item.name}</span>
                  <FormulaBlock latex={item.latex} className="bg-slate-800" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
