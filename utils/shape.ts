import * as THREE from "three";
function genShape(points: number[][], center: number[]): THREE.Shape {
  let shape = new THREE.Shape();
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const pointNormalized = GpsRelativePosition(point, center);

    if (i === 0) {
      shape.moveTo(pointNormalized[0], pointNormalized[1]);
    } else {
      shape.lineTo(pointNormalized[0], pointNormalized[1]);
    }
  }

  return shape;
}

function genShapedGeometry(
  coordinates: any[][],
  height = 1
): THREE.ExtrudeGeometry {
  const options = {
    curveSegments: 1,
    depth: 0.05 * height,
    bevelEnabled: false,
  };

  let shape: THREE.Shape = null;
  const holes = [];
  for (let i = 0; i < coordinates.length; i++) {
    const shapeIte = genShape(coordinates[i], CENTER);
    if (i === 0) {
      shape = shapeIte;
    } else {
      holes.push(shapeIte);
    }
  }

  const extrude = new THREE.ExtrudeGeometry(shape, options);
  extrude.computeBoundingBox();

  return extrude;
}

export { genShapedGeometry, genShape };
