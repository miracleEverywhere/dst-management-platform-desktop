<template>
  <v-btn @click="gotoDashboard">前往主界面</v-btn>
</template>

<script setup>
import ElectronApi from "@/utils/electronApi";
const gotoDashboard = () => {
  ElectronApi.window.dashboard()
}
</script>

<style scoped>
</style>