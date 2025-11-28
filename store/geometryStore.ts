
import { create } from 'zustand';
// FIX: import all geometric object types for use in AddObjectPayload
import type { Tool, GeometricObject, Point, Line, Plane, Sphere, Cylinder, Box, ConstructionPlane } from '../types';

// FIX: Create a distributive Omit type for addObject payload to fix discriminated union issues.
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
  
  setActiveTool: (tool: Tool) => void;
  setConstructionPlane: (plane: ConstructionPlane) => void;
  setSelectedObjectId: (id: string | null) => void;
  toggleLabels: () => void;
  
  // FIX: Use the new AddObjectPayload type
  addObject: (obj: AddObjectPayload) => void;
  updateObject: (id: string, updates: Partial<GeometricObject>) => void;
  removeObject: (id: string) => void;
  
  addTempLinePoint: (id: string) => void;
  clearTempLinePoints: () => void;
  addTempShapePoint: (id: string) => void;
  clearTempShapePoints: () => void;

  undo: () => void;
  redo: () => void;
}

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

  setActiveTool: (tool) => set({ activeTool: tool, selectedObjectId: null, tempLinePoints: [], tempShapePoints: [] }),
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
        obj.id === id ? { ...obj, ...updates } : obj
      );
      if (JSON.stringify(newPresent) === JSON.stringify(state.present)) {
        return state; // No actual change
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
       // Also remove objects that depend on this one
       // FIX: Use a switch statement for better type inference with discriminated unions.
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
}));

export { useGeometryStore };
