<template>
  <TresMesh v-if="shape">
    <TresExtrudeGeometry :args="[shape, options]" ref="geometry" />
    <TresMeshStandardMaterial :color="color" />
  </TresMesh>
</template>

<script setup lang="ts">
import { genShape } from "~/utils/shape";
const geometry = ref();
const { coordinates, color, depth } = defineProps([
  "coordinates",
  "color",
  "depth",
]);

const options = {
  curveSegments: 1,
  depth: depth ? 0.05 * depth : 0,
  bevelEnabled: false,
};

let shape = computed(() => {
  let shape = null;
  const holes = [];
  for (let i = 0; i < coordinates.length; i++) {
    const shapeIte = genShape(coordinates[i], CENTER);
    if (i === 0) {
      shape = shapeIte;
    } else {
      holes.push(shapeIte);
    }
  }

  return shape;
});

onMounted(() => {
  geometry.value.computeBoundingBox();
  geometry.value.rotateX(Math.PI / 2);
  geometry.value.rotateZ(Math.PI);
});
</script>
