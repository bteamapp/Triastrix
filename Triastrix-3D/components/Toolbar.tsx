
import React from 'react';
import { MousePointer, Circle, Spline, Layers, Undo, Redo, Orbit, Database, Box as BoxIcon } from 'lucide-react';
import type { Tool, ConstructionPlane } from '../types';
import { useGeometryStore } from '../store/geometryStore';

interface ToolbarProps {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

// FIX: Change icon prop type from React.ElementType to a more specific component type
// to fix "Type 'number' is not assignable to type 'never'" error.
const ToolButton: React.FC<{ icon?: React.ComponentType<{ size?: number }>; label: string; isActive: boolean; onClick: () => void; children?: React.ReactNode }> = ({ icon: Icon, label, isActive, onClick, children }) => (
  <button
    onClick={onClick}
    title={label}
    className={`w-12 h-12 flex items-center justify-center rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
    }`}
  >
    {Icon && <Icon size={24} />}
    {children}
  </button>
);


// FIX: Change icon prop type from React.ElementType to a more specific component type
// to fix "Type 'number' is not assignable to type 'never'" error.
const ActionButton: React.FC<{ icon: React.ComponentType<{ size?: number }>; label: string; onClick: () => void; disabled: boolean; }> = ({ icon: Icon, label, onClick, disabled }) => (
  <button
    onClick={onClick}
    title={label}
    disabled={disabled}
    className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-700 text-gray-300 transition-colors duration-200 enabled:hover:bg-gray-600 enabled:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <Icon size={24} />
  </button>
);


export default function Toolbar({ activeTool, setActiveTool, undo, redo, canUndo, canRedo }: ToolbarProps) {
  const constructionPlane = useGeometryStore(state => state.constructionPlane);
  const setConstructionPlane = useGeometryStore(state => state.setConstructionPlane);
  
  return (
    <aside className="w-20 bg-gray-800 p-2 flex flex-col items-center space-y-4 shadow-lg z-10">
      <img src="data:image/svg+xml,<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><path d='M 50,10 L 95,35 L 50,60 L 5,35 Z' fill='%2360a5fa'/><path d='M 5,35 L 50,60 L 50,90 L 5,65 Z' fill='%233b82f6'/><path d='M 95,35 L 50,60 L 50,90 L 95,65 Z' fill='%232563eb'/><text x='50' y='36' font-family='Arial, sans-serif' font-size='26' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle' fill-opacity='0.95' transform='skewX(-20) rotate(-10 50 36)'>Tx</text></svg>" alt="Triastrix Logo" className="w-12 h-12" />
      
      <div className="flex flex-col space-y-2">
        <h3 className="text-xs text-gray-400 uppercase tracking-wider text-center">Tools</h3>
        <ToolButton icon={MousePointer} label="Select" isActive={activeTool === 'select'} onClick={() => setActiveTool('select')} />
        <ToolButton icon={Circle} label="Point" isActive={activeTool === 'point'} onClick={() => setActiveTool('point')} />
        <ToolButton icon={Spline} label="Line" isActive={activeTool === 'line'} onClick={() => setActiveTool('line')} />
        <ToolButton icon={Layers} label="Plane" isActive={activeTool === 'plane'} onClick={() => setActiveTool('plane')} />
        <div className="border-t border-gray-600 my-2 !mt-4 !mb-4"></div>
        <ToolButton icon={Orbit} label="Sphere" isActive={activeTool === 'sphere'} onClick={() => setActiveTool('sphere')} />
        <ToolButton icon={Database} label="Cylinder" isActive={activeTool === 'cylinder'} onClick={() => setActiveTool('cylinder')} />
        <ToolButton icon={BoxIcon} label="Box" isActive={activeTool === 'box'} onClick={() => setActiveTool('box')} />
      </div>

      <div className="border-t border-gray-600 w-full my-2"></div>

      <div className="flex flex-col space-y-2">
         <h3 className="text-xs text-gray-400 uppercase tracking-wider text-center">Plane</h3>
         <ToolButton label="XZ Plane" isActive={constructionPlane === 'xz'} onClick={() => setConstructionPlane('xz')}><span className="font-mono text-sm">XZ</span></ToolButton>
         <ToolButton label="XY Plane" isActive={constructionPlane === 'xy'} onClick={() => setConstructionPlane('xy')}><span className="font-mono text-sm">XY</span></ToolButton>
         <ToolButton label="YZ Plane" isActive={constructionPlane === 'yz'} onClick={() => setConstructionPlane('yz')}><span className="font-mono text-sm">YZ</span></ToolButton>
      </div>

      <div className="flex-grow"></div>
      <div className="flex flex-col space-y-2">
         <ActionButton icon={Undo} label="Undo" onClick={undo} disabled={!canUndo} />
         <ActionButton icon={Redo} label="Redo" onClick={redo} disabled={!canRedo} />
      </div>
    </aside>
  );
}