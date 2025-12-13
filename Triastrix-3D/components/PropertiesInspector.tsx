import React, { useState } from 'react';
import { useGeometryStore } from '../store/geometryStore';
import type { GeometricObject, Point, Sphere, Cylinder, Box, Plane, Line } from '../types';

const NumberInput: React.FC<{ label: string; value: number; onChange: (val: number) => void }> = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between">
    <label className="text-xs text-gray-500 dark:text-gray-400 w-4 font-medium">{label}</label>
    <input
      type="number"
      step="0.1"
      value={Number.isFinite(value) ? value : ''}
      onChange={(e) => onChange(e.target.valueAsNumber || 0)}
      className="w-full ml-2 bg-white border border-gray-300 text-gray-900 dark:bg-gray-900 dark:border-transparent dark:text-gray-100 text-sm rounded p-1 text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  </div>
);

const PositionProperties: React.FC<{ object: { id: string; position: [number, number, number] } }> = ({ object }) => {
  const updateObject = useGeometryStore(state => state.updateObject);

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    const newPosition: [number, number, number] = [object.position[0], object.position[1], object.position[2]];
    if (axis === 'x') newPosition[0] = value;
    if (axis === 'y') newPosition[1] = value;
    if (axis === 'z') newPosition[2] = value;
    updateObject(object.id, { position: newPosition });
  };
  
  return (
    <div className="space-y-2">
      <h4 className="font-bold text-sm text-gray-700 dark:text-gray-200">Position</h4>
      <div className="space-y-1">
        <NumberInput label="X" value={object.position[0]} onChange={(v) => handlePositionChange('x', v)} />
        <NumberInput label="Y" value={object.position[1]} onChange={(v) => handlePositionChange('y', v)} />
        <NumberInput label="Z" value={object.position[2]} onChange={(v) => handlePositionChange('z', v)} />
      </div>
    </div>
  );
};

const PointProperties: React.FC<{ object: Point }> = ({ object }) => {
  return <PositionProperties object={object} />;
};

const LineProperties: React.FC<{ object: Line }> = ({ object }) => {
  const allObjects = useGeometryStore(state => state.present);
  const addPointOnLine = useGeometryStore(state => state.addPointOnLine);
  const [customRatio, setCustomRatio] = useState(0.5);

  const startPoint = allObjects.find(o => o.id === object.startPointId);
  const startPointName = startPoint?.name || 'Unknown';
  const endPointName = allObjects.find(o => o.id === object.endPointId)?.name || 'Unknown';

  const handleAddPoint = (ratio: number) => {
    if (isNaN(ratio) || ratio < 0 || ratio > 1) {
        alert("Ratio must be between 0 and 1.");
        return;
    }
    addPointOnLine(object.id, ratio);
  };

  const handleRatioInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.valueAsNumber;
      setCustomRatio(isNaN(val) ? 0 : val);
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-bold text-sm text-gray-700 dark:text-gray-200">Endpoints</h4>
        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 mt-1 pl-2">
          <li>{startPointName}</li>
          <li>{endPointName}</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-sm text-gray-700 dark:text-gray-200">Subdivide Line</h4>
        <div className="mt-2 space-y-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">Add a point at a ratio from {startPointName}.</p>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => handleAddPoint(0.5)} className="px-2 py-1 text-xs bg-gray-200 text-gray-800 hover:bg-blue-200 dark:bg-gray-600 dark:text-gray-200 rounded dark:hover:bg-blue-600 transition-colors">Midpoint</button>
            <button onClick={() => handleAddPoint(1/3)} className="px-2 py-1 text-xs bg-gray-200 text-gray-800 hover:bg-blue-200 dark:bg-gray-600 dark:text-gray-200 rounded dark:hover:bg-blue-600 transition-colors">1/3</button>
            <button onClick={() => handleAddPoint(2/3)} className="px-2 py-1 text-xs bg-gray-200 text-gray-800 hover:bg-blue-200 dark:bg-gray-600 dark:text-gray-200 rounded dark:hover:bg-blue-600 transition-colors">2/3</button>
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <input 
              type="number" 
              step="0.01" 
              min="0" 
              max="1" 
              value={customRatio}
              onChange={handleRatioInputChange}
              className="w-full bg-white border border-gray-300 text-gray-900 dark:bg-gray-900 dark:border-transparent dark:text-white text-sm rounded p-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. 0.25"
            />
            <button onClick={() => handleAddPoint(customRatio)} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex-shrink-0">Add</button>
          </div>
        </div>
      </div>
    </div>
  );
};


