<template>
  <TresGroup v-if="shapes">
    <template v-for="element of shapes">
      <Shape
        :coordinates="element.geometry.coordinates"
        color="green"
        v-if="
          element.geometry &&
          element.geometry.coordinates[0][1] &&
          Array.isArray(element.geometry.coordinates[0][1])
        "
      />
    </template>
  </TresGroup>

  <TresGroup>
    <MapNaturalTreeRows :features="treeRowsFeatures" v-if="treeRowsFeatures" />
    <MapNaturalTrees :features="treesFeatures" v-if="treesFeatures" />
  </TresGroup>
</template>

<script setup lang="ts">
import Shape from "~/components/Map/Shape.vue";
const { features } = defineProps(["features"]);

const treesFeatures = features
  ? features.filter(
      (element) => element.properties.natural == "tree" && element.geometry
    )
  : null;

const treeRowsFeatures = features
  ? features.filter(
      (element) => element.properties.natural == "tree_row" && element.geometry
    )
  : null;

const shapes = features
  ? features.filter(
      (element: any) =>
        element.geometry && Array.isArray(element.geometry.coordinates[0][1])
    )
  : [];
</script>
