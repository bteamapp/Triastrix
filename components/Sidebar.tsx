
import React from 'react';
import ObjectManager from './ObjectManager';
import PropertiesInspector from './PropertiesInspector';
import { useGeometryStore } from '../store/geometryStore';
import { Eye, EyeOff } from 'lucide-react';

export default function Sidebar() {
  const showLabels = useGeometryStore(state => state.showLabels);
  const toggleLabels = useGeometryStore(state => state.toggleLabels);

  return (
    <aside className="w-72 bg-gray-800 p-4 flex flex-col shadow-lg z-10 overflow-y-auto">
      <div className="flex items-center justify-between mb-4 border-b border-gray-600 pb-2">
        <h2 className="text-xl font-semibold text-gray-200">Scene Explorer</h2>
        <button
          onClick={toggleLabels}
          className="p-1 rounded-full text-gray-400 hover:text-white transition-colors"
          title={showLabels ? 'Hide Point Labels' : 'Show Point Labels'}
        >
          {showLabels ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>
      <div className="flex-grow mb-4">
        <ObjectManager />
      </div>
      <div className="flex-shrink-0">
        <PropertiesInspector />
      </div>
    </aside>
  );
}
