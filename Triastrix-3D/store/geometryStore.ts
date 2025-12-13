import { create } from 'zustand';
import * as THREE from 'three';
import type { Tool, GeometricObject, Point, Line, Plane, Sphere, Cylinder, Box, ConstructionPlane, CalculationMode } from '../types';

type AddObjectPayload =
    | Omit<Point, 'id' | 'name' | 'color'>
    | Omit<Line, 'id' | 'name' | 'color'>
    | Omit<Plane, 'id' | 'name' | 'color'>
    | Omit<Sphere, 'id' | 'name' | 'color'>
    | Omit<Cylinder, 'id' | 'name' | 'color'>
    | Omit<Box, 'id' | 'name' | 'color'>;

interface GeometryState {
  past: GeometricObject[][];
  present: GeometricObject[];
  future: GeometricObject[][];
  activeTool: Tool;
  selectedObjectId: string | null;
  tempLinePoints: string[];
  tempShapePoints: string[];
  constructionPlane: ConstructionPlane;
  showLabels: boolean;
  isCalculatorOpen: boolean;
  calculationMode: CalculationMode;
  calculationInputs: string[];
  calculationResult: string | null;
  theme: 'light' | 'dark';
  
  setActiveTool: (tool: Tool) => void;
  setConstructionPlane: (plane: ConstructionPlane) => void;
  setSelectedObjectId: (id: string | null) => void;
  toggleLabels: () => void;
  
  addObject: (obj: AddObjectPayload) => void;
  updateObject: (id: string, updates: Partial<GeometricObject>) => void;
  removeObject: (id: string) => void;
  loadProject: (objects: GeometricObject[]) => void;
  
  addPointOnLine: (lineId: string, ratio: number) => void;
  addTempLinePoint: (id: string) => void;
  clearTempLinePoints: () => void;
  addTempShapePoint: (id: string) => void;
  clearTempShapePoints: () => void;

  undo: () => void;
  redo: () => void;

  toggleCalculator: () => void;
  setCalculationMode: (mode: CalculationMode) => void;
  addCalculationInput: (id: string) => void;
  clearCalculation: () => void;

  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const getSystemTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark'; // Default fallback
};

