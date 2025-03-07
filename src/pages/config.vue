<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <config :config-item="c"/>

    <VImg :src="authV1Tree" :width="250" class="auth-footer-start-tree d-none d-md-block"/>

    <VImg :src="authV1Tree2" :width="350" class="auth-footer-end-tree d-none d-md-block"/>

    <!-- bg img -->
    <VImg :src="authThemeMask" class="auth-footer-mask d-none d-md-block"/>
  </div>
</template>

<script setup>
import {useTheme} from 'vuetify'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'
import config from '@/views/config/index.vue'

const vuetifyTheme = useTheme()

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? authV1MaskLight : authV1MaskDark
})

const c = ref({
  name: '腾讯云',
  type: 'both',
  ip: '111.222.333.444',
  port: 80800,
  token: 'asdasdasfsdfsd',
  remark: '三点几啦，来饮咖啦~',
})


</script>

<style scoped>
@use "@core/scss/template/pages/page-auth";
</style>