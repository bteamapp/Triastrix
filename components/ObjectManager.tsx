import React from 'react';
import { useGeometryStore } from '../store/geometryStore';
import { Trash2, Circle, Spline, Layers, Orbit, Database, Box as BoxIcon } from 'lucide-react';
import type { GeometricObject } from '../types';

const ObjectIcon = ({ type }: { type: GeometricObject['type'] }) => {
  switch (type) {
    case 'point': return <Circle className="w-4 h-4 text-blue-400" />;
    case 'line': return <Spline className="w-4 h-4 text-green-400" />;
    case 'plane': return <Layers className="w-4 h-4 text-purple-400" />;
    case 'sphere': return <Orbit className="w-4 h-4 text-orange-400" />;
    case 'cylinder': return <Database className="w-4 h-4 text-yellow-400" />;
    case 'box': return <BoxIcon className="w-4 h-4 text-red-400" />;
    default: return null;
  }
};

export default function ObjectManager() {
  const objects = useGeometryStore(state => state.present);
  const selectedObjectId = useGeometryStore(state => state.selectedObjectId);
  const setSelectedObjectId = useGeometryStore(state => state.setSelectedObjectId);
  const removeObject = useGeometryStore(state => state.removeObject);

  if (objects.length === 0) {
    return <div className="text-gray-500 text-sm text-center mt-4">No objects in the scene.</div>;
  }

  return (
    <div className="space-y-1">
      {objects.map(obj => (
        <div
          key={obj.id}
          onClick={() => setSelectedObjectId(obj.id)}
          className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors duration-150 ${
            selectedObjectId === obj.id ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}
        >
          <div className="flex items-center space-x-2 truncate">
            <ObjectIcon type={obj.type} />
            <span className="text-sm truncate">{obj.name}</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); removeObject(obj.id); }}
            className="p-1 rounded-full text-gray-400 hover:bg-red-500 hover:text-white transition-colors duration-150 flex-shrink-0"
            title="Delete Object"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}