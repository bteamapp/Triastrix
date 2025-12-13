// FIX: All errors in this file were caused by TypeScript failing to recognize react-three-fiber's custom JSX elements (e.g., `<mesh>`).
// The `@react-three/fiber` side-effect import, which augments the JSX namespace, has been moved to the top of the file.
// This ensures that the type definitions are loaded before any other code is processed, correctly extending the JSX typings and resolving all related errors.
import '@react-three/fiber';
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Line as DreiLine, Plane as DreiPlane, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { useGeometryStore } from '../store/geometryStore';
import type { Point, Line, Sphere, Cylinder, Box, Plane } from '../types';

function PointMesh({ object, isSelected, isCalculationInput }: { object: Point, isSelected: boolean, isCalculationInput: boolean }) {
  const { activeTool, tempLinePoints, tempShapePoints, isCalculatorOpen, calculationMode, addTempLinePoint, addTempShapePoint, addCalculationInput, setSelectedObjectId } = useGeometryStore(useShallow(state => ({
    activeTool: state.activeTool,
    tempLinePoints: state.tempLinePoints,
    tempShapePoints: state.tempShapePoints,
    isCalculatorOpen: state.isCalculatorOpen,
    calculationMode: state.calculationMode,
    addTempLinePoint: state.addTempLinePoint,
    addTempShapePoint: state.addTempShapePoint,
    addCalculationInput: state.addCalculationInput,
    setSelectedObjectId: state.setSelectedObjectId,
  })));
  
  const meshRef = useRef<THREE.Mesh>(null!);

  const isPendingLinePoint = activeTool === 'line' && tempLinePoints.includes(object.id);
  const isPendingShapePoint = activeTool === 'plane' && tempShapePoints.includes(object.id);

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (isCalculatorOpen) {
      if (calculationMode === 'distance-point-point' || calculationMode === 'area-polygon') {
        addCalculationInput(object.id);
      }
    } else if (activeTool === 'line') {
      if (!tempLinePoints.includes(object.id)) {
        addTempLinePoint(object.id);
      }
    } else if (activeTool === 'plane') {
      if (!tempShapePoints.includes(object.id)) {
        addTempShapePoint(object.id);
      }
    } else {
      setSelectedObjectId(object.id);
    }
  };
  
  const materialColor = isCalculationInput ? '#ffeb3b' : isPendingLinePoint ? 'cyan' : isPendingShapePoint ? 'lime' : object.color;

  return (
    <mesh
      ref={meshRef}
      position={object.position}
      onClick={handleClick}
    >
      <sphereGeometry args={[isSelected || isCalculationInput ? 0.0675 : 0.045, 32, 32]} />
      <meshStandardMaterial color={materialColor} roughness={1} metalness={0} />
    </mesh>
  );
}

function LineMesh({ object, points, isSelected, isCalculationInput }: { object: Line, points: [Point, Point], isSelected: boolean, isCalculationInput: boolean }) {
  const { isCalculatorOpen, calculationMode, addCalculationInput, setSelectedObjectId } = useGeometryStore(useShallow(state => ({
    isCalculatorOpen: state.isCalculatorOpen,
    calculationMode: state.calculationMode,
    addCalculationInput: state.addCalculationInput,
    setSelectedObjectId: state.setSelectedObjectId,
  })));

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (isCalculatorOpen) {
      if (calculationMode === 'angle-line-line') {
        addCalculationInput(object.id);
      }
    } else {
      setSelectedObjectId(object.id);
    }
  };

  return (
    <DreiLine
      points={[points[0].position, points[1].position]}
      color={isCalculationInput ? '#ffeb3b' : object.color}
      lineWidth={isSelected || isCalculationInput ? 5 : 3}
      onClick={handleClick}
    />
  );
}

