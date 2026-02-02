<template>
  <v-snackbar
    v-model="snackbar"
    :location="location"
    :timeout="timeout"
    color="#FFFFFF00"
    transition="slide-y-transition"
    variant="flat"
    :min-width="0"
  >
    <v-card>
      <div class="d-flex justify-start align-center px-4" style="min-height: 40px">
        <v-icon :icon="icon" :color="color"/>
        <span :class="textClass()">
          {{ text }}
        </span>
      </div>
    </v-card>

  </v-snackbar>
</template>

<script setup>
import { useSnackbar } from "@/utils/snackbar.js"

const { snackbar, color, text, location, icon, timeout } = useSnackbar()

const textClass = () => {
  return `ml-2 text-${color.value}`
}
</script>