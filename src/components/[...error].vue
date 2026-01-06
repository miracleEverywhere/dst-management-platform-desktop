<script setup>
import { useTheme } from 'vuetify'
import misc404 from '@images/pages/404.png'
import miscMaskDark from '@images/pages/misc-mask-dark.png'
import miscMaskLight from '@images/pages/misc-mask-light.png'
import tree from '@images/pages/tree.png'

const vuetifyTheme = useTheme()

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? miscMaskLight : miscMaskDark
})
</script>

<template>
  <div class="misc-wrapper">
    <error-header
      status-code="404"
      title="Not Found ⚠️"
      description="没有找到该页面"
    />

    <!-- 👉 Image -->
    <div class="misc-avatar w-100 text-center">
      <v-img
        :src="misc404"
        alt="Coming Soon"
        :max-width="800"
        class="mx-auto"
      />
      <v-btn
        to="/"
        class="mt-10"
      >
        返回首页
      </v-btn>
    </div>

    <!-- 👉 Footer -->
    <v-img
      :src="tree"
      class="misc-footer-tree d-none d-md-block"
    />

    <v-img
      :src="authThemeMask"
      class="misc-footer-img d-none d-md-block"
    />
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/misc.scss";

.misc-footer-tree {
  inline-size: 15.625rem;
  inset-block-end: 3.5rem;
  inset-inline-start: 0.375rem;
}
</style>
