<template>
  <v-btn
    icon="ri-refresh-line"
    color="default"
    variant="text"
    @click="ElectronApi.window.reload()"
  />
</template>

<script setup>
import ElectronApi from "@/utils/electronApi"
</script>
