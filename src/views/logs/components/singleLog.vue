<template>
  <v-card
    :height="calculateHeight()"
    flat
  >
    <v-card-title class="my-2">
      <div class="card-header">
        <span v-if="props.chat">
          {{ t('logs.current') }}
        </span>
        <span v-else>
          {{ t(`logs.${props.type}`) }}
        </span>
        <div class="fcc">
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
</template>

<script setup>
import Log from "@/views/logs/components/log.vue"
import useGlobalStore from "@store/global.js"
import logsApi from "@/api/logs.js"
import { debounce } from "@/utils/tools.js"
import { useI18n } from "vue-i18n"
import { useDisplay } from "vuetify/framework"

const props = defineProps({
  type: {
    type: String,
    default: "",
  },
  chat: {
    type: Boolean,
    default: false,
  },
})

const globalStore = useGlobalStore()
const { mobile } = useDisplay()
const { t } = useI18n()

const content = ref('')
const autoPull= ref(true)
const lines = ref(0)

const firstPullFinished = ref(false)

const getLogContent = () => {
  const reqForm = {
    roomID: globalStore.room.id,
    worldID: 0,
    logType: props.type,
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
  let other = 390

  if (props.chat) {
    other = other + 37
  }

  // 只返回计算的行数，不设置 lines.value
  return Math.round(Math.max(2, Math.floor(windowHeight.value - other)) / 22.5)
}

const calculateHeight = () => {
  let other = 0

  if (props.chat) {
    other = 37
  }
  
  return Math.max(2, Math.floor(windowHeight.value - 160 - other))
}

const windowHeight = ref(window.innerHeight)

const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
  lines.value = calculateLines()
}, 200)

onMounted(async () => {
  window.addEventListener('resize', handleResize)
  lines.value = calculateLines()
  startRequests()
})

onBeforeUnmount(() => {
  cancelRequests()
  window.removeEventListener('beforeunload', cancelRequests)
  window.removeEventListener('resize', handleResize)
})
</script>

