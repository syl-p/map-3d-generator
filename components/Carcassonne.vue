<template>
  <MapTerrain>
    <MapNaturalTrees :features="treesFeatures" v-if="treesFeatures[0]" />
  </MapTerrain>
  <TresGroup
    v-if="data && naturalFeatures && buildingsFeatures && waterFeatures"
  >
    <MapUrban :features="buildingsFeatures" v-if="buildingsFeatures" />
    <MapWater :features="waterFeatures" v-if="waterFeatures" />
  </TresGroup>
</template>

<script setup lang="ts">
// RECUPERATION DATA OSM AND TOPO
const { data } = await useFetch("/api/osm_data");

// COMPUTE SOME FEATURES
const naturalFeatures = computed(() => {
  return data.value && data.value.natural ? data.value.natural.features : [];
});

const treesFeatures = computed(() => {
  return naturalFeatures
    ? naturalFeatures.value.filter(
        (element) => element.properties.natural == "tree" && element.geometry
      )
    : null;
});

const waterFeatures = computed(() => {
  return data.value && data.value.water ? data.value.water.features : [];
});

const buildingsFeatures = computed(() => {
  return data.value && data.value.buildings
    ? data.value.buildings.features
    : [];
});
</script>
