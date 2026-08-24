<template>
  <v-card
    class="mt-4"
    :height="props.height-70"
  >
    <v-card-title>
      <div class="fcb">
        <div v-if="!mobile">
          {{ t('game.player.chat.title') }}
        </div>
        <div v-if="mobile" />

        <div class="fcc">
          <v-dialog
            v-model="chatDialogVisible"
            class="flex-wrap"
            :width="mobile?'90%':'40%'"
            min-height="200px"
          >
            <template #activator="{ props: activatorProps }">
              <v-btn
                v-if="!mobile"
                class="mr-4"
                color="info"
                v-bind="activatorProps"
                @click="sendMessage=''"
              >
                {{ t('game.player.chat.send.start') }}
              </v-btn>
              <v-btn
                v-if="mobile"
                class="mr-4"
                color="info"
                variant="text"
                icon="ri-send-ins-line"
                v-bind="activatorProps"
                @click="sendMessage=''"
              />
            </template>
            <template #default>
              <v-card>
                <v-row class="ma-2">
                  <v-col cols="12">
                    <v-radio-group
                      v-model="sendMessageType"
                      inline
                    >
                      <template #prepend>
                        <v-chip>
                          {{ t('game.player.chat.send.sendMessageType') }}
                        </v-chip>
                      </template>
                      <v-radio
                        :label="t('game.player.chat.send.announce')"
                        value="announce"
                      />
                      <v-radio
                        :label="t('game.player.chat.send.systemMsg')"
                        value="systemMsg"
                      />
                    </v-radio-group>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="sendMessage"
                      @keyup.enter="handleSendMessage"
                    >
                      <template #append>
                        <v-btn
                          icon="ri-send-ins-line"
                          variant="text"
                          @click="handleSendMessage"
                        />
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </template>
          </v-dialog>

          <v-number-input
            v-model="lines"
            :label="t('game.player.chat.lines')"
            density="compact"
            width="120"
            hide-details
            :min="1"
            :loading="loading"
            class="mr-4"
          />
          <v-select
            v-if="!mobile"
            v-model="selectedTypes"
            :items="allTypes"
            density="compact"
            :label="t('game.player.chat.typeSelect')"
            multiple
            clearable
            :width="globalStore.language==='zh'?240:280"
            class="mr-4"
            @update:menu="getChatMessages"
          >
            <template #selection="{ item, index }">
              <v-chip
                v-if="index < 1"
                label
                :text="item.title"
              />
              <v-chip
                v-if="index === 1"
                label
              >
                <span v-tooltip="selectedTypes.slice(1).map(key => allTypes.find(i => i.value === key)?.title || key).join(', ')">
                  +{{ selectedTypes.length - 1 }}
                </span>
              </v-chip>
            </template>
          </v-select>
          <v-chip
            v-if="!mobile"
            v-tooltip="t('game.player.chat.needTime.tip')"
            label
            size="large"
            class="mr-4"
          >
            <span class="mr-2">
              {{ t('game.player.chat.needTime.text') }}
            </span>
            <v-switch
              v-model="needTime"
              hide-details
              color="info"
              :loading="loading"
              @update:model-value="getChatMessages(false)"
            />
          </v-chip>
          <v-chip
            v-if="!mobile"
            v-tooltip="t('game.player.chat.autoPullTip')"
            label
            size="large"
            class="mr-4"
          >
            <span class="mr-2">
              {{ t('game.player.chat.autoPull') }}
            </span>
            <v-switch
              v-model="autoPull"
              hide-details
              color="info"
            />
          </v-chip>
          <v-switch
            v-if="mobile"
            v-model="needTime"
            v-tooltip="t('game.player.chat.needTime.tip')"
            hide-details
            color="info"
            :loading="loading"
            class="mr-4"
            @update:model-value="getChatMessages(false)"
          />
          <v-btn
            color="x"
            :loading="loading"
            @click="getChatMessages(false)"
          >
            {{ t('game.player.chat.refresh') }}
          </v-btn>
        </div>
      </div>
    </v-card-title>

    <v-card-text
      v-if="chatMessages.length"
      ref="chatContainer"
      class="overflow-y-auto"
      :style="{ height: `${props.height - 125}px` }"
      @wheel="handleChatWheel"
      @scroll="handleChatScroll"
    >
      <v-list lines="two">
        <v-list-item
          v-for="(p, i) in chatMessages"
          :key="i"
          variant="outlined"
          rounded
          class="mb-2"
        >
          <div
            class="chat-message"
            :class="{ 'chat-message--with-time': needTime }"
          >
            <div class="chat-message__type">
              <div style="width: 75px; height: 75px; flex-shrink: 0;">
                <v-img
                  :src="getImage(p.type)"
                  contain
                  style="width: 100%; height: 100%;"
                />
              </div>
              <v-chip class="ml-2">
                {{ t(`game.player.chat.type.${p.type}`) }}
              </v-chip>
            </div>
            <div
              v-if="needTime"
              class="chat-message__time d-flex align-center"
            >
              <v-chip label>
                {{ timestamp2time(p.time*1000) }}
              </v-chip>
            </div>
            <div class="chat-message__nickname d-flex align-center">
              <v-chip
                label
                color="info"
                class="mr-2"
              >
                {{ p.nickname }}
              </v-chip>
            </div>
            <div class="chat-message__content d-flex align-center">
              <v-chip
                v-if="p.type==='VoteAnnouncement'"
                label
                color="success"
              >
                {{ t(`game.player.chat.type['${p.message}']`) }}
              </v-chip>
              <v-chip
                v-else-if="p.type==='SkinAnnouncement'"
                label
                color="success"
              >
                <template #append>
                  <v-btn
                    v-tooltip="t(`game.player.chat.gotoWiki`)"
                    icon="ri-question-line"
                    color="success"
                    density="compact"
                    variant="text"
                    :href="generateSkinUrl(p.message)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="ml-2"
                  />
                </template>
                {{ p.message }}
              </v-chip>
              <v-chip
                v-else
                label
                color="success"
              >
                <v-tooltip
                  v-if="mobile"
                  activator="parent"
                  location="top"
                >
                  {{ p.message }}
                </v-tooltip>
                {{ p.message }}
              </v-chip>
            </div>
          </div>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-text v-else>
      <result
        :height="props.height - 70"
        type="info"
        :title="t('game.player.chat.noMessage')"
      >
        <v-btn
          color="info"
          @click="getChatMessages"
        >
          {{ t('game.player.chat.clickRefresh') }}
        </v-btn>
      </result>
    </v-card-text>
  </v-card>
