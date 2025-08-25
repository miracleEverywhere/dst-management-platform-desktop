<template>
  <v-app>
    <v-snackbar v-model="snackbar" :location="location" :timeout="timeout"
                color="#FFFFFF00" transition="slide-y-transition" variant="flat">
      <v-card>
        <v-alert :icon="icon" :type="color" density="compact" variant="text">
          {{ text }}
        </v-alert>
      </v-card>
    </v-snackbar>

    <router-view/>
  </v-app>
</template>

<script setup>
import {useSnackbar} from './utils/snackbar'

const {snackbar, color, text, location, icon, timeout} = useSnackbar()
</script>

<style scoped>
</style>
