<template>
  <TresGroup v-if="instances">
    <TresInstancedMesh
      ref="instancesMesh"
      :args="[combinedGeometry, null!, instances.length]"
    >
      <TresMeshStandardMaterial color="green" />
    </TresInstancedMesh>
  </TresGroup>
</template>

<script setup lang="ts">
import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
const { scene } = await useGLTF("/models/tree/scene.gltf");
const instancesMesh = ref();
const { features } = defineProps(["features"]);
import { useStore } from "~/store";
const store = useStore();
const { terrainData } = storeToRefs(store);

const instances: Ref<{ id: number; position: number[] }[]> = ref(
  features.map((f, i) => ({
    id: i,
    position: f.geometry
      ? GpsRelativePosition(f.geometry.coordinates, CENTER)
      : null,
  }))
);

const geometries: THREE.BufferGeometry[] = [];

scene.traverse((child: THREE.Mesh) => {
  if (child.isMesh) {
    const clonedGeometry = child.geometry.clone();
    clonedGeometry.scale(0.008, 0.008, 0.008);
    clonedGeometry.applyMatrix4(child.matrixWorld);
    clonedGeometry.rotateX(-Math.PI);
    geometries.push(clonedGeometry);
  }
});

const combinedGeometry = BufferGeometryUtils.mergeGeometries(geometries);

watch(
  [instances, instancesMesh],
  async (newValue) => {
    if (newValue[0] && newValue[1] && terrainData.value) {
      const dummy = new THREE.Object3D();
      newValue[0].forEach(({ position, id }) => {
        if (position) {
          const objPosition: THREE.Vector3 = new THREE.Vector3(
            position[0],
            0,
            position[1]
          );

          const y = getTerrainHeightAt(
            objPosition.x,
            objPosition.z,
            terrainData.value.data,
            terrainData.value.x,
            terrainData.value.y
          );

          objPosition.setY(y);
          console.log(y);

          const scale = Math.random() * 1.5 + 0.5;
          dummy.position.copy(objPosition);
          // dummy.scale.set(scale, scale, scale);
          dummy.updateMatrix();
          instancesMesh.value.setMatrixAt(id, dummy.matrix);
        }
      });

      instancesMesh.value.instanceMatrix.needsUpdate = true;
      instancesMesh.value.rotateX(Math.PI);
      instancesMesh.value.rotateY(Math.PI);
    }
  },
  { immediate: true }
);
</script>
