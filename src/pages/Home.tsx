import { Link } from 'react-router-dom';

const modules = [
  { path: '/labs/conv', title: 'Conv2D Lab', desc: 'Understand convolution operation, kernel, stride, padding', color: 'bg-blue-600' },
  { path: '/labs/backbone', title: 'Backbone Visualizer', desc: 'Layer-by-layer backbone from [1,3,640,640] to P3/P4/P5', color: 'bg-blue-700' },
  { path: '/labs/neck', title: 'Neck Fusion', desc: 'Top-down & bottom-up multi-scale feature fusion', color: 'bg-purple-600' },
  { path: '/labs/head', title: 'Detect Head', desc: 'Understand output [1,66,H,W] and 8400 anchor points', color: 'bg-red-600' },
  { path: '/labs/anchor', title: 'Anchor + Box Decode', desc: 'Grid to coordinates, DFL decode, l/t/r/b to xyxy', color: 'bg-green-600' },
  { path: '/labs/nms', title: 'NMS Lab', desc: 'Non-Maximum Suppression: IoU calculation & box filtering', color: 'bg-orange-600' },
  { path: '/formulas', title: 'Formula Library', desc: 'All mathematical formulas used in YOLOv8n', color: 'bg-slate-600' },
  { path: '/pipeline', title: 'End-to-End Pipeline', desc: 'Complete forward pass from image to final detections', color: 'bg-indigo-600' },
];

export function Home() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          YOLOv8n Interactive Learning Lab
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-2">
          From Image Pixels to Object Detection Output
        </p>
        <p className="text-slate-500 max-w-3xl mx-auto">
          Pahami proses object detection YOLOv8n secara visual, matematis, dan layer-by-layer.
          Ubah parameter, lihat rumus berubah, lihat shape tensor berubah.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/labs/conv" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 font-medium transition-colors">
            Start Learning
          </Link>
          <Link to="/formulas" className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 font-medium transition-colors">
            Formula Library
          </Link>
        </div>
      </section>

      {/* Learning Path */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Learning Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => (
            <Link
              key={mod.path}
              to={mod.path}
              className="group block p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition-all"
            >
              <div className={`w-3 h-3 rounded-full ${mod.color} mb-3`} />
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                {mod.title}
              </h3>
              <p className="text-sm text-slate-400 mt-1">{mod.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Summary */}
      <section className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-4">YOLOv8n at a Glance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3">
            <div className="text-2xl font-bold text-blue-400">640×640</div>
            <div className="text-xs text-slate-400">Input Size</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-bold text-purple-400">8,400</div>
            <div className="text-xs text-slate-400">Anchor Points</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-bold text-green-400">3 Scales</div>
            <div className="text-xs text-slate-400">P3/P4/P5</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-bold text-orange-400">3.2M</div>
            <div className="text-xs text-slate-400">Parameters</div>
          </div>
        </div>
      </section>
    </div>
  );
}
