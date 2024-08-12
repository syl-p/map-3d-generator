<template>
  <section class="prose">
    <ContentDoc />
    <footer>
      <NuxtLink v-if="prev" :to="prev._path">Précédent</NuxtLink>
      <NuxtLink v-if="next" :to="next._path">Suivant</NuxtLink>
    </footer>
  </section>
</template>

<script setup lang="ts">
  const {prev, next} = useContent()
</script>