function PlaneMesh({ object, points, isSelected, isCalculationInput }: { object: Plane, points: [Point, Point, Point], isSelected: boolean, isCalculationInput: boolean }) {
  const { isCalculatorOpen, calculationMode, addCalculationInput, setSelectedObjectId } = useGeometryStore(useShallow(state => ({
    isCalculatorOpen: state.isCalculatorOpen,
    calculationMode: state.calculationMode,
    addCalculationInput: state.addCalculationInput,
    setSelectedObjectId: state.setSelectedObjectId,
  })));
  
  const planeData = useMemo(() => {
    const p1 = new THREE.Vector3(...points[0].position);
    const p2 = new THREE.Vector3(...points[1].position);
    const p3 = new THREE.Vector3(...points[2].position);
    const plane = new THREE.Plane().setFromCoplanarPoints(p1, p2, p3);
    const center = new THREE.Vector3().add(p1).add(p2).add(p3).divideScalar(3);
    return { plane, center };
  }, [points]);

  const meshRef = useRef<THREE.Mesh>(null!);

  useEffect(() => {
    if(meshRef.current) {
      meshRef.current.lookAt(planeData.center.clone().add(planeData.plane.normal));
    }
  }, [planeData]);

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (isCalculatorOpen) {
      // Area calculation for planes is removed in favor of point-based polygon area
      // but we can keep selection logic if needed later
    } else {
      setSelectedObjectId(object.id);
    }
  };

  return (
      <mesh 
        ref={meshRef} 
        position={planeData.center}
        onClick={handleClick}
      >
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial 
            color={isCalculationInput ? '#ffeb3b' : object.color} 
            side={THREE.DoubleSide} 
            transparent 
            opacity={isSelected || isCalculationInput ? 0.75 : 0.6} 
            roughness={1}
            metalness={0}
          />
      </mesh>
  )
}

function SphereMesh({ object, isSelected, isCalculationInput }: { object: Sphere, isSelected: boolean, isCalculationInput: boolean }) {
    const { isCalculatorOpen, calculationMode, addCalculationInput, setSelectedObjectId } = useGeometryStore(useShallow(state => ({
    isCalculatorOpen: state.isCalculatorOpen,
    calculationMode: state.calculationMode,
    addCalculationInput: state.addCalculationInput,
    setSelectedObjectId: state.setSelectedObjectId,
  })));

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (isCalculatorOpen) {
      if (calculationMode === 'volume-solid') {
        addCalculationInput(object.id);
      }
    } else {
      setSelectedObjectId(object.id);
    }
  };

  return (
    <mesh
      position={object.position}
      onClick={handleClick}
    >
      <sphereGeometry args={[object.radius, 32, 32]} />
      <meshStandardMaterial 
        color={isCalculationInput ? '#ffeb3b' : object.color} 
        roughness={1} 
        metalness={0} 
        transparent 
        opacity={isSelected || isCalculationInput ? 1.0 : 0.8}
      />
    </mesh>
  );
}

function CylinderMesh({ object, isSelected, isCalculationInput }: { object: Cylinder, isSelected: boolean, isCalculationInput: boolean }) {
    const { isCalculatorOpen, calculationMode, addCalculationInput, setSelectedObjectId } = useGeometryStore(useShallow(state => ({
    isCalculatorOpen: state.isCalculatorOpen,
    calculationMode: state.calculationMode,
    addCalculationInput: state.addCalculationInput,
    setSelectedObjectId: state.setSelectedObjectId,
  })));
  const position: [number, number, number] = [
    object.position[0],
    object.position[1] + object.height / 2,
    object.position[2]
  ];

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (isCalculatorOpen) {
      if (calculationMode === 'volume-solid') {
        addCalculationInput(object.id);
      }
    } else {
      setSelectedObjectId(object.id);
    }
  };

  return (
    <mesh
      position={position}
      onClick={handleClick}
    >
      <cylinderGeometry args={[object.radius, object.radius, object.height, 32]} />
      <meshStandardMaterial 
        color={isCalculationInput ? '#ffeb3b' : object.color}
        roughness={1}
        metalness={0}
        transparent
        opacity={isSelected || isCalculationInput ? 1.0 : 0.8}
      />
    </mesh>
  );
}

