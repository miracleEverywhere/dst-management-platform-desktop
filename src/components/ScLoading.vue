<template v-else>
  <div class="fcc" :style="`height: ${props.height}px; flex-direction: column`">
    <v-progress-circular indeterminate :size="props.circularSize"
                         :width="props.circularWidth" :color="props.color"/>
    <div class="mt-6" style="font-size: 1.6rem; font-weight: 300; line-height: 1; letter-spacing: -0.015625em">
      <slot>加载中，请稍后</slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  height: {
    type: Number,
    default: 400,
  },
  circularSize: {
    type: Number,
    default: 80,
  },
  circularWidth: {
    type: Number,
    default: 7,
  },
  color: {
    type: String,
    default: 'primary',
  }
})
</script>

<style scoped>
</style>