<template>
  <MapTerrain />
  <TresGroup
    v-if="data && naturalFeatures && buildingsFeatures && waterFeatures"
  >
    <MapNatural :features="naturalFeatures" v-if="naturalFeatures" />
    <MapUrban :features="buildingsFeatures" v-if="buildingsFeatures" />
    <MapWater :features="waterFeatures" v-if="waterFeatures" />
  </TresGroup>
</template>

<script setup lang="ts">
import * as THREE from "three";
import { useStore } from "~/store";
const store = useStore();
const { terrainRef } = storeToRefs(store);

// BBOX DEFINITION

// RECUPERATION DATA OSM AND TOPO
const { data } = await useFetch("/api/osm_data");

// COMPUTE SOME FEATURES
const naturalFeatures = computed(() => {
  return data.value && data.value.natural ? data.value.natural.features : [];
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
