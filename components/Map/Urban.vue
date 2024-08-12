<script setup lang="ts">
import * as THREE from "three";
import { BufferGeometryUtils } from "three/examples/jsm/Addons.js";
import genShape from "~/utils/shape";
const { features } = defineProps(["features"]);

function shape(coordinates: number[][], height = 1): THREE.ExtrudeGeometry {
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
</script>

<template>
  <TresMesh :geometry="merged" v-if="merged">
    <TresMeshStandardMaterial />
  </TresMesh>
</template>
