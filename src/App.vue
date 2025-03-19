<template>
  <v-app>
    <v-snackbar v-model="snackbar" :timeout="timeout" transition="slide-y-transition"
                :location="location" variant="flat" color="#FFFFFF00">
      <v-card>
        <v-alert :type="color" variant="text" density="compact">
          {{ text }}
        </v-alert>
      </v-card>

    </v-snackbar>
    <router-view/>
  </v-app>
</template>

<script setup>
import { useSnackbar } from './utils/snackbar';

const { snackbar, color, text, location, timeout } = useSnackbar();

</script>

<style scoped>
</style>
