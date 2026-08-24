<template>
  <check
    :category="['game', 'room', 'plugin']"
    :other-height="otherHeight"
    :plugin-name="pluginName"
  >
    <v-tabs
      v-model="activeTabName"
      align-tabs="start"
      color="primary"
      show-arrows
      @update:model-value="handleTabChange"
    >
      <v-tab value="room">
        {{ t('tools.ai.tabs.room') }}
      </v-tab>
      <v-tab
        v-if="isAdmin"
        value="base"
      >
        {{ t('tools.ai.tabs.base') }}
      </v-tab>
    </v-tabs>

    <v-tabs-window v-model="activeTabName">
      <v-tabs-window-item value="room">
        <v-container
          fluid
          :height="calculateContainerSize()"
          width="100%"
          class="w-100 pa-4"
          style="overflow-y: auto"
        >
          <v-card>
            <v-form
              ref="roomFormRef"
              @submit.prevent="handleRoomSave"
            >
              <v-toolbar flat>
                <v-toolbar-title>
                  <v-icon
                    icon="ri-chat-smile-ai-3-line"
                    start
                  />
                  {{ t('tools.ai.tabs.room') }}
                </v-toolbar-title>
                <v-spacer />

                <v-btn
                  v-if="mobile"
                  v-tooltip="t('tools.ai.actions.refresh')"
                  icon="ri-refresh-line"
                  :loading="roomLoading"
                  variant="text"
                  type="button"
                  @click="getRoomSetting"
                />
                <v-btn
                  v-else
                  prepend-icon="ri-refresh-line"
                  :loading="roomLoading"
                  variant="text"
                  type="button"
                  @click="getRoomSetting"
                >
                  {{ t('tools.ai.actions.refresh') }}
                </v-btn>
                <v-btn
                  v-if="mobile"
                  v-tooltip="t('tools.ai.actions.save')"
                  icon="ri-save-2-line"
                  :loading="roomSaving"
                  color="primary"
                  type="submit"
                />
                <v-btn
                  v-else
                  prepend-icon="ri-save-2-line"
                  :loading="roomSaving"
                  color="primary"
                  type="submit"
                  class="mr-4"
                >
                  {{ t('tools.ai.actions.save') }}
                </v-btn>
              </v-toolbar>
              <v-divider />

              <v-card-text v-if="roomLoading">
                <v-skeleton-loader type="article, actions" />
              </v-card-text>
              <v-card-text
                v-else
                class="pt-6"
              >
                <v-row>
                  <v-col cols="12">
                    <v-alert
                      border="start"
                      color="error"
                      variant="tonal"
                      class="my-4"
                    >
                      {{ t('tools.ai.tabTip') }}
                    </v-alert>
                  </v-col>
                  <v-col
                    cols="12"
                    class="mb-2"
                  >
                    <div class="d-flex align-center">
                      <v-chip
                        v-tooltip="t('tools.ai.form.enabled.tip')"
                        label
                        class="mr-4"
                      >
                        {{ t('tools.ai.form.enabled.name') }}
                      </v-chip>
                      <v-switch
                        v-model="roomForm.enabled"
                        color="primary"
                        hide-details
                        inset
                      />
                    </div>

                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="roomForm.prefix"
                      v-tooltip="t('tools.ai.form.prefix.tip')"
                      :label="t('tools.ai.form.prefix.name')"
                      :rules="roomFormRules.prefix"
                      counter="64"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-number-input
                      v-model="roomForm.maxResults"
                      v-tooltip="t('tools.ai.form.maxResults.tip')"
                      :label="t('tools.ai.form.maxResults.name')"
                      :rules="roomFormRules.maxResults"
                      :min="1"
                      :max="20"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-number-input
                      v-model="roomForm.maxReplyLength"
                      v-tooltip="t('tools.ai.form.maxReplyLength.tip')"
                      :label="t('tools.ai.form.maxReplyLength.name')"
                      :rules="roomFormRules.maxReplyLength"
                      :min="100"
                      :max="300"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-form>
          </v-card>
        </v-container>
      </v-tabs-window-item>

      <v-tabs-window-item
        v-if="isAdmin"
        value="base"
      >
        <v-container
          v-if="activeTabName === 'base'"
          fluid
          :height="calculateContainerSize()"
          width="100%"
          class="w-100 pa-4"
          style="overflow-y: auto"
        >
          <v-card>
            <v-form
              ref="baseFormRef"
              @submit.prevent="handleBaseSave"
            >
              <v-toolbar flat>
                <v-toolbar-title>
                  <v-icon
                    icon="ri-settings-3-line"
                    start
                  />
                  {{ t('tools.ai.tabs.base') }}
                </v-toolbar-title>
                <v-spacer />
                <v-btn
                  v-if="mobile"
                  v-tooltip="t('tools.ai.actions.refresh')"
                  icon="ri-refresh-line"
                  :loading="baseLoading"
                  variant="text"
                  type="button"
                  @click="getBaseSetting"
                />
                <v-btn
                  v-else
                  prepend-icon="ri-refresh-line"
                  :loading="baseLoading"
                  variant="text"
                  type="button"
                  @click="getBaseSetting"
                >
                  {{ t('tools.ai.actions.refresh') }}
                </v-btn>
                <v-btn
                  v-if="mobile"
                  v-tooltip="t('tools.ai.actions.save')"
                  icon="ri-save-2-line"
                  :loading="baseSaving"
                  color="primary"
                  type="submit"
                />
                <v-btn
                  v-else
                  prepend-icon="ri-save-2-line"
                  :loading="baseSaving"
                  color="primary"
                  type="submit"
                  class="mr-4"
                >
                  {{ t('tools.ai.actions.save') }}
                </v-btn>
              </v-toolbar>
              <v-divider />

              <v-card-text v-if="baseLoading">
                <v-skeleton-loader type="article, article, actions" />
              </v-card-text>
              <v-card-text
                v-else
                class="pt-6"
              >
                <v-alert
                  border="start"
                  color="error"
                  variant="tonal"
                  class="my-4"
                >
                  {{ t('tools.ai.tabTip') }}
                </v-alert>

                <v-alert
                  :title="t('tools.ai.sections.chatModel')"
                  color="primary"
                  density="compact"
                  icon="ri-chat-ai-line"
                  variant="tonal"
                />
                <v-row class="mt-2">
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="baseForm.chatBaseURL"
                      v-tooltip="t('tools.ai.form.chatBaseURL.tip')"
                      :label="t('tools.ai.form.chatBaseURL.name')"
                      :rules="baseFormRules.chatBaseURL"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="baseForm.chatModel"
                      v-tooltip="t('tools.ai.form.chatModel.tip')"
                      :label="t('tools.ai.form.chatModel.name')"
                      :rules="baseFormRules.chatModel"
                      counter="256"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="baseForm.chatApiKey"
                      v-tooltip="t('tools.ai.form.chatApiKey.tip')"
                      :append-inner-icon="isChatApiKeyVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                      :label="t('tools.ai.form.chatApiKey.name')"
                      :rules="baseFormRules.apiKey"
                      :type="isChatApiKeyVisible ? 'text' : 'password'"
                      autocomplete="off"
                      @click:append-inner="isChatApiKeyVisible = !isChatApiKeyVisible"
                    />
                  </v-col>
                </v-row>

                <v-alert
                  :title="t('tools.ai.sections.embeddingModel')"
                  color="info"
                  density="compact"
                  icon="ri-database-2-line"
                  variant="tonal"
                  class="mt-4"
                />
                <v-alert
                  border="start"
                  color="info"
                  variant="tonal"
                  class="my-4"
                >
                  {{ t(`tools.ai.form.embeddingTip`) }}
                </v-alert>
                <v-row class="mt-2">
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="baseForm.embeddingBaseURL"
                      v-tooltip="t('tools.ai.form.embeddingBaseURL.tip')"
                      :label="t('tools.ai.form.embeddingBaseURL.name')"
                      :rules="baseFormRules.embeddingBaseURL"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="baseForm.embeddingModel"
                      v-tooltip="t('tools.ai.form.embeddingModel.tip')"
                      :label="t('tools.ai.form.embeddingModel.name')"
                      :rules="baseFormRules.embeddingModel"
                      counter="256"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="baseForm.embeddingApiKey"
                      v-tooltip="t('tools.ai.form.embeddingApiKey.tip')"
                      :append-inner-icon="isEmbeddingApiKeyVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                      :label="t('tools.ai.form.embeddingApiKey.name')"
                      :rules="baseFormRules.apiKey"
                      :type="isEmbeddingApiKeyVisible ? 'text' : 'password'"
                      autocomplete="off"
                      @click:append-inner="isEmbeddingApiKeyVisible = !isEmbeddingApiKeyVisible"
                    />
                  </v-col>
                </v-row>

                <v-alert
                  :title="t('tools.ai.sections.generation')"
                  color="primary"
                  density="compact"
                  icon="ri-equalizer-2-line"
                  variant="tonal"
                  class="mt-4"
                />
                <v-alert
                  border="start"
                  color="primary"
                  variant="tonal"
                  class="my-4"
                >
                  {{ t(`tools.ai.form.systemPrompt.advice`) }}
                </v-alert>
                <v-row class="mt-2">
                  <v-col cols="12">
                    <v-textarea
                      v-model="baseForm.systemPrompt"
                      v-tooltip="t('tools.ai.form.systemPrompt.tip')"
                      :label="t('tools.ai.form.systemPrompt.name')"
                      :rules="baseFormRules.systemPrompt"
                      auto-grow
                      counter="8000"
                      rows="4"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-number-input
                      v-model="baseForm.temperature"
                      v-tooltip="t('tools.ai.form.temperature.tip')"
                      :label="t('tools.ai.form.temperature.name')"
                      :rules="baseFormRules.temperature"
                      :min="0"
                      :max="2"
                      :step="0.1"
                      :precision="1"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-number-input
                      v-model="baseForm.maxTokens"
                      v-tooltip="t('tools.ai.form.maxTokens.tip')"
                      :label="t('tools.ai.form.maxTokens.name')"
                      :rules="baseFormRules.maxTokens"
                      :min="1"
                      :max="32768"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-number-input
                      v-model="baseForm.requestTimeoutSeconds"
                      v-tooltip="t('tools.ai.form.requestTimeoutSeconds.tip')"
                      :label="t('tools.ai.form.requestTimeoutSeconds.name')"
                      :rules="baseFormRules.requestTimeoutSeconds"
                      :min="1"
                      :max="300"
                    />
                  </v-col>
                </v-row>

                <v-alert
                  :title="t('tools.ai.sections.context')"
                  color="info"
                  density="compact"
                  icon="ri-history-line"
                  variant="tonal"
                  class="mt-4"
                />
                <v-row class="mt-2">
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-number-input
                      v-model="baseForm.contextMaxMessages"
                      v-tooltip="t('tools.ai.form.contextMaxMessages.tip')"
                      :label="t('tools.ai.form.contextMaxMessages.name')"
                      :rules="baseFormRules.contextMaxMessages"
                      :min="2"
                      :max="100"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-number-input
                      v-model="baseForm.contextTTLMinutes"
                      v-tooltip="t('tools.ai.form.contextTTLMinutes.tip')"
                      :label="t('tools.ai.form.contextTTLMinutes.name')"
                      :rules="baseFormRules.contextTTLMinutes"
                      :min="1"
                      :max="10080"
                    />
                  </v-col>
                </v-row>

                <v-alert
                  :title="t('tools.ai.sections.maintenance')"
                  color="warning"
                  density="compact"
                  icon="ri-loop-right-line"
                  variant="tonal"
                  class="mt-4"
                />
                <v-alert
                  border="start"
                  color="warning"
                  variant="tonal"
                  class="my-4"
                >
                  {{ t(`tools.ai.actions.rebuildEmbeddingTip`) }}
                </v-alert>
                <div class="d-flex flex-wrap ga-3 mt-4">
                  <v-btn
                    prepend-icon="ri-book-open-line"
                    :loading="keywordRebuildLoading"
                    color="warning"
                    @click="keywordRebuildConfirmVisible = true"
                  >
                    {{ t('tools.ai.actions.rebuildKeyword') }}
                  </v-btn>
                  <v-btn
                    prepend-icon="ri-database-2-line"
                    :loading="embeddingRebuildLoading"
                    color="warning"
                    @click="embeddingRebuildConfirmVisible = true"
                  >
                    {{ t('tools.ai.actions.rebuildEmbedding') }}
                  </v-btn>
                </div>

                <confirm-box
                  v-model="keywordRebuildConfirmVisible"
                  type="warning"
                  :title="t('tools.ai.actions.rebuildKeyword')"
                  :content="t('tools.ai.actions.rebuildKeywordConfirm')"
                  :confirm-text="t('global.confirm.confirm')"
                  :cancel-text="t('global.confirm.cancel')"
                  :confirm-loading="keywordRebuildLoading"
                  @confirm="handleKeywordRebuild"
                  @cancel="keywordRebuildConfirmVisible = false"
                />
                <confirm-box
                  v-model="embeddingRebuildConfirmVisible"
                  type="warning"
                  :title="t('tools.ai.actions.rebuildEmbedding')"
                  :content="t('tools.ai.actions.rebuildEmbeddingConfirm')"
                  :confirm-text="t('global.confirm.confirm')"
                  :cancel-text="t('global.confirm.cancel')"
                  :confirm-loading="embeddingRebuildLoading"
                  @confirm="handleEmbeddingRebuild"
                  @cancel="embeddingRebuildConfirmVisible = false"
                />
              </v-card-text>
            </v-form>
          </v-card>
        </v-container>
      </v-tabs-window-item>
    </v-tabs-window>
  </check>
