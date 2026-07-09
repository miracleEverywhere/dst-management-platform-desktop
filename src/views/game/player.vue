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
      <v-tab value="online">
        {{ t('game.player.online.tabName') }}
      </v-tab>
      <v-tab value="adminlist">
        {{ t('game.player.list.adminlist') }}
      </v-tab>
      <v-tab value="blocklist">
        {{ t('game.player.list.blocklist') }}
      </v-tab>
      <v-tab value="whitelist">
        {{ t('game.player.list.whitelist') }}
      </v-tab>
      <v-tab value="chat">
        {{ t('game.player.chat.title') }}
      </v-tab>
      <v-tab value="history">
        {{ t('game.player.history.tabName') }}
      </v-tab>
      <v-tab value="statistics">
        {{ t('game.player.statistics.tabName') }}
      </v-tab>
    </v-tabs>
    <v-tabs-window v-model="activeTabName">
      <v-tabs-window-item value="online">
        <v-container
          v-if="activeTabName==='online'"
          fluid
          :height="calculateContainerSize()"
          width="100%"
          class="w-100"
          style="overflow-y: auto"
        >
          <online :height="calculateContainerSize()" />
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item value="adminlist">
        <v-container
          v-if="activeTabName==='adminlist'"
          fluid
          :height="calculateContainerSize()"
          width="100%"
          class="w-100"
          style="overflow-y: auto"
        >
          <list
            :height="calculateContainerSize()"
            list-type="adminlist"
            :uidmap="uidmap"
          />
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item value="blocklist">
        <v-container
          v-if="activeTabName==='blocklist'"
          fluid
          :height="calculateContainerSize()"
          width="100%"
          class="w-100"
          style="overflow-y: auto"
        >
          <list
            :height="calculateContainerSize()"
            list-type="blocklist"
            :uidmap="uidmap"
          />
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item value="whitelist">
        <v-container
          v-if="activeTabName==='whitelist'"
          fluid
          :height="calculateContainerSize()"
          width="100%"
          class="w-100"
          style="overflow-y: auto"
        >
          <list
            :height="calculateContainerSize()"
            list-type="whitelist"
            :uidmap="uidmap"
          />
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item value="chat">
        <v-container
          v-if="activeTabName==='chat'"
          fluid
          :height="calculateContainerSize()"
          width="100%"
          class="w-100"
          style="overflow-y: auto"
        >
          <chat :height="calculateContainerSize()" />
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item value="history">
        <v-container
          v-if="activeTabName==='history'"
          fluid
          :height="calculateContainerSize()"
          width="100%"
          class="w-100"
          style="overflow-y: auto"
        >
          <history :uidmap="uidmap" />
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item value="statistics">
        <v-container
          v-if="activeTabName==='statistics'"
          fluid
          width="100%"
          class="w-100"
        >
          <statistics />
        </v-container>
      </v-tabs-window-item>
    </v-tabs-window>
  </check>
</template>

<script setup>
import Online from "@/views/game/components/player/online.vue"
import { useI18n } from "vue-i18n"
import { debounce } from "@/utils/tools"
import useGlobalStore from "@store/global.js"
import useUserStore from "@store/user.js"
import { useDisplay } from "vuetify/framework"
import List from "@/views/game/components/player/list.vue"
import playerApi from "@/api/player"
import History from "@/views/game/components/player/history.vue"
import Statistics from "@/views/game/components/player/statistics.vue"
import Chat from "@/views/game/components/player/chat.vue"

const globalStore = useGlobalStore()
const userStore = useUserStore()
const { mobile } = useDisplay()
const { t } = useI18n()
const activeTabName = ref('online')
const otherHeight = 150


const uidmap = ref([])

const getUidmap = () => {
  if (globalStore.room.id===0) return

  const reqForm = {
    roomID: globalStore.room.id,
  }

  playerApi.uidmap.get(reqForm).then(response => {
    uidmap.value = response.data
  })
}


const windowHeight = ref(window.innerHeight)

const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
}, 200)

const calculateContainerSize = () => {
  // 64(navbar) + 37(tab header) + 20(card padding) + 16(card padding) = 137

  return Math.max(2, Math.floor(windowHeight.value - otherHeight))
}

const handleTabClick = tab => {
  if (tab === "Overview") {
  }
}

onMounted(async () => {
  getUidmap()

  // 添加事件监听
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

