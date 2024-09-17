<template>
  <TresGroup v-if="forestFeatures?.length > 0">
    <MapTerrain :forest-features="forestFeatures">
      <MapNaturalTrees :features="treesFeatures" v-if="treesFeatures[0]" />
    </MapTerrain>
  </TresGroup>

  <TresGroup
    v-if="data && naturalFeatures && buildingsFeatures && waterFeatures"
  >
    <!-- <MapNaturalForest :features="forestFeatures" v-if="naturalFeatures" /> -->
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
    : [];
});

const forestFeatures = computed(() => {
  return naturalFeatures
    ? naturalFeatures.value.filter((element) =>
        ["forest", "meadow"].includes(element.properties.landuse)
      )
    : [];
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
