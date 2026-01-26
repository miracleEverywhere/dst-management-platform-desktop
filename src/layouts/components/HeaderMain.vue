<template>
  <div
    v-if="mobile"
    class="d-flex align-center"
    style="user-select: none;"
  >
    <div>
      <v-chip
        v-if="globalStore.room.id"
        label
        color="primary"
        prepend-icon="ri-honour-line"
      >
        {{ truncateString(globalStore.room.gameName, 8) }}
      </v-chip>
      <v-chip
        v-else
        label
        color="primary"
        prepend-icon="ri-honour-line"
      >
        {{ t('global.noRoom') }}
      </v-chip>
    </div>
  </div>
  <div
    v-else
    class="d-flex align-center"
    style="user-select: none;"
  >
    <div>
      <v-chip
        v-if="globalStore.room.id"
        color="primary"
        class="mr-4"
        prepend-icon="ri-honour-line"
      >
        {{ t('global.room') + truncateString(globalStore.room.gameName, 15) }}
      </v-chip>
      <v-chip
        v-else
        color="primary"
        class="mr-4"
        prepend-icon="ri-honour-line"
      >
        {{ t('global.room') + t('global.noRoom') }}
      </v-chip>
    </div>
    <div>
      <v-chip
        :color="getColor()"
        class="mr-4"
        prepend-icon="ri-game-2-line"
      >
        {{ t('global.gameVersion') + gameVersion.local }}
      </v-chip>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n"
import { useDisplay } from "vuetify"
import { truncateString } from "@/utils/tools.js"
import useGlobalStore from "@store/global"
import platformApi from "@/api/platform.js"
import roomApi from "@/api/room.js"
import ElectronApi from "@/utils/electronApi"
import { DB_KEY } from "@/config"


const { t } = useI18n()
const { mobile } = useDisplay()
const globalStore = useGlobalStore()

const gameVersion = ref({
  local: 0,
  server: 0,
})

const getGameVersion = async () => {
  try {
    const response = await platformApi.gameVersion.get()

    gameVersion.value = response.data
    globalStore.gameVersion = gameVersion.value
  } catch {

  }
}

const getRoomBasic = () => {
  roomApi.basic.get().then(response => {
    const roomBasic = response.data || []
    for (let room of roomBasic) {
      if (room.roomID === globalStore.room.id && room.roomName === globalStore.room.gameName) {
        return
      }
    }
    globalStore.room.id = 0
    globalStore.room.gameName = ""
  })
}

const getColor = () => {
  if (gameVersion.value.local === 0) {
    return 'error'
  }
  if (gameVersion.value.local !== gameVersion.value.server) {
    return 'warning'
  }
  
  return 'success'
}

const setRoomStore = () => {
  const dmps =ElectronApi.store.get(DB_KEY.dmps) || []

  for (let dmp of dmps) {
    if (dmp.id === globalStore.entry.id) {
      globalStore.room.id = dmp.selectedRoomID
      globalStore.room.gameName = dmp.selectedRoomName
    }
  }
}

onMounted(async () => {
  if (globalStore.entry.inEntry) {
    return
  }
  setRoomStore()
  await getGameVersion()
  getRoomBasic()
})
</script>

