<template>
  <v-app>
    <v-snackbar v-model="snackbar" :color="color" :timeout="timeout" :location="location" variant="elevated">
      {{ text }}
    </v-snackbar>
    <router-view/>
  </v-app>
</template>

<script setup>
import { useSnackbar } from './utils/snackbar';

// 使用 Snackbar 的状态和方法
const { snackbar, color, text, location, timeout } = useSnackbar();
</script>
