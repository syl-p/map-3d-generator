<template>
  <main class="font-serif">
    <header
      class="w-full flex justify-between items-center fixed top-0 left-0 p-8"
    >
      <div>Carcassonne 3D</div>
      <div>
        <a href="#" class="uppercase text-2xl">Menu</a>
      </div>
    </header>
    <TresCanvas
      v-bind="gl"
      window-size
      clear-color="#FFF0D6"
      shadows
      class="-z-10"
    >
      <Experience />
      <Stats />
    </TresCanvas>
    <section
      class="mt-[100vh] sticky top-0 left-0 bg-white flex flex-col justify-center"
    >
      <NuxtPage />
    </section>
  </main>
</template>

<script setup lang="ts">
import { BasicShadowMap, NoToneMapping, SRGBColorSpace } from "three";

const gl = {
  clearColor: "#FFF0D6",
  shadows: true,
  alpha: false,
  shadowMap: {
    autoUpdate: false,
  },
  shadowMapType: BasicShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: NoToneMapping,
};
</script>
