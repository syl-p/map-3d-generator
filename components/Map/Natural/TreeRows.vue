<template>
    <TresGroup v-if="instances">
    </TresGroup>
  </template>
  
  <script setup lang="ts">

  const { features } = defineProps(["features"]);
  const instances: Ref<{id: number, start: number[], end: number[]}[]> = ref(features.map((f, i) => ({
    id: i,
    start: GpsRelativePosition(f.geometry.coordinates[0], CENTER),
    end: GpsRelativePosition(f.geometry.coordinates[1], CENTER),
  })));
  
  </script>