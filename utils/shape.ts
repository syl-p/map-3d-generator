import * as THREE from "three"

export default function genShape(points: number[][], center: number[]): THREE.Shape {
    let shape = new THREE.Shape()
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const pointNormalized = GpsRelativePosition(point, center)

      if(i === 0) {
        shape.moveTo(pointNormalized[0], pointNormalized[1])
      } else {
        shape.lineTo(pointNormalized[0], pointNormalized[1])
      }
    }

    return shape
}