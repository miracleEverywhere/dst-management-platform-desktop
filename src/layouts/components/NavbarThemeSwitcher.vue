<template>
  <ThemeSwitcher :themes="themes" />
</template>

<script setup>
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
