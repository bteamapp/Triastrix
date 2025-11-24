
import React from 'react';
import ObjectManager from './ObjectManager';
import PropertiesInspector from './PropertiesInspector';

export default function Sidebar() {
  return (
    <aside className="w-72 bg-gray-800 p-4 flex flex-col shadow-lg z-10 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-200 border-b border-gray-600 pb-2">Scene Explorer</h2>
      <div className="flex-grow mb-4">
        <ObjectManager />
      </div>
      <div className="flex-shrink-0">
        <PropertiesInspector />
      </div>
    </aside>
  );
}
