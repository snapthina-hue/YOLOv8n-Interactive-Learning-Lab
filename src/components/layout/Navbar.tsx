import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/labs/conv', label: 'Conv Lab' },
  { path: '/labs/backbone', label: 'Backbone' },
  { path: '/labs/neck', label: 'Neck' },
  { path: '/labs/head', label: 'Head' },
  { path: '/labs/anchor', label: 'Anchor' },
  { path: '/labs/nms', label: 'NMS' },
  { path: '/formulas', label: 'Formulas' },
  { path: '/pipeline', label: 'Pipeline' },
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-slate-900 border-b border-slate-700 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto">
        <Link to="/" className="text-lg font-bold text-blue-400 mr-4 whitespace-nowrap">
          YOLOv8n Lab
        </Link>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-3 py-1.5 rounded text-sm whitespace-nowrap transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
