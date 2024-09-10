<script setup lang="ts">
import * as THREE from "three";
import { BufferGeometryUtils } from "three/examples/jsm/Addons.js";
import genShape from "~/utils/shape";
const { features } = defineProps(["features"]);
const forestRef = ref();
const instancesMesh = ref();

function shape(coordinates: number[][], height = 1): THREE.ExtrudeGeometry {
  const options = {
    curveSegments: 1,
    depth: 0,
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

const merged = computed(() => {
  let geometryArray: THREE.ExtrudeGeometry[] = [];

  features.map((feature) => {
    if (feature.geometry.coordinates[0][1]) {
      return geometryArray.push(
        shape(
          feature.geometry.coordinates,
          feature.properties["building:levels"]
        )
      );
    }
  });

  return BufferGeometryUtils.mergeGeometries(geometryArray);
});

onMounted(() => {
  merged.value.computeBoundingBox();
  merged.value.rotateX(Math.PI / 2);
  merged.value.rotateZ(Math.PI);
});

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

watch(forestRef, (value) => {
  useSurfaceSampler(value, 50, instancesMesh.value, "color");
});
</script>

<template>
  <TresInstancedMesh
    ref="instancesMesh"
    :args="[combinedGeometry, null!, 10_000]"
  >
    <TresMeshStandardMaterial color="green" />
  </TresInstancedMesh>
  <TresMesh ref="forestRef" :geometry="merged" v-if="merged">
    <TresMeshStandardMaterial color="green" />
  </TresMesh>
</template>
