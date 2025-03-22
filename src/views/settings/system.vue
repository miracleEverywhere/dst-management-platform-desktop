<template>
  {{globalStore}}
</template>

<script setup>
import useGlobalStore from '@/plugins/pinia/global'


const globalStore = useGlobalStore()
</script>

<style scoped>
</style>