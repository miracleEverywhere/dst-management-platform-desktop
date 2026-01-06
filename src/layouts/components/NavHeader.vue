<template>
  <v-img
    width="3em"
    height="2em"
    :src="logo"
  />

  <h1 class="font-weight-medium leading-normal text-xl text-uppercase">
    {{ $t('global.title') }}
  </h1>
</template>

<script setup>
import { generateLogo } from "@/utils/logo.js"

const logo = generateLogo()
</script>

<style scoped>
.logo {
  width: 3em!important;
  height: 2em!important;
}
</style>


