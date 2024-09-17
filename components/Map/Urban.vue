<script setup lang="ts">
import * as THREE from "three";
import { BufferGeometryUtils } from "three/examples/jsm/Addons.js";
const { features } = defineProps(["features"]);

const merged = computed(() => {
  let geometryArray: THREE.ExtrudeGeometry[] = [];

  features.map((feature) => {
    if (feature.geometry.coordinates[0][1]) {
      return geometryArray.push(
        genShapedGeometry(
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