</template>

<script setup>
import toolsApi from "@/api/tools.js"
import { debounce } from "@/utils/tools.js"
import { showSnackbar } from "@/utils/snackbar.js"
import useGlobalStore from "@store/global.js"
import useUserStore from "@store/user.js"
import { useI18n } from "vue-i18n"
import { useDisplay } from "vuetify/framework"

const globalStore = useGlobalStore()
const userStore = useUserStore()
const { t } = useI18n()
const { mobile } = useDisplay()

const pluginName = 'ai_chat'
const otherHeight = 150
const activeTabName = ref('room')
const isAdmin = computed(() => userStore.userInfo.role === 'admin')
const windowHeight = ref(window.innerHeight)

const createRoomForm = () => ({
  roomID: globalStore.room.id,
  enabled: false,
  prefix: '',
  maxResults: 10,
  maxReplyLength: 200,
})

const createBaseForm = () => ({
  chatBaseURL: '',
  chatApiKey: '',
  chatModel: '',
  embeddingBaseURL: '',
  embeddingApiKey: '',
  embeddingModel: '',
  systemPrompt: '',
  temperature: 0.7,
  maxTokens: 512,
  requestTimeoutSeconds: 60,
  contextMaxMessages: 10,
  contextTTLMinutes: 30,
})

