import React from 'react';
import ObjectManager from './ObjectManager';
import PropertiesInspector from './PropertiesInspector';
import { useGeometryStore } from '../store/geometryStore';
import { Eye, EyeOff, Save, FolderOpen } from 'lucide-react';

interface SidebarProps {
  onOpenFile: () => void;
}

export default function Sidebar({ onOpenFile }: SidebarProps) {
  const showLabels = useGeometryStore(state => state.showLabels);
  const toggleLabels = useGeometryStore(state => state.toggleLabels);
  const objects = useGeometryStore(state => state.present);

  const handleSaveProject = () => {
    if (objects.length === 0) {
      alert("Scene is empty. Add some objects to save.");
      return;
    }
    const data = JSON.stringify(objects, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.trix3d';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <aside className="w-72 bg-gray-100 dark:bg-gray-800 p-4 flex flex-col shadow-lg z-10 overflow-y-auto border-l border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center justify-between mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Scene Explorer</h2>
        <div className="flex items-center space-x-1">
          <button
            onClick={handleSaveProject}
            className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
            title="Save Project"
          >
            <Save size={18} />
          </button>
          <button
            onClick={onOpenFile}
            className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
            title="Open Project"
          >
            <FolderOpen size={18} />
          </button>
          <button
            onClick={toggleLabels}
            className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
            title={showLabels ? 'Hide Point Labels' : 'Show Point Labels'}
          >
            {showLabels ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
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