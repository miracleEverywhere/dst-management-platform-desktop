<template>
  <v-tabs v-model="tab" @update:modelValue="handleTabChange" align-tabs="start" color="primary">
    <v-tab value="current">当前日志</v-tab>
    <v-tab value="historical">历史日志</v-tab>
  </v-tabs>

  <v-tabs-window v-model="tab">
    <v-tabs-window-item value="current">
      <log ref="logRef" type="caves"/>
    </v-tabs-window-item>
    <v-tabs-window-item value="historical">
      <log ref="HistoricalLogRef" :historical="true" type="caves"/>
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script setup>
import log from '@/views/logs/components/log.vue'

const tab = ref()
const logRef = ref()
const HistoricalLogRef = ref()

const handleTabChange = (tab) => {
  if (tab === 'current' && logRef.value) {
    logRef.value.startRequests()
  }
  if (tab === 'historical' && logRef.value) {
    logRef.value.cancelRequests()
  }
}
</script>

<style scoped>
</style>