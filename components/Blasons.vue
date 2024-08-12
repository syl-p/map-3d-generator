<template>
  <TresGroup ref="blasonsRef">
    <template v-for="point of props.points">
      <TresMesh
        :scale="0.15"
        :position="point.position"
        cast-shadow receive-shadow
        @click="onClick(point)">
        <TresPlaneGeometry />
        <TresMeshStandardMaterial
            :map="textures.map"
            transparent
            :side="DoubleSide"/>
      </TresMesh>
      <Html :position="point.position">
        <h2 class="text-3xl text-serif">Titre du point</h2>
      </Html>
    </template>
  </TresGroup>
</template>

<script setup lang="ts">
import { Html } from "@tresjs/cientos";
import { DoubleSide } from "three";
const props = defineProps(["points"]);
const { camera } = useTresContext();

const blasonsRef = ref()

const textures = await useTexture({
  map: '/interest-point.png'
})

async function onClick(pointData) {
  await navigateTo({path: pointData._path})
}

const { onLoop } = useRenderLoop();
onLoop(({delta}) => {
  if(blasonsRef.value && camera.value) {
    blasonsRef.value.children.forEach(child => {
      child.quaternion.copy(camera.value?.quaternion)
    })
  }
})

</script>
