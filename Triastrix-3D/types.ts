import type { Vector3 } from 'three';

export type Tool = 'select' | 'point' | 'line' | 'plane' | 'sphere' | 'cylinder' | 'box';
export type ConstructionPlane = 'xz' | 'xy' | 'yz';

export interface BaseObject {
  id: string;
  name: string;
  type: 'point' | 'line' | 'plane' | 'sphere' | 'cylinder' | 'box';
  color: string;
}

export interface Point extends BaseObject {
  type: 'point';
  position: [number, number, number];
}

export interface Line extends BaseObject {
  type: 'line';
  startPointId: string;
  endPointId: string;
}

export interface Plane extends BaseObject {
  type: 'plane';
  pointIds: [string, string, string];
}

export interface Sphere extends BaseObject {
    type: 'sphere';
    position: [number, number, number];
    radius: number;
}

export interface Cylinder extends BaseObject {
    type: 'cylinder';
    position: [number, number, number]; // Center of the base
    radius: number;
    height: number;
}

export interface Box extends BaseObject {
    type: 'box';
    position: [number, number, number]; // Center of the box
    size: [number, number, number]; // width, height, depth
}

export type GeometricObject = Point | Line | Plane | Sphere | Cylinder | Box;