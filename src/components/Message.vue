<template>
  <v-snackbar
    v-model="snackbar"
    :location="location"
    :timeout="timeout"
    :color="color"
    transition="slide-y-transition"
    variant="flat"
  >
    <div class="d-flex justify-start align-center">
      <v-icon :icon="icon" />
      <span class="ml-2">
        {{ text }}
      </span>
    </div>
  </v-snackbar>
</template>

<script setup>
import { useSnackbar } from "@/utils/snackbar.js"

const { snackbar, color, text, location, icon, timeout } = useSnackbar()
</script>