const PlaneProperties: React.FC<{ object: Plane }> = ({ object }) => {
    const allObjects = useGeometryStore(state => state.present);
    const pointNames = object.pointIds.map(id => allObjects.find(obj => obj.id === id)?.name || 'Unknown Point');

    return (
        <div>
            <h4 className="font-bold text-sm text-gray-700 dark:text-gray-200">Defining Points</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 mt-1">
                {pointNames.map((name, index) => <li key={index}>{name}</li>)}
            </ul>
        </div>
    );
};

const SphereProperties: React.FC<{ object: Sphere }> = ({ object }) => {
  const updateObject = useGeometryStore(state => state.updateObject);
  return (
    <div className="space-y-4">
      <PositionProperties object={object} />
      <div>
        <h4 className="font-bold text-sm text-gray-700 dark:text-gray-200">Parameters</h4>
        <div className="mt-2">
          <NumberInput label="R" value={object.radius} onChange={(v) => updateObject(object.id, { radius: v })} />
        </div>
      </div>
    </div>
  );
};

const CylinderProperties: React.FC<{ object: Cylinder }> = ({ object }) => {
  const updateObject = useGeometryStore(state => state.updateObject);
  return (
    <div className="space-y-4">
      <PositionProperties object={object} />
      <div>
        <h4 className="font-bold text-sm text-gray-700 dark:text-gray-200">Parameters</h4>
        <div className="mt-2 space-y-1">
          <NumberInput label="R" value={object.radius} onChange={(v) => updateObject(object.id, { radius: v })} />
          <NumberInput label="H" value={object.height} onChange={(v) => updateObject(object.id, { height: v })} />
        </div>
      </div>
    </div>
  );
};

const BoxProperties: React.FC<{ object: Box }> = ({ object }) => {
  const updateObject = useGeometryStore(state => state.updateObject);

  const handleSizeChange = (axisIndex: 0 | 1 | 2, value: number) => {
    const newSize: [number, number, number] = [object.size[0], object.size[1], object.size[2]];
    newSize[axisIndex] = value;
    updateObject(object.id, { size: newSize });
  };

  return (
    <div className="space-y-4">
      <PositionProperties object={object} />
      <div>
        <h4 className="font-bold text-sm text-gray-700 dark:text-gray-200">Size</h4>
        <div className="mt-2 space-y-1">
          <NumberInput label="W" value={object.size[0]} onChange={(v) => handleSizeChange(0, v)} />
          <NumberInput label="H" value={object.size[1]} onChange={(v) => handleSizeChange(1, v)} />
          <NumberInput label="D" value={object.size[2]} onChange={(v) => handleSizeChange(2, v)} />
        </div>
      </div>
    </div>
  );
};

export default function PropertiesInspector() {
  const selectedObjectId = useGeometryStore(state => state.selectedObjectId);
  const objects = useGeometryStore(state => state.present);
  const updateObject = useGeometryStore(state => state.updateObject);
  
  const selectedObject = objects.find(obj => obj.id === selectedObjectId);

  if (!selectedObject) {
    return (
      <div className="bg-white border border-gray-200 dark:bg-gray-700 dark:border-transparent p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300">Properties</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Select an object to see its properties.</p>
      </div>
    );
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateObject(selectedObject.id, { name: e.target.value });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateObject(selectedObject.id, { color: e.target.value });
  }

  return (
    <div className="bg-white border border-gray-200 dark:bg-gray-700 dark:border-transparent p-4 rounded-lg space-y-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-2">Properties</h3>
      <div className="space-y-1">
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Name</label>
        <input
          type="text"
          value={selectedObject.name}
          onChange={handleNameChange}
          className="w-full bg-white border border-gray-300 text-gray-900 dark:bg-gray-900 dark:border-transparent dark:text-white text-sm rounded p-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
       <div className="flex items-center justify-between">
        <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Color</label>
        <input
            type="color"
            value={selectedObject.color}
            onChange={handleColorChange}
            className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
        />
      </div>
      {selectedObject.type === 'point' && <PointProperties object={selectedObject} />}
      {selectedObject.type === 'line' && <LineProperties object={selectedObject as Line} />}
      {selectedObject.type === 'plane' && <PlaneProperties object={selectedObject as Plane} />}
      {selectedObject.type === 'sphere' && <SphereProperties object={selectedObject as Sphere} />}
      {selectedObject.type === 'cylinder' && <CylinderProperties object={selectedObject as Cylinder} />}
      {selectedObject.type === 'box' && <BoxProperties object={selectedObject as Box} />}
    </div>
  );
}