
# Triastrix 
An open-source 3D geometric construction tool built with **React**.  
Triastrix allows you to create and manipulate points, lines, planes, vectors, solids, and perform advanced geometric calculations such as distances, angles, areas, intersections, and volumes — similar to GeoGebra 3D, but lighter, open, and developer-friendly.

![GitHub License](https://img.shields.io/github/license/bteamapp/Triastrix)
![GitHub Issues](https://img.shields.io/github/issues-raw/bteamapp/Triastrix)
![GitHub Fork](https://img.shields.io/github/forks/bteamapp/Triastrix)



## Features

### Geometric Construction Tools
- Create points by clicking or entering coordinates (x, y, z)
- Segments, lines, rays
- Planes through 3 points or defined by equations
- Vectors, parallel/perpendicular helpers
- 3D shapes: spheres, cylinders, boxes, polyhedra
- Pen Tool: freehand → polyline/spline 3D

### Geometric Calculations
- Distances: point–point, point–line, point–plane
- Angles: line–line, line–plane, plane–plane
- Areas: triangles, arbitrary polygons
- Volumes: standard solids and polyhedra
- Intersections:
  - plane–plane → line  
  - sphere–plane → circle  
  - line–plane → point  
  - line–line → point or skew distance

### Interaction & Editing
- Select, drag, and edit coordinates in real time
- Smart snapping: endpoints, midpoints, intersections, foot, axis snaps
- Undo/Redo (powered by Zustand/Redux)
- Object Manager (sidebar)
- Hover highlights and precision overlays

### Import / Export
- Save and load project as JSON
- Export PNG snapshots
- Export 3D model (GLTF/OBJ)
- Import point lists via CSV

### Equation Input & Scripting
- Plane equations: `ax + by + cz + d = 0`
- Line equations: parametric or symmetric form
- Small scripting sandbox (JavaScript) for automated construction

### Visualization & Education Tools
- Transform animations
- Locus/path animations
- Highlights, labels, annotations (2D and 3D)
- Measurement overlays


## Tech Stack

- **React 18**
- **React Three Fiber** + **Three.js**
- **Zustand** (state management + history)
- Vite or Next.js (recommended)
- TypeScript (optional but recommended)

---

## 🚀 Getting Started

### 1. Clone the repository
```sh
git clone https://github.com/<your-username>/triastrix.git
cd triastrix
````

### 2. Install dependencies

```sh
npm install
```

### 3. Run the development server

```sh
npm run dev
```

### 4. Build for production

```sh
npm run build
```


## Roadmap


### 1. Core 3D Rendering (React Three Fiber / Three.js)

- [ ] Set up a 3D canvas with **react-three-fiber**
- [ ] Camera controls using **OrbitControls**
- [ ] 3D coordinate grid and **XYZ axes**
- [ ] View modes: **Perspective** / **Orthographic**
- [ ] Toggle layers: **grid**, **axes**, **guides**



### 2. Geometry Drawing Tools

- [ ] **Point Tool**
  - [ ] Click to create points
  - [ ] Input coordinates for precise placement
- [ ] **Line Tool**
  - [ ] Infinite line
  - [ ] Line segment
  - [ ] Ray
- [ ] **Plane Tool**
  - [ ] Create plane through 3 points
  - [ ] Create plane from an equation
- [ ] **Vector Tool**
- [ ] **Basic 3D Shapes**
  - [ ] Sphere
  - [ ] Cylinder
  - [ ] Box
  - [ ] Prism
- [ ] **Pen Tool (Freehand)**
  - [ ] Draw freehand lines
  - [ ] Convert to **polyline** / **3D spline**

### 3. Geometric Calculations

- [ ] **Distance**
  - [ ] Point–Point
  - [ ] Point–Line
  - [ ] Point–Plane
- [ ] **Angle**
  - [ ] Between two lines
  - [ ] Line–Plane
  - [ ] Plane–Plane
- [ ] **Area**
  - [ ] Triangle
  - [ ] Polygon
  - [ ] Arbitrary plane
- [ ] **Volume**
  - [ ] Polyhedron
  - [ ] Sphere
  - [ ] Cylinder
- [ ] **Intersection**
  - [ ] Plane–Plane → Line
  - [ ] Sphere–Plane → Circle
  - [ ] Line–Plane → Point

### 4. Coordinate System & Input

- [ ] Input points via **XYZ coordinates**
- [ ] Display coordinates on **hover**
- [ ] **Snap** to X/Y/Z axes
- [ ] Snap to special points (midpoint, foot, intersection)


### 5. Edit & Interaction

- [ ] Drag points → update dependent objects (constraints)
- [ ] Edit coordinates directly in sidebar
- [ ] Select objects by just a clicking
- [ ] Highlight objects on hover
- [ ] Undo / Redo (using **Zustand** or **Redux**)

### 6. Transformations

- [ ] **Translation**
- [ ] **Rotation** around axis
- [ ] **Scaling**
- [ ] **Reflection** through plane or point


### 7. User Interface (UI with React)

- [ ] **Sidebar**: Object Manager
- [ ] **Property Panel**: coordinates, length, color, style
- [ ] **Toolbar**: select drawing tool
- [ ] **Mini-math display**: angles, areas, volumes
- [ ] Theme: **Light / Dark**


### 8. Import / Export

- [ ] Save project as **JSON**
- [ ] Export images (**PNG**)
- [ ] Export 3D models (**GLTF / OBJ**)
- [ ] Import point coordinates from **CSV**


### 9. Equation Input & Scripting

- [ ] Input plane equation
- [ ] Input line equation (parametric)
- [ ] Generate objects from equations
- [ ] Integrate small scripts (**JS eval sandbox**) for automated modeling


### 10. Animation & Visualization

- [ ] Animate transformations
- [ ] Animate point loci
- [ ] Display motion vectors


### 11. Learning & Educational Support

- [ ] 3D / 2D annotations
- [ ] Arrows, highlight planes
- [ ] Exercise / test mode for geometric constructions


## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Submit a pull request


## License

Released under the **GNU Affero General Public License v3.0** — free for personal, educational, and commercial use, but wỉth some conditions.

You can view more details in LICENSE.md


## Notes

Triastrix is under active development.
Stay tuned for new tools, UI improvements, and advanced geometric features.

```
Contact: helpapp.bta@gmail.com
```
