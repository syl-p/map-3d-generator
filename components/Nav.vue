<template>
  <nav class="w-full flex fixed top-1/2 left-0 pl-5">
    <ul>
      <li>
        <NuxtLink to="/" active-class="underline"> Accueil </NuxtLink>
      </li>
      <li v-for="page of []">
        <NuxtLink :to="page._path" active-class="underline">
          {{ page.title }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
<script setup lang="ts"></script>