function BoxMesh({ object, isSelected, isCalculationInput }: { object: Box, isSelected: boolean, isCalculationInput: boolean }) {
    const { isCalculatorOpen, calculationMode, addCalculationInput, setSelectedObjectId } = useGeometryStore(useShallow(state => ({
    isCalculatorOpen: state.isCalculatorOpen,
    calculationMode: state.calculationMode,
    addCalculationInput: state.addCalculationInput,
    setSelectedObjectId: state.setSelectedObjectId,
  })));

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (isCalculatorOpen) {
      if (calculationMode === 'volume-solid') {
        addCalculationInput(object.id);
      }
    } else {
      setSelectedObjectId(object.id);
    }
  };

  return (
    <mesh
      position={object.position}
      onClick={handleClick}
    >
      <boxGeometry args={object.size} />
      <meshStandardMaterial 
        color={isCalculationInput ? '#ffeb3b' : object.color}
        roughness={1}
        metalness={0}
        transparent
        opacity={isSelected || isCalculationInput ? 1.0 : 0.8}
      />
    </mesh>
  );
}

function TempPolygon({ pointIds }: { pointIds: string[] }) {
    const objects = useGeometryStore(state => state.present);
    const points = useMemo(() => 
        pointIds.map(id => objects.find(o => o.id === id)).filter(o => o?.type === 'point') as Point[], 
    [pointIds, objects]);
    
    if (points.length < 2) return null;

    const isTetrahedron = points.length === 4;

    const vertices = useMemo(() => {
        const arr: number[] = [];
        if (isTetrahedron) {
            // Tetrahedron faces: (0,1,2), (0,2,3), (0,3,1), (1,3,2)
            // Note: (0,3,1) closes the side fan. (1,3,2) closes the base/cap.
            const faces = [
                [0, 1, 2],
                [0, 2, 3],
                [0, 3, 1],
                [1, 2, 3] 
            ];
            for (const face of faces) {
                for (const idx of face) {
                    arr.push(...points[idx].position);
                }
            }
        } else if (points.length >= 3) {
            // Simple fan triangulation from first point for polygons
            for (let i = 1; i < points.length - 1; i++) {
                arr.push(...points[0].position);
                arr.push(...points[i].position);
                arr.push(...points[i+1].position);
            }
        }
        return new Float32Array(arr);
    }, [points, isTetrahedron]);

    const edges = useMemo(() => {
        const vs = points.map(p => new THREE.Vector3(...p.position));
        const lines: THREE.Vector3[][] = [];
        
        if (isTetrahedron) {
             // 6 edges: all pairs for K4
             for(let i=0; i<4; i++) {
                 for(let j=i+1; j<4; j++) {
                     lines.push([vs[i], vs[j]]);
                 }
             }
        } else {
             // Polygon loop
             lines.push([...vs, vs[0]]);
        }
        return lines;
    }, [points, isTetrahedron]);
    
    return (
        <group>
             {edges.map((pts, i) => (
                 <DreiLine key={i} points={pts} color="#ffeb3b" lineWidth={3} />
             ))}
             {vertices.length > 0 && (
                <mesh>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={vertices.length / 3}
                            array={vertices}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <meshStandardMaterial 
                        color="#ffcc00" 
                        emissive="#ffcc00"
                        emissiveIntensity={0.5}
                        transparent 
                        opacity={0.4} 
                        side={THREE.DoubleSide} 
                        depthWrite={false}
                    />
                </mesh>
             )}
        </group>
    )
}


