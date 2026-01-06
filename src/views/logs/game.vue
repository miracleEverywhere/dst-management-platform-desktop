<template>
  <!-- 游戏是否安装 -->
  <template v-if="globalStore.gameVersion.local!==0">
    <!-- 房间是否选择 -->
    <template v-if="globalStore.room.id!==0">
      <v-tabs
        v-model="activeTabName"
        align-tabs="start"
        color="primary"
        show-arrows
        @update:model-value="handleTabClick"
      >
        <v-tab value="current">
          {{ t('logs.current') }}
        </v-tab>
        <v-tab value="history">
          {{ t('logs.history') }}
        </v-tab>
      </v-tabs>
      <v-tabs-window
        v-model="activeTabName"
        class="mt-4"
      >
        <v-tabs-window-item value="current">
          <v-card :height="calculateHeight()">
            <v-card-title class="my-2">
              <div class="card-header">
                <span>
                  {{ t('logs.current') }}
                </span>
                <div class="fcc">
                  <v-select
                    v-model="selectedWorldID"
                    :items="worlds"
                    item-title="worldName"
                    item-value="id"
                    :label="t('logs.world')"
                    density="compact"
                    class="mr-4"
                    @update:model-value="content='';firstPullFinished=false"
                  />
                  <v-switch
                    v-model="autoPull"
                    color="info"
                    hide-details
                  >
                    <template #prepend>
                      <v-chip color="info">
                        {{ t('logs.autoPull') }}
                      </v-chip>
                    </template>
                  </v-switch>
                </div>
              </div>
            </v-card-title>
            <v-card-text>
              <template v-if="firstPullFinished">
                <log
                  v-if="content"
                  :content="content"
                  :height="calculateHeight()-150"
                />
                <result
                  v-else
                  type="info"
                  :height="calculateHeight()-150"
                  :title="t('logs.noContent')"
                />
              </template>
              <template v-else>
                <result
                  type="info"
                  :title="t('logs.fetching')"
                  :height="calculateHeight()-150"
                />
              </template>
              <v-row class="my-4">
                <v-spacer v-if="!mobile" />
                <v-col class="d-flex align-center justify-end">
                  <v-number-input
                    v-model="lines"
                    :label="t('logs.line')"
                    hide-details
                    density="compact"
                    class="mr-4"
                    max-width="120"
                  />
                  <v-btn @click="getLogContent">
                    {{ t('logs.pull') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-tabs-window-item>
        <v-tabs-window-item value="history">
          <v-card :height="calculateHeight()">
            <v-card-title class="my-2">
              <div class="card-header">
                <span>
                  {{ t('logs.history') }}
                </span>
                <div class="fcc">
                  <v-select
                    v-model="selectedWorldID"
                    :items="worlds"
                    item-title="worldName"
                    item-value="id"
                    :label="t('logs.world')"
                    density="compact"
                    class="mr-4"
                    min-width="100px"
                    @update:model-value="content=''"
                  />
                  <v-select
                    v-model="selectedFilename"
                    :items="list"
                    :disabled="getHistoryFileContentLoading"
                    :loading="getHistoryFileContentLoading"
                    :label="t('logs.logFile')"
                    density="compact"
                    min-width="100px"
                    @update:model-value="getHistoryFileContent"
                  />
                </div>
              </div>
            </v-card-title>
            <v-card-text>
              <template v-if="selectedFilename">
                <log
                  v-if="!getHistoryFileContentLoading&&historyContent"
                  :content="historyContent"
                  :height="calculateHeight()-150"
                />
                <result
                  v-if="getHistoryFileContentLoading"
                  type="info"
                  :title="t('logs.fetching')"
                  :height="calculateHeight()-150"
                />
                <result
                  v-if="!getHistoryFileContentLoading&&!historyContent"
                  type="info"
                  :height="calculateHeight()-150"
                  :title="t('logs.noContent')"
                />
              </template>
              <template v-else>
                <result
                  type="info"
                  :height="calculateHeight()-150"
                  :title="t('logs.noLogFile')"
                />
              </template>
            </v-card-text>
          </v-card>
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
    <template v-else>
      <result
        :title="t('global.noRoomSelected.title')"
        :sub-title="t('global.noRoomSelected.subTitle')"
        type="error"
        :height="calculateHeight()"
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
      :height="calculateHeight()"
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
      :height="calculateHeight()"
      type="error"
    />
  </template>
</template>

<script setup>
import Log from "@/views/logs/components/log.vue"
import logsApi from "@/api/logs.js"
import roomApi from "@/api/room.js"
import useGlobalStore from "@store/global.js"
import { debounce } from "@/utils/tools.js"
import useUserStore from "@store/user.js"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"


const globalStore = useGlobalStore()
const userStore = useUserStore()
const { mobile } = useDisplay()
const { t } = useI18n()
const activeTabName = ref('current')

const content = ref('')
const selectedWorldID = ref(0)
const autoPull= ref(true)
const lines = ref(0)

const handleTabClick = tab => {
  if (tab === "current") {
    shouldPull.value = true
  }
  if (tab === "history") {
    shouldPull.value = false
  }
}

const firstPullFinished = ref(false)
const shouldPull = ref(true)

const getLogContent = () => {
  if (selectedWorldID.value === 0) {
    return
  }
  if (!shouldPull.value) {
    return
  }

  const reqForm = {
    roomID: globalStore.room.id,
    worldID: selectedWorldID.value,
    logType: 'game',
    lines: lines.value,
  }

  logsApi.content.get(reqForm).then(response => {
    if (response.data === null) {
      content.value = ""
    } else {
      content.value = response.data.join("\n")
    }
    firstPullFinished.value = true
  })
}

const worlds = ref([])

const getWorlds = async () => {
  const reqForm = {
    roomID: globalStore.room.id,
  }

  const response = await roomApi.worlds.get(reqForm)

  worlds.value = response.data
  selectedWorldID.value = worlds.value[0]?.id || 0
}

const list = ref([])

const getList = () => {
  const reqForm = {
    roomID: globalStore.room.id,
    worldID: selectedWorldID.value,
    logType: 'game',
  }

  logsApi.history.list.get(reqForm).then(response => {
    list.value = response.data
  })
}

const selectedFilename = ref('')
const historyContent = ref('')
const getHistoryFileContentLoading = ref(false)

const getHistoryFileContent = () => {
  getHistoryFileContentLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
    worldID: selectedWorldID.value,
    logType: 'game',
    logFile: selectedFilename.value,
  }

  logsApi.history.content.get(reqForm).then(response => {
    historyContent.value = ""
    historyContent.value = response.data
  }).finally(() => {
    getHistoryFileContentLoading.value = false
  })
}

let intervalId = null

const startRequests = () => {
  intervalId = setInterval(() => {
    if (autoPull.value) {
      getLogContent()
    }
  }, 2000)
}

const cancelRequests = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const calculateLines = () => {
  const other = 390 + 37

  // 只返回计算的行数，不设置 lines.value
  return Math.round(Math.max(2, Math.floor(windowHeight.value - other)) / 22.5)
}

const calculateHeight = () => {
  return Math.max(2, Math.floor(windowHeight.value - 160 - 37))
}

const windowHeight = ref(window.innerHeight)

const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
  lines.value = calculateLines()
}, 200)

onMounted(async () => {
  if (globalStore.room.id === 0) {
    return
  }
  window.addEventListener('resize', handleResize)
  await getWorlds()
  getList()
  lines.value = calculateLines()
  startRequests()
})

onBeforeUnmount(() => {
  cancelRequests()
  window.removeEventListener('beforeunload', cancelRequests)
  window.removeEventListener('resize', handleResize)
})
</script>

