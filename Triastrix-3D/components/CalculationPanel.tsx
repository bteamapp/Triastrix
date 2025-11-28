import React, { useMemo } from 'react';
import { useGeometryStore } from '../store/geometryStore';
import { X, Scale, ArrowLeftRight, AreaChart, Box as BoxIcon } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import type { CalculationMode } from '../types';

const CalculationButton = ({ mode, label, icon: Icon }: { mode: CalculationMode, label: string, icon: React.ComponentType<{ size?: number }> }) => {
    const setCalculationMode = useGeometryStore(state => state.setCalculationMode);
    const currentMode = useGeometryStore(state => state.calculationMode);

    return (
        <button
            onClick={() => setCalculationMode(mode)}
            title={label}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 w-full ${
                currentMode === mode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
            }`}
        >
            <Icon size={20} />
            <span className="text-xs mt-1">{label}</span>
        </button>
    );
}

const getInstructions = (mode: CalculationMode) => {
    switch (mode) {
        case 'distance-point-point': return 'Select 2 points in the scene.';
        case 'angle-line-line': return 'Select 2 lines in the scene.';
        case 'area-polygon': return 'Select points to form a shape (3+ for area, 4 for tetrahedron volume).';
        case 'volume-solid': return 'Select 1 solid (Sphere, Cylinder, or Box).';
        default: return 'Select a calculation type above.';
    }
}

export default function CalculationPanel() {
    const { 
        toggleCalculator, 
        calculationMode, 
        calculationInputs,
        calculationResult,
        clearCalculation,
        present 
    } = useGeometryStore(useShallow(state => ({
        toggleCalculator: state.toggleCalculator,
        calculationMode: state.calculationMode,
        calculationInputs: state.calculationInputs,
        calculationResult: state.calculationResult,
        clearCalculation: state.clearCalculation,
        present: state.present
    })));

    const selectedObjectNames = useMemo(() => {
        return calculationInputs.map(id => present.find(obj => obj.id === id)?.name || 'Unknown');
    }, [calculationInputs, present]);

    return (
        <div className="absolute top-4 right-4 w-72 bg-gray-800 p-4 rounded-lg shadow-lg z-20 border border-gray-700">
            <div className="flex items-center justify-between pb-2 border-b border-gray-600">
                <h3 className="text-lg font-semibold text-gray-200">Calculator</h3>
                <button onClick={toggleCalculator} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white">
                    <X size={20} />
                </button>
            </div>

            <div className="grid grid-cols-4 gap-2 my-4">
                <CalculationButton mode="distance-point-point" label="Distance" icon={ArrowLeftRight} />
                <CalculationButton mode="angle-line-line" label="Angle" icon={Scale} />
                <CalculationButton mode="area-polygon" label="Area" icon={AreaChart} />
                <CalculationButton mode="volume-solid" label="Volume" icon={BoxIcon} />
            </div>

            <div className="bg-gray-900 p-3 rounded-md min-h-[120px] text-sm">
                <p className="text-gray-400 italic mb-2">{getInstructions(calculationMode)}</p>
                {selectedObjectNames.length > 0 && (
                     <div className="mb-2">
                        <span className="text-gray-300 font-medium">Selected: </span>
                        <span className="text-gray-400">{selectedObjectNames.join(', ')}</span>
                     </div>
                )}

                {calculationResult && (
                    <div className="mt-2 pt-2 border-t border-gray-700">
                        <p className="text-lg font-bold text-green-400 text-center whitespace-pre-wrap">{calculationResult}</p>
                    </div>
                )}
            </div>
            
            <button
                onClick={clearCalculation}
                className="w-full mt-4 py-2 bg-gray-600 text-gray-200 font-semibold rounded-lg hover:bg-gray-500 transition-colors"
            >
                Clear Selection
            </button>
        </div>
    );
}