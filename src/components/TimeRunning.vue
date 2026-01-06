<template>
  <span
    v-if="timeDisplay.years > 0"
    class="mr-1"
  >
    {{ timeDisplay.years + t('global.timeRunning.year') }}
  </span>
  <span
    v-if="timeDisplay.days > 0"
    class="mr-1"
  >
    {{ timeDisplay.days + t('global.timeRunning.day') }}
  </span>
  <span
    v-if="timeDisplay.hours > 0"
    class="mr-1"
  >
    {{ timeDisplay.hours + t('global.timeRunning.hour') }}
  </span>
  <span
    v-if="timeDisplay.minutes > 0"
    class="mr-1"
  >
    {{ timeDisplay.minutes + t('global.timeRunning.minute') }}
  </span>
  <span class="mr-1">
    {{ timeDisplay.seconds + t('global.timeRunning.second') }}
  </span>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue"
import { useI18n } from "vue-i18n"

const props = defineProps({
  seconds: {
    type: Number,
    default: 0,
  },
})

const { t } = useI18n()
const totalSeconds = ref(props.seconds)
let timer = null

const timeDisplay = computed(() => {
  let secs = totalSeconds.value
  const years = Math.floor(secs / (365 * 24 * 60 * 60))

  secs %= 365 * 24 * 60 * 60

  const days = Math.floor(secs / (24 * 60 * 60))

  secs %= 24 * 60 * 60

  const hours = Math.floor(secs / 3600)

  secs %= 3600

  const minutes = Math.floor(secs / 60)
  const seconds = secs % 60

  return { years, days, hours, minutes, seconds }
})

watch(() => props.seconds, newVal => {
  totalSeconds.value = newVal
})

onMounted(() => {
  timer = setInterval(() => totalSeconds.value += 1, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

