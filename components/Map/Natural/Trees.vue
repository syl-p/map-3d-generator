<template>
  <TresGroup v-if="instances">
    <TresInstancedMesh
      ref="instancesMesh"
      :args="[combinedGeometry, null!, instances.length]"
    >
      <TresMeshStandardMaterial color="green" />
    </TresInstancedMesh>
  </TresGroup>
</template>

<script setup lang="ts">
import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
const { scene } = await useGLTF("/models/tree/scene.gltf");
const instancesMesh = ref();
const { features } = defineProps(["features"]);
const terrainMesh = inject("MapTerrainMesh");

const instances: Ref<{ id: number; position: number[] }[]> = ref(
  features.map((f, i) => ({
    id: i,
    position: f.geometry
      ? GpsRelativePosition(f.geometry.coordinates, CENTER)
      : null,
  }))
);

const geometries: THREE.BufferGeometry[] = [];

scene.traverse((child: THREE.Mesh) => {
  if (child.isMesh) {
    const clonedGeometry = child.geometry.clone();
    clonedGeometry.scale(0.008, 0.008, 0.008);
    clonedGeometry.applyMatrix4(child.matrixWorld);
    geometries.push(clonedGeometry);
  }
});

const combinedGeometry = BufferGeometryUtils.mergeGeometries(geometries);

watch(
  [instances, instancesMesh, terrainMesh],
  async (newValue) => {
    if (newValue[0] && newValue[1] && newValue[2].geometry) {
      const terrainMesh = newValue[2];
      const raycaster = new THREE.Raycaster();

      const dummy = new THREE.Object3D();
      newValue[0].forEach(({ position, id }) => {
        if (position) {
          // Position
          const objPosition: THREE.Vector3 = new THREE.Vector3(
            position[0],
            0,
            position[1]
          );

          // Fix position
          const rotationMatrix = new THREE.Matrix4();
          rotationMatrix.makeRotationAxis(new THREE.Vector3(0, 1, 0), Math.PI); // Rotation autour de l'axe spécifié
          rotationMatrix.makeRotationAxis(new THREE.Vector3(1, 0, 0), Math.PI);
          rotationMatrix.makeRotationAxis(new THREE.Vector3(0, 0, 1), Math.PI);
          const rotatedPoint = objPosition.clone().applyMatrix4(rotationMatrix);

          // Raycasting to set the Y
          const startPoint = new THREE.Vector3(
            rotatedPoint.x,
            500,
            rotatedPoint.z
          );
          const direction = new THREE.Vector3(0, -500, 0);
          raycaster.set(startPoint, direction);
          const intersects = raycaster.intersectObject(terrainMesh);
          if (intersects.length > 0) {
            const intersectPoint = intersects[0].point;
            const y = intersectPoint.y;
            rotatedPoint.y = y;
          }

          // save
          dummy.position.copy(rotatedPoint);
          dummy.updateMatrix();
          instancesMesh.value.setMatrixAt(id, dummy.matrix);
        }
      });

      instancesMesh.value.instanceMatrix.needsUpdate = true;
    }
  },
  { immediate: true }
);

function getIndexFromCoords(
  objPosition: THREE.Vector3,
  width: number,
  height: number,
  widthSegments: number,
  heightSegments: number
) {
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  // Convertir les coordonnées (x, z) en indices du tableau
  const i = Math.round(((objPosition.x + halfWidth) / width) * widthSegments);
  const j = Math.round(
    ((objPosition.z + halfHeight) / height) * heightSegments
  );

  // Correction : S'assurer que les indices sont dans les limites de la grille
  const iClamped = THREE.MathUtils.clamp(i, 0, widthSegments - 1);
  const jClamped = THREE.MathUtils.clamp(j, 0, heightSegments - 1);

  // Calculer l'index unidimensionnel avec widthSegments
  const index = jClamped * widthSegments + iClamped;

  console.log(`i: ${i}, j: ${j}`);
  console.log(`iClamped: ${iClamped}, jClamped: ${jClamped}`);
  console.log(`index: ${index}`);

  return index;
}
</script>
