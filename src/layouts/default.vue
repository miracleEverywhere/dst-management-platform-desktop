<script setup>
import DefaultLayoutWithVerticalNav from './components/DefaultLayoutWithVerticalNav.vue'

// 刷新当前路由页面缓存方法
const isRouterShow = ref(true)

const refreshCurrentPage = async () => {
  isRouterShow.value = false
  await nextTick()
  isRouterShow.value = true
}

provide("refresh", refreshCurrentPage)
</script>

<template>
  <default-layout-with-vertical-nav>
    <router-view v-if="isRouterShow" />
  </default-layout-with-vertical-nav>
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
@use "@layouts/styles/default-layout";
</style>
