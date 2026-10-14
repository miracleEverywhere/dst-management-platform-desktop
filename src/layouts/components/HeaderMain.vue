<template>
  <div
    v-if="mobile"
    class="d-flex align-center"
    style="user-select: none;"
  >
    <div>
      <chip-select
        v-model="globalStore.room.id"
        :items="globalStore.roomBasic"
        :max-width="200"
        color="primary"
        prepend-icon="ri-honour-line"
        class="mr-4"
        @change="handleRoomChange"
      />
    </div>
  </div>
  <div
    v-else
    class="d-flex align-center"
    style="user-select: none;"
  >
    <div>
      <chip-select
        v-model="globalStore.room.id"
        :items="globalStore.roomBasic"
        :max-width="300"
        color="primary"
        prepend-icon="ri-honour-line"
        class="mr-4"
        @change="handleRoomChange"
      >
        <span class="mr-2">
          {{ t('global.room') }}
        </span>
      </chip-select>
    </div>
    <div>
      <v-chip
        :color="getColor()"
        class="mr-4"
        prepend-icon="ri-game-2-line"
      >
        <v-tooltip activator="parent">
          {{ t('global.current') + gameVersion.local }}
          <br>
          {{ t('global.latest') + gameVersion.server }}
        </v-tooltip>
        {{ t('global.gameVersion') + gameVersion.local }}
      </v-chip>
    </div>
    <div>
      <template v-if="dmpVersionGap&&!globalStore.dmpVersion.noTip">
        <v-tooltip>
          <template #activator="{ props }">
            <v-badge
              v-bind="props"
              location="top right"
              color="error"
              offset-x="24"
              class="cursor-pointer"
            >
              <template #badge>
                <div class="fcc">
                  <span @click="noTip">
                    New
                  </span>
                </div>
              </template>
              <v-chip
                color="info"
                class="mr-4"
                prepend-icon="ri-medal-2-line"
              >
                {{ t('global.dmpVersion') + Version }}
              </v-chip>
            </v-badge>
          </template>
          <div>
            {{ latestVersion }}
          </div>
          <div
            v-for="(line, i) in releaseInfo"
            :key="i"
          >
            {{ line }}
          </div>
        </v-tooltip>
      </template>
      <template v-else>
        <v-chip
          color="info"
          class="mr-4"
          prepend-icon="ri-medal-2-line"
        >
          {{ t('global.dmpVersion') + Version }}
        </v-chip>
      </template>
    </div>
  </div>
</template>

<script setup>
import { Version } from "@/config/index"
import { useI18n } from "vue-i18n"
import { useDisplay } from "vuetify"
import useGlobalStore from "@store/global"
import platformApi from "@/api/platform.js"
import roomApi from "@/api/room.js"
import ChipSelect from "./ChipSelect.vue"
import ElectronApi from "@/utils/electronApi"
import { DB_KEY } from "@/config"


const { t } = useI18n()
const { mobile } = useDisplay()
const globalStore = useGlobalStore()
const refresh = inject('refresh')

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

const getRoomPermittedBasic = () => {
  roomApi.permittedBasic.get().then(response => {
    globalStore.roomBasic = response.data || []
    for (let room of globalStore.roomBasic) {
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

const dmpVersionGap = computed(() => {
  return !!globalStore.latestRelease.latestVersion
    && globalStore.latestRelease.latestVersion !== Version
})

// 最新版本信息的缓存有效时长：1 小时
const latestVersionCacheTime = 60 * 60 * 1000

const latestVersion = computed(() => globalStore.latestRelease.latestVersion)
const releaseInfo = computed(() => globalStore.latestRelease.releaseInfo)

const getLatestVersion = async () => {
  // 缓存未过期时直接使用缓存，不再请求 GitHub，避免触发限流
  const { updateTime } = globalStore.latestRelease
  if (updateTime !== 0 && Date.now() - updateTime < latestVersionCacheTime) {
    return
  }

  const success = await globalStore.fetchLatestRelease()

  if (!success) {
    return
  }

  if (globalStore.latestRelease.latestVersion !== globalStore.dmpVersion.closeVersion) {
    globalStore.dmpVersion.noTip = false
  }
}

const noTip = () => {
  globalStore.dmpVersion.noTip = true
  globalStore.dmpVersion.closeVersion = latestVersion.value
}

const handleRoomChange = async () => {
  globalStore.room.gameName = globalStore.roomBasic.find(item => item.roomID === globalStore.room.id)?.roomName
  await refresh()
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
  getRoomPermittedBasic()
  await getLatestVersion()
})
</script>

