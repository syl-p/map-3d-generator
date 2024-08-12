<template>
    <TresGroup v-if="shapes">
      <template v-for="element of shapes">
        <Shape
          :coordinates="element.geometry.coordinates"
          color="blue"
          v-if="
            element.geometry &&
            element.geometry.coordinates[0][1] &&
            Array.isArray(element.geometry.coordinates[0][1])
          "
        />
      </template>
    </TresGroup>
  </template>
  
  <script setup lang="ts">
  import Shape from "~/components/Map/Shape.vue";
  const { features } = defineProps(["features"]);
  
  const shapes = features
      ? features.filter(
          (element: any) =>
            element.geometry && Array.isArray(element.geometry.coordinates[0][1])
        )
      : [];
  </script>
  