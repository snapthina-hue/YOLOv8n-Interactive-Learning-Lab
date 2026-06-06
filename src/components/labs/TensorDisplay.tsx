import type { TensorShape } from '../../core/tensorShape';
import { shapeToString } from '../../core/tensorShape';

type Props = {
  shape: TensorShape;
  label?: string;
  color?: string;
};

export function TensorDisplay({ shape, label, color = 'blue' }: Props) {
  const colorClasses: Record<string, string> = {
    blue: 'border-blue-500 bg-blue-950 text-blue-300',
    purple: 'border-purple-500 bg-purple-950 text-purple-300',
    orange: 'border-orange-500 bg-orange-950 text-orange-300',
    green: 'border-green-500 bg-green-950 text-green-300',
    red: 'border-red-500 bg-red-950 text-red-300',
  };

  return (
    <div className={`inline-block border-2 rounded-lg px-3 py-2 font-mono text-sm ${colorClasses[color] || colorClasses.blue}`}>
      {label && <div className="text-xs opacity-70 mb-1">{label}</div>}
      <div className="font-bold">{shapeToString(shape)}</div>
      <div className="text-xs opacity-60 mt-1">
        B={shape.batch} C={shape.channels} H={shape.height} W={shape.width}
      </div>
    </div>
  );
}
