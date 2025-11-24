
# Triastrix 
An open-source 3D geometric construction tool built with **React + React Three Fiber**.  
Triastrix allows you to create and manipulate points, lines, planes, vectors, solids, and perform advanced geometric calculations such as distances, angles, areas, intersections, and volumes — similar to GeoGebra 3D, but lighter, open, and developer-friendly.

---

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

---

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


---

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Submit a pull request

---

## License

Released under the **GNU Affero General Public License v3.0** — free for personal, educational, and commercial use, but wỉth some conditions.

You can view more details in LICENSE.md

---

## Notes

Triastrix is under active development.
Stay tuned for new tools, UI improvements, and advanced geometric features.

```
Contact: helpapp.bta@gmail.com
```
