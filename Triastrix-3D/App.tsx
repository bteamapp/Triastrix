import React, { Suspense, useState, useCallback, useEffect } from 'react';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import ThreeCanvas from './components/ThreeCanvas';
import WelcomeModal from './components/WelcomeModal';
import CalculationPanel from './components/CalculationPanel';
import { useGeometryStore } from './store/geometryStore';
import type { GeometricObject } from './types';

export default function App() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const activeTool = useGeometryStore(state => state.activeTool);
  const setActiveTool = useGeometryStore(state => state.setActiveTool);
  const loadProject = useGeometryStore(state => state.loadProject);
  const isCalculatorOpen = useGeometryStore(state => state.isCalculatorOpen);
  const theme = useGeometryStore(state => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleOpenFile = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.trix3d,application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const fileContent = event.target?.result;
          if (typeof fileContent !== 'string') {
            throw new Error('File content is not a string.');
          }
          const objects = JSON.parse(fileContent) as GeometricObject[];
          // Basic validation
          if (Array.isArray(objects)) {
            loadProject(objects);
            setShowWelcomeModal(false);
          } else {
            throw new Error('Invalid file format.');
          }
        } catch (error) {
          console.error("Failed to load or parse project file:", error);
          alert("Error: Could not load the project file. It may be invalid or corrupted.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [loadProject]);

  return (
    <>
      {showWelcomeModal && (
        <WelcomeModal 
          onNewProject={() => setShowWelcomeModal(false)}
          onOpenProject={handleOpenFile}
        />
      )}
      <div className="flex h-screen w-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-200 font-sans transition-colors duration-200">
        <Toolbar activeTool={activeTool} setActiveTool={setActiveTool} />
        <main className="flex-1 relative">
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"><p>Loading 3D Scene...</p></div>}>
            <ThreeCanvas />
          </Suspense>
          {isCalculatorOpen && <CalculationPanel />}
        </main>
        <Sidebar onOpenFile={handleOpenFile} />
      </div>
    </>
  );
}