</template>

<script setup>
import playerApi from "@/api/player"
import useGlobalStore from "@store/global"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import Result from "@/components/Result.vue"
import { timestamp2time } from "@/utils/tools.js"
import { showSnackbar } from "@/utils/snackbar.js"
import dashboardApi from "@/api/dashboard.js"


const props = defineProps({
  height: {
    type: Number,
    default: 0,
  },
})

const globalStore = useGlobalStore()
const { mobile } = useDisplay()
const { t } = useI18n()

const chatMessages = ref([])
const lines = ref(20)
const needTime = ref(true)
const chatContainer = ref()
const loading = ref(false)
const autoPull = ref(true)

const handleChatWheel = event => {
  if (event.deltaY < 0 && autoPull.value) {
    autoPull.value = false
    showSnackbar(t('game.player.chat.autoPullDisabledByScroll'), 'info')
  }
}

const handleChatScroll = event => {
  const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
  const distanceToBottom = scrollHeight - scrollTop - clientHeight

  if (distanceToBottom <= 2 && !autoPull.value) {
    autoPull.value = true
    showSnackbar(t('game.player.chat.autoPullEnabledAtBottom'), 'info')
  }
}

const scrollToBottom = () => {
  setTimeout(() => {
    if (chatContainer.value && chatContainer.value.$el) {
      chatContainer.value.$el.scrollTo({
        top: chatContainer.value.$el.scrollHeight,
        behavior: 'smooth',
      })
    } else if (chatContainer.value) {
      chatContainer.value.scrollTo({
        top: chatContainer.value.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, 100)
}

watch(chatMessages, newVal => {
  if (newVal && newVal.length > 0) {
    nextTick(() => {
      scrollToBottom()
    })
  }
}, { deep: true })

const getChatMessages = (isOpen=false) => {
  if (isOpen) return
  loading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
    lines: lines.value,
    needTime: needTime.value,
  }

  playerApi.chat.get(reqForm).then(response => {
    const messages = response.data || []

    chatMessages.value = []
    if (selectedTypes.value.length === 0) {
      selectedTypes.value = types
    }
    for (const m of messages) {
      if (selectedTypes.value.includes(m.type)) {
        chatMessages.value.push(m)
      }
    }
  }).finally(() => {
    loading.value = false
  })
}

const generateSkinUrl = name => {
  if (!name) return name
  const wikiName = name.charAt(0).toUpperCase() + name.slice(1)

  return `https://dontstarve.huijiwiki.com/wiki/文件:${wikiName}_icon.png`
}

const types = [
  'Announcement',
  'BanAnnouncement',
  'DeathAnnouncement',
  'JoinAnnouncement',
  'KickAnnouncement',
  'LeaveAnnouncement',
  'ResurrectAnnouncement',
  'RollAnnouncement',
  'Say',
  'SkinAnnouncement',
  'SystemMessage',
  'VoteAnnouncement',
]

const getImage = type => {
  let name = 'Undefined'
  if (types.includes(type)) {
    name = type
  }

  return new URL(`./images/${name}.png`, import.meta.url).href
}

const selectedTypes = ref([])
const allTypes = ref([])

const chatDialogVisible = ref(false)
const sendMessage = ref('')
const sendMessageType = ref('announce')

const handleSendMessage = () => {
  if (sendMessage.value.length === 0) {
    return
  }

  const reqForm = {
    type: sendMessageType.value,
    roomID: globalStore.room.id,
    extra: sendMessage.value,
  }

  dashboardApi.exec.game.post(reqForm).then(response => {
    showSnackbar(response.message)
    chatDialogVisible.value = false
  }).finally(() => {
    getChatMessages()
  })
}

let intervalId = null

const startRequests = () => {
  intervalId = setInterval(() => {
    if (autoPull.value) {
      getChatMessages()
    }
  }, 5000)
}

const cancelRequests = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onMounted(() => {
  for (const i of types) {
    allTypes.value.push({
      title: t(`game.player.chat.type.${i}`),
      value: i,
    })
  }
  selectedTypes.value = types
  getChatMessages()
  startRequests()
})

onBeforeUnmount(() => {
  cancelRequests()
  window.removeEventListener('beforeunload', cancelRequests)
})
</script>

<style scoped>
.chat-message {
  display: grid;
  grid-template-columns: max-content 160px minmax(0, 1fr);
  align-items: center;
  gap: 20px 24px;
  width: 100%;
}

.chat-message--with-time {
  grid-template-columns: max-content max-content 160px minmax(0, 1fr);
}

.chat-message__type,
.chat-message__time,
.chat-message__nickname,
.chat-message__content {
  min-width: 0;
}

.chat-message__type {
  display: flex;
  align-items: center;
}

.chat-message__content {
  justify-content: flex-start;
}

.chat-message__nickname :deep(.v-chip) {
  max-width: 100%;
}

.chat-message__nickname :deep(.v-chip__content) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-message__content :deep(.v-chip) {
  max-width: 100%;
  height: auto;
  min-height: 32px;
  white-space: normal;
}

.chat-message__content :deep(.v-chip__content) {
  min-width: 0;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
  line-height: 1.5;
  padding-block: 6px;
}

@media (max-width: 960px) {
  .chat-message {
    grid-template-columns: 75px minmax(0, 1fr);
    gap: 16px 12px;
  }

  .chat-message__type {
    display: contents;
  }

  .chat-message__type > div {
    grid-column: 1;
    grid-row: 1 / span 3;
    align-self: center;
  }

  .chat-message--with-time .chat-message__type > div {
    grid-row: 1 / span 4;
  }

  .chat-message__type :deep(.v-chip) {
    grid-column: 2;
    grid-row: 1;
    justify-self: start;
    max-width: 100%;
    height: auto;
    min-height: 32px;
    margin-inline-start: 0 !important;
    white-space: normal;
  }

  .chat-message__type :deep(.v-chip__content) {
    min-width: 0;
    white-space: normal;
    overflow-wrap: anywhere;
    line-height: 1.4;
    padding-block: 4px;
  }

  .chat-message__time {
    grid-column: 2;
    grid-row: 2;
  }

  .chat-message__nickname {
    grid-column: 2;
    grid-row: 2;
  }

  .chat-message--with-time .chat-message__nickname {
    grid-row: 3;
  }

  .chat-message__content {
    grid-column: 2;
    grid-row: 3;
  }

  .chat-message--with-time .chat-message__content {
    grid-row: 4;
  }
}
</style>
