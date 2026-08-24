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
        <single-log
          v-if="activeTabName==='current'"
          type="chat"
          chat
        />
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
                  v-model="selectedFilename"
                  :items="list"
                  :disabled="getHistoryFileContentLoading"
                  :loading="getHistoryFileContentLoading"
                  :label="t('logs.logFile')"
                  density="compact"
                  min-width="150px"
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
  </check>
</template>

<script setup>
import SingleLog from "@/views/logs/components/singleLog.vue"
import { debounce } from "@/utils/tools"
import useGlobalStore from "@store/global"
import useUserStore from "@store/user"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import Log from "@/views/logs/components/log.vue"
import logsApi from "@/api/logs"


const globalStore = useGlobalStore()
const userStore = useUserStore()
const { mobile } = useDisplay()
const { t } = useI18n()
const activeTabName = ref('current')
const otherHeight = 197


const list = ref([])

const getList = () => {
  const reqForm = {
    roomID: globalStore.room.id,
    worldID: 0,
    logType: 'chat',
  }

  logsApi.history.list.get(reqForm).then(response => {
    list.value = response.data || []
  })
}

const selectedFilename = ref('')
const historyContent = ref('')
const getHistoryFileContentLoading = ref(false)

const getHistoryFileContent = () => {
  getHistoryFileContentLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
    worldID: 0,
    logType: 'chat',
    logFile: selectedFilename.value,
  }

  logsApi.history.content.get(reqForm).then(response => {
    historyContent.value = ""
    historyContent.value = response.data
  }).finally(() => {
    getHistoryFileContentLoading.value = false
  })
}

const calculateHeight = () => {
  return Math.max(2, Math.floor(windowHeight.value - otherHeight))
}

const windowHeight = ref(window.innerHeight)

const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
}, 200)

onMounted(async () => {
  if (globalStore.room.id === 0) {
    return
  }
  getList()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
