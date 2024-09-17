<template>
  <TresMesh ref="meshRef" :geometry="geometry">
    <TresShaderMaterial
      :transparent="true"
      :uniforms="uniforms"
      :vertex-shader="terrainVertexShader"
      :fragment-shader="terrainFragmentShader"
    />
  </TresMesh>
  <slot></slot>
</template>

<script setup lang="ts">
import * as turf from "@turf/turf";

import * as THREE from "three";
import * as GeoTIFF from "geotiff";
import terrainFragmentShader from "../../shaders/terrain.fragment.glsl?raw";
import terrainVertexShader from "../../shaders/terrain.vertex.glsl?raw";
const rawTiff = await GeoTIFF.fromUrl("./terrain-2.tif");
const tiffImage = await rawTiff.getImage();
const meshRef = ref<THREE.Mesh>();
provide("MapTerrainMesh", meshRef);
const { forestFeatures } = defineProps(["forestFeatures"]);
const uniforms = {
  thresholdDistance: { value: 0 },
};

const start = [2.353936, 43.19904];
const end = [2.374069, 43.213273];
let leftBottom = GpsRelativePosition(start, CENTER);
let rightTop = GpsRelativePosition(end, CENTER);
let x = Math.abs(leftBottom[0] - rightTop[0]);
let y = Math.abs(leftBottom[1] - rightTop[1]);

const data = await tiffImage.readRasters({
  width: Math.floor(x),
  height: Math.floor(y),
  resampleMethod: "bilinear",
  interleave: true,
});

// SET TERRAIN HEIGHTS
let minHeight = Infinity;
const geometry = new THREE.PlaneGeometry(x, y, x - 1, y - 1);

for (let i = 0; i < data.length; i++) {
  const el = data[i];
  const height = (el as number) / 100;
  geometry.getAttribute("position").setZ(i, height);

  if (height < minHeight) minHeight = height;
}
geometry.getAttribute("position").needsUpdate = true;

// INIT FIRST FOREST
const shapes: ComputedRef<number[][]> = computed(() => {
  return forestFeatures
    ? forestFeatures.map((f: {}) => {
        return f.geometry.coordinates[0]
          ? f.geometry.coordinates[0].map((g: number[]) =>
              GpsRelativePosition(g, CENTER)
            )
          : null;
      })
    : [];
});

// SET FORESTS ON TERRAIN
const positionAttribute = geometry.getAttribute("position");
const vertexCount = positionAttribute.count;
const forestInside = new Float32Array(vertexCount);

function pointInsidePolygon(point: THREE.Vector2, shapePoints: number[][]) {
  const polygon = turf.polygon([shapePoints]);
  const pt = turf.point([point.x, point.y]);
  return turf.booleanPointInPolygon(pt, polygon);
}

//
watchEffect(() => {
  if (!shapes) return;

  for (const shape of shapes.value) {
    console.log(shape);
    for (let i = 0; i < vertexCount; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);

      const isInside = pointInsidePolygon(new THREE.Vector2(x, y), shape);
      forestInside[i] = isInside ? 1.0 : 0.0;
    }
  }

  geometry.setAttribute(
    "forestShapes",
    new THREE.BufferAttribute(forestInside, 1)
  );

  geometry.getAttribute("forestShapes").needsUpdate = true;
});

onMounted(() => {
  geometry.computeBoundingBox();
  geometry.rotateX(Math.PI / 2);
  geometry.rotateY(Math.PI / 2);
  geometry.rotateZ(Math.PI);
  geometry.translate(0, -minHeight, 0); // Center the terrain vertically
});
</script>
