<script setup lang="ts">
import * as THREE from "three";
import { BufferGeometryUtils } from "three/examples/jsm/Addons.js";
const instancesMesh = ref();
const terrainMesh: Ref<THREE.Mesh> | undefined = inject("MapTerrainMesh");

// PREPARE TREE GEOM
const geometries: THREE.BufferGeometry[] = [];
const { scene } = await useGLTF("/models/tree/scene.gltf");
scene.traverse((child: THREE.Mesh) => {
  if (child.isMesh) {
    const clonedGeometry = child.geometry.clone();
    clonedGeometry.scale(0.008, 0.008, 0.008);
    clonedGeometry.applyMatrix4(child.matrixWorld);
    geometries.push(clonedGeometry);
  }
});
const combinedGeometry = BufferGeometryUtils.mergeGeometries(geometries);

// SET SurfaceSampler
watchEffect(() => {
  if (terrainMesh && terrainMesh.value) {
    useSurfaceSampler(
      terrainMesh.value,
      100,
      instancesMesh.value,
      "forestShapes"
    );
  }
});
</script>

<template>
  <TresInstancedMesh
    ref="instancesMesh"
    :args="[combinedGeometry, null!, 10_000]"
  >
    <TresMeshStandardMaterial color="green" />
  </TresInstancedMesh>
</template>
