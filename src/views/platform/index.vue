<template>
  <v-tabs
    v-model="activeTabName"
    align-tabs="start"
    color="primary"
    show-arrows
    @update:model-value="handleTabClick"
  >
    <v-tab value="Overview">
      {{ t('platform.tab.overview') }}
    </v-tab>
    <v-tab value="Rooms">
      {{ t('platform.tab.rooms') }}
    </v-tab>
    <v-tab value="User">
      {{ t('platform.tab.user') }}
    </v-tab>
    <v-tab value="Settings">
      {{ t('platform.tab.settings') }}
    </v-tab>
    <v-tab value="Metrics">
      {{ t('platform.tab.metrics') }}
    </v-tab>
  </v-tabs>
  <v-tabs-window v-model="activeTabName">
    <v-tabs-window-item value="Overview">
      <v-container
        fluid
        :height="calculateContainerSize()"
        width="100%"
        class="w-100"
        style="overflow-y: auto"
      >
        <overview />
      </v-container>
    </v-tabs-window-item>
    <v-tabs-window-item value="Rooms">
      <v-container
        fluid
        :height="calculateContainerSize()"
        width="100%"
        class="w-100"
        style="overflow-y: auto"
      >
        <rooms />
      </v-container>
    </v-tabs-window-item>
    <v-tabs-window-item value="User">
      <v-container
        fluid
        :height="calculateContainerSize()"
        width="100%"
        class="w-100"
        style="overflow-y: auto"
      >
        <user />
      </v-container>
    </v-tabs-window-item>
    <v-tabs-window-item value="Settings">
      <v-container
        fluid
        :height="calculateContainerSize()"
        width="100%"
        class="w-100"
        style="overflow-y: auto"
      >
        <settings :height="calculateContainerSize()-32" />
      </v-container>
    </v-tabs-window-item>
    <v-tabs-window-item value="Metrics">
      <v-container
        fluid
        :height="calculateContainerSize()"
        width="100%"
        class="w-100"
        style="overflow-y: auto"
      >
        <metrics />
      </v-container>
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script setup>
import { debounce } from "@/utils/tools.js"
import { useI18n } from "vue-i18n"
import Overview from "@/views/platform/components/overview.vue"
import User from "@/views/platform/components/user.vue"
import Metrics from "@/views/platform/components/metrics.vue"
import Settings from "@/views/platform/components/settings.vue"
import Rooms from "@/views/platform/components/rooms.vue"


const { t } = useI18n()
const activeTabName = ref('Download')


const windowHeight = ref(window.innerHeight)

const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
}, 200)

const calculateContainerSize = () => {
  // 64(navbar) + 37(tab header) + 20(card padding) + 16(card padding) = 137
  const other = 150

  return Math.max(2, Math.floor(windowHeight.value - other))
}

const handleTabClick = tab => {
  if (tab === "Overview") {
  }
}

onMounted(async () => {
  // 添加事件监听
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