const useGeometryStore = create<GeometryState>((set, get) => ({
  past: [],
  present: [],
  future: [],
  activeTool: 'select',
  selectedObjectId: null,
  tempLinePoints: [],
  tempShapePoints: [],
  constructionPlane: 'xz',
  showLabels: true,
  isCalculatorOpen: false,
  calculationMode: null,
  calculationInputs: [],
  calculationResult: null,
  theme: getSystemTheme(),

  setActiveTool: (tool) => set({ 
    activeTool: tool, 
    selectedObjectId: null, 
    tempLinePoints: [], 
    tempShapePoints: [],
    isCalculatorOpen: false,
    calculationMode: null,
    calculationInputs: [],
    calculationResult: null,
  }),
  setConstructionPlane: (plane) => set({ constructionPlane: plane }),
  setSelectedObjectId: (id) => set({ selectedObjectId: id }),
  toggleLabels: () => set(state => ({ showLabels: !state.showLabels })),
  
  addTempLinePoint: (id) => set(state => ({ tempLinePoints: [...state.tempLinePoints, id] })),
  clearTempLinePoints: () => set({ tempLinePoints: [] }),

  addTempShapePoint: (id) => set(state => ({ tempShapePoints: [...state.tempShapePoints, id] })),
  clearTempShapePoints: () => set({ tempShapePoints: [] }),

  addObject: (objData) => {
    const newId = `${objData.type}-${Date.now()}`;
    const count = get().present.filter(o => o.type === objData.type).length + 1;
    
    const newObject: GeometricObject = {
      ...objData,
      id: newId,
      name: `${objData.type.charAt(0).toUpperCase() + objData.type.slice(1)} ${count}`,
      color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
    } as GeometricObject;

    set(state => {
      const newPresent = [...state.present, newObject];
      return {
        past: [...state.past, state.present],
        present: newPresent,
        future: [],
      };
    });
  },

  updateObject: (id, updates) => {
    set(state => {
      const newPresent = state.present.map(obj =>
        obj.id === id ? ({ ...obj, ...updates } as GeometricObject) : obj
      );
      if (JSON.stringify(newPresent) === JSON.stringify(state.present)) {
        return state;
      }
      return {
        past: [...state.past, state.present],
        present: newPresent,
        future: [],
      };
    });
  },

  removeObject: (id) => {
    set(state => {
       const newPresent = state.present.filter(obj => obj.id !== id);
       const finalPresent = newPresent.filter(obj => {
         switch (obj.type) {
           case 'line':
             return obj.startPointId !== id && obj.endPointId !== id;
           case 'plane':
             return !obj.pointIds.includes(id);
           default:
             return true;
         }
       });

      return {
        past: [...state.past, state.present],
        present: finalPresent,
        future: [],
        selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId,
      };
    });
  },

  loadProject: (objects) => {
    set({
      present: objects,
      past: [],
      future: [],
      selectedObjectId: null,
      tempLinePoints: [],
      tempShapePoints: [],
    });
  },

  addPointOnLine: (lineId, ratio) => {
    const { present, addObject } = get();
    
    const t = Math.max(0, Math.min(1, ratio));

    const line = present.find(o => o.id === lineId && o.type === 'line') as Line | undefined;
    if (!line) {
        console.error("Line not found for subdivision");
        return;
    }

    const startPoint = present.find(o => o.id === line.startPointId && o.type === 'point') as Point | undefined;
    const endPoint = present.find(o => o.id === line.endPointId && o.type === 'point') as Point | undefined;

    if (!startPoint || !endPoint) {
        console.error("Endpoints not found for line subdivision");
        return;
    }
    
    const p1 = new THREE.Vector3(...startPoint.position);
    const p2 = new THREE.Vector3(...endPoint.position);
    
    const newPositionVec = new THREE.Vector3().lerpVectors(p1, p2, t);
    const newPosition: [number, number, number] = [newPositionVec.x, newPositionVec.y, newPositionVec.z];
    
    addObject({ type: 'point', position: newPosition });
  },

  undo: () => {
    set(state => {
      if (state.past.length === 0) return {};
      const newPast = state.past.slice(0, state.past.length - 1);
      const newPresent = state.past[state.past.length - 1];
      const newFuture = [state.present, ...state.future];
      return {
        past: newPast,
        present: newPresent,
        future: newFuture,
        selectedObjectId: null,
      };
    });
  },

  redo: () => {
    set(state => {
      if (state.future.length === 0) return {};
      const newPresent = state.future[0];
      const newFuture = state.future.slice(1);
      const newPast = [...state.past, state.present];
      return {
        past: newPast,
        present: newPresent,
        future: newFuture,
        selectedObjectId: null,
      };
    });
  },

  toggleCalculator: () => set(state => {
    const isOpen = !state.isCalculatorOpen;
    return { 
      isCalculatorOpen: isOpen,
      calculationMode: isOpen ? state.calculationMode : null,
      calculationInputs: isOpen ? state.calculationInputs : [],
      calculationResult: isOpen ? state.calculationResult : null,
      activeTool: isOpen ? 'select' : state.activeTool,
      selectedObjectId: null,
    };
  }),

  setCalculationMode: (mode) => set({
    calculationMode: mode,
    calculationInputs: [],
    calculationResult: null,
    selectedObjectId: null,
  }),
  
  clearCalculation: () => set({
    calculationInputs: [],
    calculationResult: null,
  }),

  addCalculationInput: (id) => {
    const { calculationMode, calculationInputs, present } = get();
    if (!calculationMode) return;

    if (calculationInputs.includes(id)) return;

    const newInputs = [...calculationInputs, id];
    set({ calculationInputs: newInputs });

    const objects = newInputs.map(inputId => present.find(obj => obj.id === inputId)).filter(Boolean) as GeometricObject[];

    let result: string | null = null;
    try {
      switch (calculationMode) {
        case 'distance-point-point':
          if (objects.length === 2 && objects.every(o => o.type === 'point')) {
            const p1 = new THREE.Vector3(...(objects[0] as Point).position);
            const p2 = new THREE.Vector3(...(objects[1] as Point).position);
            result = `Distance: ${p1.distanceTo(p2).toFixed(3)}`;
          }
          break;
        case 'angle-line-line':
          if (objects.length === 2 && objects.every(o => o.type === 'line')) {
            const line1 = objects[0] as Line;
            const line2 = objects[1] as Line;
            const p1Start = present.find(o => o.id === line1.startPointId) as Point;
            const p1End = present.find(o => o.id === line1.endPointId) as Point;
            const p2Start = present.find(o => o.id === line2.startPointId) as Point;
            const p2End = present.find(o => o.id === line2.endPointId) as Point;
            
            if (p1Start && p1End && p2Start && p2End) {
                const v1 = new THREE.Vector3().subVectors(new THREE.Vector3(...p1End.position), new THREE.Vector3(...p1Start.position)).normalize();
                const v2 = new THREE.Vector3().subVectors(new THREE.Vector3(...p2End.position), new THREE.Vector3(...p2Start.position)).normalize();
                const angleRad = v1.angleTo(v2);
                result = `Angle: ${THREE.MathUtils.radToDeg(angleRad).toFixed(2)}°`;
            }
          }
          break;
        case 'area-polygon':
          if (objects.length >= 2 && objects.every(o => o.type === 'point')) {
              const points = objects.map(o => new THREE.Vector3(...(o as Point).position));
              let perimeter = 0;
              for(let i=0; i<points.length; i++) {
                 perimeter += points[i].distanceTo(points[(i+1) % points.length]);
              }

              result = `Perimeter: ${perimeter.toFixed(3)}`;

              if (points.length >= 3) {
                  const areaVector = new THREE.Vector3();
                  for(let i=0; i<points.length; i++) {
                      const p1 = points[i];
                      const p2 = points[(i+1) % points.length];
                      areaVector.add(new THREE.Vector3().crossVectors(p1, p2));
                  }
                  const area = areaVector.length() * 0.5;
                  result += `\nArea: ${area.toFixed(3)}`;
              }

              if (points.length === 4) {
                   const a = points[0];
                   const b = points[1];
                   const c = points[2];
                   const d = points[3];
                   const v1 = new THREE.Vector3().subVectors(a, d);
                   const v2 = new THREE.Vector3().subVectors(b, d);
                   const v3 = new THREE.Vector3().subVectors(c, d);
                   const volume = Math.abs(v1.dot(new THREE.Vector3().crossVectors(v2, v3))) / 6.0;
                   result += `\nVolume: ${volume.toFixed(3)}`;
              }
          }
          break;
        case 'volume-solid':
            if (objects.length === 1) {
                const obj = objects[0];
                let volume = 0;
                let valid = true;
                if (obj.type === 'sphere') {
                    volume = (4/3) * Math.PI * Math.pow((obj as Sphere).radius, 3);
                } else if (obj.type === 'cylinder') {
                    volume = Math.PI * Math.pow((obj as Cylinder).radius, 2) * (obj as Cylinder).height;
                } else if (obj.type === 'box') {
                    const box = obj as Box;
                    volume = box.size[0] * box.size[1] * box.size[2];
                } else {
                    valid = false;
                }
                if(valid) result = `Volume: ${Math.abs(volume).toFixed(3)}`;
            }
            break;
      }
    } catch (e) {
        console.error("Calculation error:", e);
        result = "Error calculating.";
    }

    if (result) {
      set({ calculationResult: result });
    }
  },

  toggleTheme: () => set(state => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  setTheme: (theme) => set({ theme }),

}));

export { useGeometryStore };