const roomFormRef = ref()
const baseFormRef = ref()
const roomForm = ref(createRoomForm())
const baseForm = ref(createBaseForm())
const roomLoading = ref(false)
const roomSaving = ref(false)
const baseLoading = ref(false)
const baseSaving = ref(false)
const baseLoaded = ref(false)
const keywordRebuildLoading = ref(false)
const embeddingRebuildLoading = ref(false)
const keywordRebuildConfirmVisible = ref(false)
const embeddingRebuildConfirmVisible = ref(false)
const isChatApiKeyVisible = ref(false)
const isEmbeddingApiKeyVisible = ref(false)

const getCharacterLength = value => [...String(value ?? '')].length

const requiredRule = value => value !== undefined && value !== null && value !== ''
  || t('tools.ai.validation.required')

const rangeRule = (minimum, maximum) => value => {
  const number = Number(value)

  return Number.isFinite(number) && number >= minimum && number <= maximum
    || t('tools.ai.validation.range', { minimum, maximum })
}

const integerRangeRule = (minimum, maximum) => value => {
  const number = Number(value)

  return Number.isInteger(number) && number >= minimum && number <= maximum
    || t('tools.ai.validation.integerRange', { minimum, maximum })
}

const maxLengthRule = maximum => value => getCharacterLength(value) <= maximum
  || t('tools.ai.validation.maxLength', { maximum })

