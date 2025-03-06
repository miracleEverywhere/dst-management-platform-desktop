<template>
  <v-btn @click="gotoDashboard">前往主界面</v-btn>
</template>

<script setup>
const gotoDashboard = () => {
  window.electronAPI.openDashboardWindow()
}
</script>

<style scoped>
</style>