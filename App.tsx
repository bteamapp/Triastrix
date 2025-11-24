
import React, { Suspense } from 'react';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import ThreeCanvas from './components/ThreeCanvas';
import { useGeometryStore } from './store/geometryStore';
import type { Tool } from './types';

export default function App() {
  const activeTool = useGeometryStore(state => state.activeTool);
  const setActiveTool = useGeometryStore(state => state.setActiveTool);
  const undo = useGeometryStore(state => state.undo);
  const redo = useGeometryStore(state => state.redo);
  const canUndo = useGeometryStore(state => state.past.length > 0);
  const canRedo = useGeometryStore(state => state.future.length > 0);

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-gray-200 font-sans">
      <Toolbar activeTool={activeTool} setActiveTool={setActiveTool} undo={undo} redo={redo} canUndo={canUndo} canRedo={canRedo} />
      <main className="flex-1 relative">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-gray-800"><p>Loading 3D Scene...</p></div>}>
          <ThreeCanvas />
        </Suspense>
      </main>
      <Sidebar />
    </div>
  );
}
