<template>
  <check
    :category="['game', 'room']"
    :other-height="otherHeight"
  >
    <v-tabs
      v-model="activeTabName"
      align-tabs="start"
      color="primary"
      show-arrows
      @update:model-value="handleTabClick"
    >
      <v-tab value="Download">
        {{ t('game.mod.download.tabName') }}
      </v-tab>
      <v-tab value="Add">
        {{ t('game.mod.add.tabName') }}
      </v-tab>
      <v-tab value="Setting">
        {{ t('game.mod.setting.tabName') }}
      </v-tab>
    </v-tabs>

    <v-tabs-window v-model="activeTabName">
      <v-tabs-window-item value="Download">
        <v-container
          fluid
          :height="calculateContainerSize()"
          width="100%"
          class="w-100"
          style="overflow-y: auto"
        >
          <download />
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item value="Add">
        <v-container
          fluid
          :height="calculateContainerSize()"
          width="100%"
          class="w-100"
          style="overflow-y: auto"
        >
          <add />
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item value="Setting">
        <v-container
          fluid
          :height="calculateContainerSize()"
          width="100%"
          class="w-100"
          style="overflow-y: auto"
        >
          <setting :height="calculateContainerSize()-106" />
        </v-container>
      </v-tabs-window-item>
    </v-tabs-window>
  </check>
</template>

<script setup>
import { debounce } from "@/utils/tools"
import Download from "@/views/game/components/mod/download.vue"
import Add from "@/views/game/components/mod/add.vue"
import Setting from "@/views/game/components/mod/setting.vue"
import { useI18n } from "vue-i18n"
import useGlobalStore from "@store/global.js"
import useUserStore from "@store/user.js"


onMounted(async () => {
  // 添加事件监听
  window.addEventListener('resize', handleResize)
})

// 防抖处理resize事件
const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
}, 200)

// 在组件卸载时移除监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const { t } = useI18n()
const globalStore = useGlobalStore()
const userStore = useUserStore()
const activeTabName = ref('Download')
const otherHeight = 150

const handleTabClick = tab => {
  if (tab === "Add") {
    // handleGetDownloadedMod()
  }
  if (tab=== "Setting") {
    // handleGetModSetting()
  }
}

const calculateContainerSize = () => {
  // 64(navbar) + 37(tab header) + 20(card padding) + 16(card padding) = 137

  return Math.max(2, Math.floor(windowHeight.value - otherHeight))
}

const windowHeight = ref(window.innerHeight)
</script>

