<template>
  <template v-if="globalStore.gameVersion.local!==0">
    <template v-if="globalStore.room.id!==0">
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
    </template>
    <template v-else>
      <result
        :title="t('global.noRoomSelected.title')"
        :sub-title="t('global.noRoomSelected.subTitle')"
        type="error"
        :height="calculateContainerSize()"
      >
        <v-btn
          to="/rooms"
          class="mt-4"
        >
          {{ t('global.noRoomSelected.button') }}
        </v-btn>
      </result>
    </template>
  </template>
  <template v-else>
    <result
      v-if="userStore.userInfo.role==='admin'"
      :title="t('global.noGame.title')"
      :sub-title="t('global.noGame.subTitle')"
      :height="calculateContainerSize()"
      type="error"
    >
      <v-btn
        to="/install"
        class="mt-4"
      >
        {{ t('global.noGame.button') }}
      </v-btn>
    </result>
    <result
      v-else
      :title="t('global.noGameNoAdmin.title')"
      :sub-title="t('global.noGameNoAdmin.subTitle')"
      :height="calculateContainerSize()"
      type="error"
    />
  </template>
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
  const other = 150

  return Math.max(2, Math.floor(windowHeight.value - other))
}

const windowHeight = ref(window.innerHeight)
</script>