function Scene() {
  const {
    objects,
    selectedObjectId,
    activeTool,
    addObject,
    tempLinePoints,
    clearTempLinePoints,
    tempShapePoints,
    clearTempShapePoints,
    setSelectedObjectId,
    constructionPlane,
    showLabels,
    calculationInputs,
    calculationMode,
    isCalculatorOpen,
    theme
  } = useGeometryStore(useShallow(state => ({
    objects: state.present,
    selectedObjectId: state.selectedObjectId,
    activeTool: state.activeTool,
    addObject: state.addObject,
    tempLinePoints: state.tempLinePoints,
    clearTempLinePoints: state.clearTempLinePoints,
    tempShapePoints: state.tempShapePoints,
    clearTempShapePoints: state.clearTempShapePoints,
    setSelectedObjectId: state.setSelectedObjectId,
    constructionPlane: state.constructionPlane,
    showLabels: state.showLabels,
    calculationInputs: state.calculationInputs,
    calculationMode: state.calculationMode,
    isCalculatorOpen: state.isCalculatorOpen,
    theme: state.theme,
  })));

  const { camera, raycaster, pointer } = useThree();

  const points = useMemo(() => objects.filter(o => o.type === 'point') as Point[], [objects]);
  const lines = useMemo(() => objects.filter(o => o.type === 'line') as Line[], [objects]);
  const planes = useMemo(() => objects.filter(o => o.type === 'plane') as Plane[], [objects]);
  const spheres = useMemo(() => objects.filter(o => o.type === 'sphere') as Sphere[], [objects]);
  const cylinders = useMemo(() => objects.filter(o => o.type === 'cylinder') as Cylinder[], [objects]);
  const boxes = useMemo(() => objects.filter(o => o.type === 'box') as Box[], [objects]);

  const planeConfig = useMemo(() => {
    switch(constructionPlane) {
      case 'xy': return { normal: new THREE.Vector3(0, 0, 1), rotation: [Math.PI / 2, 0, 0] as [number,number,number] };
      case 'yz': return { normal: new THREE.Vector3(1, 0, 0), rotation: [0, 0, Math.PI / 2] as [number,number,number] };
      case 'xz':
      default: return { normal: new THREE.Vector3(0, 1, 0), rotation: [0, 0, 0] as [number,number,number] };
    }
  }, [constructionPlane]);


  useEffect(() => {
    if (tempLinePoints.length === 2) {
      addObject({ type: 'line', startPointId: tempLinePoints[0], endPointId: tempLinePoints[1] });
      clearTempLinePoints();
    }
  }, [tempLinePoints, addObject, clearTempLinePoints]);

  useEffect(() => {
    if (activeTool === 'plane' && tempShapePoints.length === 3) {
      addObject({ type: 'plane', pointIds: [tempShapePoints[0], tempShapePoints[1], tempShapePoints[2]] });
      clearTempShapePoints();
    }
  }, [tempShapePoints, activeTool, addObject, clearTempShapePoints]);


  const handleCanvasClick = (event: THREE.Event) => {
    if (isCalculatorOpen) {
        // Clicks on the background should not do anything in calculator mode
        return;
    }
    const clickPlane = new THREE.Plane(planeConfig.normal, 0);
    raycaster.setFromCamera(pointer, camera);
    const intersectPoint = new THREE.Vector3();

    if (activeTool === 'point') {
      if (raycaster.ray.intersectPlane(clickPlane, intersectPoint)) {
        addObject({ type: 'point', position: [intersectPoint.x, intersectPoint.y, intersectPoint.z] });
      }
    } else if (['sphere', 'cylinder', 'box'].includes(activeTool)) {
      if (raycaster.ray.intersectPlane(clickPlane, intersectPoint)) {
        const position: [number, number, number] = [intersectPoint.x, intersectPoint.y, intersectPoint.z];
        if (activeTool === 'sphere') {
          addObject({ type: 'sphere', position, radius: 1 });
        } else if (activeTool === 'cylinder') {
          addObject({ type: 'cylinder', position, radius: 0.5, height: 2 });
        } else if (activeTool === 'box') {
          addObject({ type: 'box', position, size: [1, 1, 1] });
        }
      }
    } else {
      if (selectedObjectId) setSelectedObjectId(null);
      if (tempLinePoints.length > 0) clearTempLinePoints();
      if (tempShapePoints.length > 0) clearTempShapePoints();
    }
  };

  const gridColor = theme === 'dark' ? "#555" : "#ccc";
  const axisColorX = theme === 'dark' ? "#ff6b6b" : "#d32f2f";
  const axisColorY = theme === 'dark' ? "#69f0ae" : "#388e3c";
  const axisColorZ = theme === 'dark' ? "#81a1c1" : "#1976d2";
  const labelColor = theme === 'dark' ? "white" : "black";
  const labelOutline = theme === 'dark' ? "black" : "white";

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} />
      <directionalLight position={[-5, -10, -2]} intensity={0.5} />
      <Grid infiniteGrid args={[10, 100]} sectionColor={gridColor} fadeDistance={50} rotation={planeConfig.rotation} />
      
      {/* Axis Helpers and Labels */}
      <axesHelper args={[2]} />
      <Text position={[2.2, 0, 0]} fontSize={0.25} color={axisColorX} anchorX="center" anchorY="middle">X</Text>
      <Text position={[0, 2.2, 0]} fontSize={0.25} color={axisColorY} anchorX="center" anchorY="middle">Y</Text>
      <Text position={[0, 0, 2.2]} fontSize={0.25} color={axisColorZ} anchorX="center" anchorY="middle">Z</Text>
      
      <OrbitControls makeDefault />

      <mesh onClick={handleCanvasClick} visible={false} position={[0,-0.01,0]} rotation-x={-Math.PI/2}>
         <planeGeometry args={[1000, 1000]} />
         <meshStandardMaterial />
      </mesh>
      
      {points.map(obj => (
          <group key={obj.id}>
            <PointMesh object={obj} isSelected={obj.id === selectedObjectId} isCalculationInput={calculationInputs.includes(obj.id)} />
            {showLabels && (
              <Text
                position={[obj.position[0], obj.position[1] + 0.25, obj.position[2]]}
                fontSize={0.2}
                color={labelColor}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.005}
                outlineColor={labelOutline}
              >
                {obj.name}
              </Text>
            )}
        </group>
      ))}

      {lines.map(obj => {
        const startPoint = points.find(p => p.id === obj.startPointId);
        const endPoint = points.find(p => p.id === obj.endPointId);
        if (!startPoint || !endPoint) return null;
        return (
          <group key={obj.id}>
            <LineMesh object={obj} points={[startPoint, endPoint]} isSelected={obj.id === selectedObjectId} isCalculationInput={calculationInputs.includes(obj.id)} />
          </group>
        );
      })}

      {planes.map(obj => {
        const p1 = points.find(p => p.id === obj.pointIds[0]);
        const p2 = points.find(p => p.id === obj.pointIds[1]);
        const p3 = points.find(p => p.id === obj.pointIds[2]);
        if (!p1 || !p2 || !p3) return null;
        return (
            <group key={obj.id}>
                <PlaneMesh object={obj} points={[p1, p2, p3]} isSelected={obj.id === selectedObjectId} isCalculationInput={calculationInputs.includes(obj.id)} />
            </group>
        )
      })}
      
      {spheres.map(obj => (
          <group key={obj.id}>
            <SphereMesh object={obj} isSelected={obj.id === selectedObjectId} isCalculationInput={calculationInputs.includes(obj.id)} />
          </group>
      ))}
      {cylinders.map(obj => (
          <group key={obj.id}>
            <CylinderMesh object={obj} isSelected={obj.id === selectedObjectId} isCalculationInput={calculationInputs.includes(obj.id)} />
          </group>
      ))}
      {boxes.map(obj => (
          <group key={obj.id}>
            <BoxMesh object={obj} isSelected={obj.id === selectedObjectId} isCalculationInput={calculationInputs.includes(obj.id)} />
          </group>
      ))}


      {tempLinePoints.length === 1 && (
         <DreiLine
            points={[
              (points.find(p => p.id === tempLinePoints[0])?.position) || [0,0,0],
              [0,0,0] // This will be updated with pointer position in a more advanced version
            ]}
            color="cyan"
            dashed
            dashSize={0.2}
            gapSize={0.1}
            lineWidth={2}
         />
      )}

      {isCalculatorOpen && calculationMode === 'area-polygon' && calculationInputs.length >= 2 && (
          <TempPolygon pointIds={calculationInputs} />
      )}
    </>
  );
}


export default function ThreeCanvas() {
  return (
    <Canvas
      camera={{ position: [5, 5, 5], fov: 50 }}
      className="w-full h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
      shadows
    >
      <Scene />
    </Canvas>
  );
}