<template>
  <DefaultLayoutWithVerticalNav>
    <RouterView/>
  </DefaultLayoutWithVerticalNav>
</template>

<script setup>
import DefaultLayoutWithVerticalNav from './components/DefaultLayoutWithVerticalNav.vue'

const isRouterShow = ref(true);
const refreshCurrentPage = (val) => (isRouterShow.value = val);
provide("refresh", refreshCurrentPage);
</script>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
@use "@layouts/styles/default-layout";
</style>
