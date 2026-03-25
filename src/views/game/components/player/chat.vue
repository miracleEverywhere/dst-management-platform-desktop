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
                +{{ selectedTypes.length - 1 }}
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
    >
      <v-list lines="two">
        <v-list-item
          v-for="(p, i) in chatMessages"
          :key="i"
          variant="outlined"
          rounded
          class="mb-2"
        >
          <v-row>
            <v-col class="d-flex align-center">
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
            </v-col>
            <v-col
              v-if="needTime"
              class="d-flex align-center"
            >
              <v-chip label>
                {{ timestamp2time(p.time*1000) }}
              </v-chip>
            </v-col>
            <v-col class="d-flex align-center">
              <v-chip
                label
                color="info"
                class="mr-2"
              >
                {{ p.nickname }}
              </v-chip>
            </v-col>
            <v-col class="d-flex align-center">
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
            </v-col>
          </v-row>
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
const needTime = ref(false)
const chatContainer = ref()
const loading = ref(false)

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

onMounted(() => {
  for (const i of types) {
    allTypes.value.push({
      title: t(`game.player.chat.type.${i}`),
      value: i,
    })
  }
  selectedTypes.value = types
  getChatMessages()
})
</script>
