<template>
  <VApp>
    <v-snackbar v-model="snackbar" :color="color" :timeout="timeout" :location="location" variant="flat">
      {{ text }}
    </v-snackbar>
    <RouterView />
  </VApp>
</template>

<script setup>
import { useSnackbar } from './utils/snackbar';

// 使用 Snackbar 的状态和方法
const { snackbar, color, text, location, timeout } = useSnackbar();
</script>