const apiKeyRule = value => new TextEncoder().encode(String(value ?? '')).length <= 16384
  || t('tools.ai.validation.apiKey')

const urlRule = (value, required = false) => {
  if (!value) return required ? t('tools.ai.validation.required') : true

  try {
    const url = new URL(value)

    return ['http:', 'https:'].includes(url.protocol) || t('tools.ai.validation.url')
  } catch {
    return t('tools.ai.validation.url')
  }
}

const roomFormRules = {
  prefix: [value => !/[\r\n]/u.test(value ?? '') && getCharacterLength(value) <= 64
    || t('tools.ai.validation.prefix')],
  maxResults: [integerRangeRule(1, 20)],
  maxReplyLength: [integerRangeRule(100, 300)],
}

const baseFormRules = {
  chatBaseURL: [value => urlRule(value, true)],
  chatModel: [requiredRule, maxLengthRule(256)],
  embeddingBaseURL: [value => urlRule(value)],
  embeddingModel: [maxLengthRule(256)],
  apiKey: [apiKeyRule],
  systemPrompt: [maxLengthRule(8000)],
  temperature: [rangeRule(0, 2)],
  maxTokens: [integerRangeRule(1, 32768)],
  requestTimeoutSeconds: [integerRangeRule(1, 300)],
  contextMaxMessages: [integerRangeRule(2, 100)],
  contextTTLMinutes: [integerRangeRule(1, 10080)],
}

