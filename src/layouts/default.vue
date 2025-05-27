<template>
  <DefaultLayoutWithVerticalNav>
    <router-view v-slot="{ Component}">
      <transition appear mode="out-in" name="fade-default">
        <component :is="Component" v-if="isRouterShow"/>
      </transition>
    </router-view>
<!--    <RouterView/>-->
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
@import "../@layouts/styles/transition";
</style>
