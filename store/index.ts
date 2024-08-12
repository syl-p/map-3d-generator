import { defineStore } from "pinia";
import * as THREE from "three";
import * as GeoTIFF from "geotiff";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";

export const useStore = defineStore("store", () => {
  // BBOX
  const bbox = {
    start: [2.353936, 43.19904],
    end: [2.374069, 43.213273],
  };

  const terrainData = ref();
  const setTerrainData = (
    data: GeoTIFF.ReadRasterResult,
    x: number,
    y: number
  ) => {
    terrainData.value = {
      data,
      x,
      y,
    };
  };

  return { bbox, setTerrainData, terrainData };
});