const getRoomSetting = () => {
  const roomID = globalStore.room.id

  if (roomID === 0) return

  roomLoading.value = true
  toolsApi.aichat.setting.get({ roomID }).then(response => {
    if (roomID !== globalStore.room.id) return

    roomForm.value = {
      ...createRoomForm(),
      ...response.data,
      roomID,
    }
    nextTick(() => roomFormRef.value?.resetValidation())
  }).finally(() => {
    roomLoading.value = false
  })
}

const handleRoomSave = async () => {
  const { valid } = await roomFormRef.value.validate()

  if (!valid) return

  const requestForm = {
    roomID: globalStore.room.id,
    enabled: roomForm.value.enabled,
    prefix: roomForm.value.prefix,
    maxResults: Number(roomForm.value.maxResults),
    maxReplyLength: Number(roomForm.value.maxReplyLength),
  }

  roomSaving.value = true
  toolsApi.aichat.setting.put(requestForm).then(response => {
    showSnackbar(response.message)
    getRoomSetting()
  }).finally(() => {
    roomSaving.value = false
  })
}

const getBaseSetting = () => {
  if (!isAdmin.value) return

  baseLoading.value = true
  toolsApi.aichat.setting.base.get().then(response => {
    if (!isAdmin.value) return

    baseForm.value = {
      ...createBaseForm(),
      ...response.data,
    }
    baseLoaded.value = true
    nextTick(() => baseFormRef.value?.resetValidation())
  }).finally(() => {
    baseLoading.value = false
  })
}

const handleBaseSave = async () => {
  if (!isAdmin.value) return

  const { valid } = await baseFormRef.value.validate()

  if (!valid) return

  const requestForm = {
    chatBaseURL: baseForm.value.chatBaseURL,
    chatApiKey: baseForm.value.chatApiKey,
    chatModel: baseForm.value.chatModel,
    embeddingBaseURL: baseForm.value.embeddingBaseURL,
    embeddingApiKey: baseForm.value.embeddingApiKey,
    embeddingModel: baseForm.value.embeddingModel,
    systemPrompt: baseForm.value.systemPrompt,
    temperature: Number(baseForm.value.temperature),
    maxTokens: Number(baseForm.value.maxTokens),
    requestTimeoutSeconds: Number(baseForm.value.requestTimeoutSeconds),
    contextMaxMessages: Number(baseForm.value.contextMaxMessages),
    contextTTLMinutes: Number(baseForm.value.contextTTLMinutes),
  }

  baseSaving.value = true
  toolsApi.aichat.setting.base.put(requestForm).then(response => {
    showSnackbar(response.message)
    getBaseSetting()
  }).finally(() => {
    baseSaving.value = false
  })
}

const handleKeywordRebuild = () => {
  if (!isAdmin.value) return

  keywordRebuildLoading.value = true
  toolsApi.aichat.keyword.rebuild.post().then(response => {
    showSnackbar(response.message)
    keywordRebuildConfirmVisible.value = false
  }).finally(() => {
    keywordRebuildLoading.value = false
  })
}

const handleEmbeddingRebuild = () => {
  if (!isAdmin.value) return

  embeddingRebuildLoading.value = true
  toolsApi.aichat.embedding.rebuild.post().then(response => {
    showSnackbar(response.message)
    embeddingRebuildConfirmVisible.value = false
  }).finally(() => {
    embeddingRebuildLoading.value = false
  })
}

const handleTabChange = tab => {
  if (tab === 'base' && isAdmin.value && !baseLoaded.value) {
    getBaseSetting()
  }
}

const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
}, 200)

const calculateContainerSize = () => Math.max(2, Math.floor(windowHeight.value - otherHeight))

watch(isAdmin, admin => {
  if (admin) return

  activeTabName.value = 'room'
  baseLoaded.value = false
  baseForm.value = createBaseForm()
  isChatApiKeyVisible.value = false
  isEmbeddingApiKeyVisible.value = false
})

watch(() => globalStore.room.id, (roomID, previousRoomID) => {
  if (roomID > 0 && roomID !== previousRoomID) {
    getRoomSetting()
  }
})

onMounted(() => {
  window.addEventListener('resize', handleResize)
  getRoomSetting()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
