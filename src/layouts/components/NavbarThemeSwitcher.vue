<template>
  <ThemeSwitcher :themes="themes" />
</template>

<script setup>
import ThemeSwitcher from '@core/components/ThemeSwitcher.vue'

const themes = [
  {
    name: 'light',
    icon: 'ri-sun-line',
  },
  {
    name: 'dark',
    icon: 'ri-moon-clear-line',
  },
]
</script>
