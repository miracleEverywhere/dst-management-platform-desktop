<template>
  <v-card v-if="!getGlobalSettingsLoading">
    <v-form ref="globalSettingsFormRef">
      <v-card-title>
        <div class="card-header">
          <div>
            {{ t('platform.settings.title') }}
          </div>
          <div>
            <v-btn
              :loading="updateLoading"
              @click="handleUpdate"
            >
              {{ t('platform.settings.submit') }}
            </v-btn>
          </div>
        </div>
      </v-card-title>
      <v-card-text>
        <!-- 在线玩家获取频率 -->
        <v-alert
          color="primary"
          :title="t('platform.settings.form.playerInfo.title')"
          density="compact"
          class="mt-4"
          variant="tonal"
          icon="ri-profile-line"
        />
        <v-row class="mt-2">
          <v-col>
            <v-number-input
              v-model="globalSettingsForm.playerGetFrequency"
              v-tooltip="t('platform.settings.form.playerGetFrequency.tip')"
              :rules="globalSettingsFormRules.playerGetFrequency"
              :label="t('platform.settings.form.playerGetFrequency.title')"
              :min="1"
              style="margin-bottom: -1.25rem"
            >
              <template #append-inner>
                <div style="width: 50px">
                  {{ t('platform.settings.form.playerGetFrequency.unit') }}
                </div>
              </template>
            </v-number-input>
          </v-col>
          <v-spacer v-if="!mobile" />
        </v-row>
        <v-row class="mt-2">
          <v-col>
            <v-number-input
              v-model="globalSettingsForm.playerInfoSaveTime"
              v-tooltip="t('platform.settings.form.playerInfoSaveTime.tip')"
              :rules="globalSettingsFormRules.playerInfoSaveTime"
              :label="t('platform.settings.form.playerInfoSaveTime.title')"
              :min="1"
              style="margin-bottom: -1.25rem"
            >
              <template #append-inner>
                <div style="width: 50px">
                  {{ t('platform.settings.form.playerInfoSaveTime.unit') }}
                </div>
              </template>
            </v-number-input>
          </v-col>
          <v-spacer v-if="!mobile" />
        </v-row>
        <!-- uid map -->
        <v-alert
          color="primary"
          :title="t('platform.settings.form.UIDMaintainEnable.title')"
          density="compact"
          class="mt-8"
          variant="tonal"
          icon="ri-flip-horizontal-line"
        />
        <v-row class="mt-2">
          <v-col>
            <v-radio-group
              v-model="globalSettingsForm.UIDMaintainEnable"
              inline
              color="primary"
            >
              <template #prepend>
                <v-chip v-tooltip="t('platform.settings.form.UIDMaintainEnable.tip')">
                  {{ t('platform.settings.form.UIDMaintainEnable.title') }}
                </v-chip>
              </template>
              <v-radio
                :label="t('game.base.step4.form.backupClean.enable')"
                :value="true"
              />
              <v-radio
                :label="t('game.base.step4.form.backupClean.disable')"
                :value="false"
              />
            </v-radio-group>
          </v-col>
          <v-spacer v-if="!mobile" />
        </v-row>
        <!-- 系统监控 -->
        <v-alert
          color="primary"
          :title="t('platform.settings.form.sysMetricsEnable.title')"
          density="compact"
          class="mt-8"
          variant="tonal"
          icon="ri-file-chart-line"
        />
        <v-row class="mt-2">
          <v-col>
            <v-radio-group
              v-model="globalSettingsForm.sysMetricsEnable"
              inline
              color="primary"
            >
              <template #prepend>
                <v-chip v-tooltip="t('platform.settings.form.sysMetricsEnable.tip')">
                  {{ t('platform.settings.form.sysMetricsEnable.title') }}
                </v-chip>
              </template>
              <v-radio
                :label="t('game.base.step4.form.backupClean.enable')"
                :value="true"
              />
              <v-radio
                :label="t('game.base.step4.form.backupClean.disable')"
                :value="false"
              />
            </v-radio-group>
          </v-col>
          <v-spacer v-if="!mobile" />
        </v-row>
        <v-row>
          <v-col>
            <v-number-input
              v-model="globalSettingsForm.sysMetricsSetting"
              v-tooltip="t('platform.settings.form.sysMetricsSetting.tip')"
              :rules="globalSettingsFormRules.sysMetricsSetting"
              :disabled="!globalSettingsForm.sysMetricsEnable"
              :label="t('platform.settings.form.sysMetricsSetting.title')"
              :min="1"
              style="margin-bottom: -1.25rem"
            >
              <template #append-inner>
                <div style="width: 50px">
                  {{ t('platform.settings.form.sysMetricsSetting.unit') }}
                </div>
              </template>
            </v-number-input>
          </v-col>
          <v-spacer v-if="!mobile" />
        </v-row>
        <!-- 游戏更新 -->
        <v-alert
          color="primary"
          :title="t('platform.settings.form.autoUpdateEnable.title')"
          density="compact"
          class="mt-8"
          variant="tonal"
          icon="ri-arrow-down-box-line"
        />
        <v-row class="mt-2">
          <v-col>
            <v-radio-group
              v-model="globalSettingsForm.autoUpdateEnable"
              inline
              color="primary"
            >
              <template #prepend>
                <v-chip v-tooltip="t('platform.settings.form.autoUpdateEnable.tip')">
                  {{ t('platform.settings.form.autoUpdateEnable.title') }}
                </v-chip>
              </template>
              <v-radio
                :label="t('game.base.step4.form.backupClean.enable')"
                :value="true"
              />
              <v-radio
                :label="t('game.base.step4.form.backupClean.disable')"
                :value="false"
              />
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="globalSettingsForm.autoUpdateSetting"
              v-tooltip="t('platform.settings.form.autoUpdateSetting.tip')"
              :disabled="!globalSettingsForm.autoUpdateEnable"
              :label="t('platform.settings.form.autoUpdateSetting.title')"
            >
              <v-menu
                :close-on-content-click="false"
                activator="parent"
              >
                <v-time-picker
                  v-model="globalSettingsForm.autoUpdateSetting"
                  use-seconds
                  format="24hr"
                />
              </v-menu>
            </v-text-field>
          </v-col>
          <v-spacer v-if="!mobile" />
        </v-row>
        <v-row>
          <v-col>
            <v-radio-group
              v-model="globalSettingsForm.autoUpdateRestart"
              inline
              color="primary"
            >
              <template #prepend>
                <v-chip v-tooltip="t('platform.settings.form.autoUpdateRestart.tip')">
                  {{ t('platform.settings.form.autoUpdateRestart.title') }}
                </v-chip>
              </template>
              <v-radio
                :label="t('game.base.step4.form.backupClean.enable')"
                :value="true"
              />
              <v-radio
                :label="t('game.base.step4.form.backupClean.disable')"
                :value="false"
              />
            </v-radio-group>
          </v-col>
        </v-row>
        <!-- Webhook 通知 -->
        <v-alert
          color="primary"
          :title="t('platform.settings.form.webhook.title')"
          density="compact"
          class="mt-8"
          variant="tonal"
          icon="ri-notification-3-line"
        />
        <v-row
          v-for="(webhook, i) in globalSettingsForm.webhook"
          :key="i"
          class="mt-2"
        >
          <v-col :cols="12">
            <v-card variant="outlined">
              <v-card-text>
                <v-row>
                  <v-col :cols="mobile?12:6">
                    <v-text-field
                      v-model="webhook.name"
                      :label="t('platform.settings.form.webhook.form.name')"
                      :rules="[v => !!v || t('platform.settings.form.webhook.form.nameRequired')]"
                      density="compact"
                    />
                  </v-col>
                  <v-col :cols="mobile?12:6">
                    <v-text-field
                      v-model="webhook.url"
                      :label="t('platform.settings.form.webhook.form.url')"
                      :rules="[v => !!v || t('platform.settings.form.webhook.form.urlRequired')]"
                      density="compact"
                    />
                  </v-col>
                  <v-col :cols="mobile?12:6">
                    <v-select
                      v-model="webhook.roomIds"
                      v-tooltip="t('platform.settings.form.webhook.form.roomIdsHint')"
                      :items="roomOptions"
                      :label="t('platform.settings.form.webhook.form.roomIds')"
                      item-title="roomName"
                      item-value="roomID"
                      multiple
                      density="compact"
                      clearable
                    >
                      <template #selection="{ item, index }">
                        <v-chip
                          v-if="index < (mobile?1:5)"
                          label
                          :text="item.title"
                        />
                        <v-chip
                          v-if="index === (mobile?1:5)"
                          label
                        >
                          <span v-tooltip="webhook.roomIds.slice(mobile ? 1 : 5).map(key => roomOptions.find(i => i.roomID === key)?.roomName || key).join(', ')">
                            +{{ webhook.roomIds.length - (mobile ? 1 : 5) }}
                          </span>
                        </v-chip>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col :cols="mobile?12:6">
                    <v-text-field
                      v-model="webhook.secret"
                      v-tooltip="t('platform.settings.form.webhook.form.secretPlaceholder')"
                      :append-inner-icon="isWebhookSecretVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                      :type="isWebhookSecretVisible ? 'text' : 'password'"
                      :label="t('platform.settings.form.webhook.form.secret')"
                      density="compact"
                      @click:append-inner="isWebhookSecretVisible = !isWebhookSecretVisible"
                    />
                  </v-col>
                  <v-col :cols="12">
                    <v-select
                      v-model="webhook.events"
                      :items="webhookEventItems"
                      :label="t('platform.settings.form.webhook.form.events')"
                      :rules="[v => v && v.length > 0 || t('platform.settings.form.webhook.form.eventsRequired')]"
                      item-title="label"
                      item-value="value"
                      multiple
                      density="compact"
                    >
                      <template #selection="{ item, index }">
                        <v-chip
                          v-if="index < (mobile?1:5)"
                          label
                          :text="item.title"
                        />
                        <v-chip
                          v-if="index === (mobile?1:5)"
                          label
                        >
                          <span v-tooltip="webhook.events.slice(mobile ? 1 : 5).map(key => webhookEventItems.find(i => i.value === key)?.label || key).join(', ')">
                            +{{ webhook.events.length - (mobile ? 1 : 5) }}
                          </span>
                        </v-chip>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col
                    :cols="mobile?4:2"
                    class="d-flex align-center"
                  >
                    <v-switch
                      v-model="webhook.enabled"
                      :label="webhook.enabled ? t('platform.settings.form.webhook.enable') : t('platform.settings.form.webhook.disable')"
                      color="primary"
                      hide-details
                      density="comfortable"
                    />
                  </v-col>
                  <v-col
                    :cols="mobile?4:2"
                    class="d-flex align-center"
                  >
                    <v-btn
                      size="default"
                      variant="tonal"
                      color="success"
                      :loading="testLoading[i]"
                      :disabled="!(webhook.url && webhook.name)"
                      @click="handleWebhookTest(webhook, i)"
                    >
                      {{ t('platform.settings.form.webhook.test') }}
                    </v-btn>
                  </v-col>
                  <v-col
                    :cols="mobile?4:2"
                    class="d-flex align-center"
                  >
                    <v-btn
                      size="default"
                      variant="tonal"
                      color="error"
                      @click="deleteWebhook(i)"
                    >
                      {{ t('platform.settings.form.webhook.delete') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row class="mt-2">
          <v-col>
            <v-btn
              v-tooltip="t('platform.settings.form.webhook.tip.name')"
              variant="text"
              color="primary"
              prepend-icon="ri-add-line"
              @click="addWebhook"
            >
              {{ t('platform.settings.form.webhook.add') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-form>
  </v-card>
  <v-card v-else>
    <result
      :height="props.height"
      :title="t('platform.settings.fetching')"
      type="info"
    />
  </v-card>
</template>

<script setup>
import platformApi from "@/api/platform.js"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import { deepCopy } from "@/utils/tools.js"
import _ from 'lodash'
import { showSnackbar } from "@/utils/snackbar.js"
import roomApi from "@/api/room.js"
import { v4 as uuidv4 } from "uuid"
import useGlobalStore from "@/plugins/store/global"


const props = defineProps({
  height: {
    type: Number,
    default: 0,
  },
})

const { mobile } = useDisplay()
const { t } = useI18n()
const globalStore = useGlobalStore()

const globalSettingsFormRef = ref()

const globalSettingsFormOld = ref({
  playerGetFrequency: undefined,
  playerInfoSaveTime: undefined,
  UIDMaintainEnable: false,
  sysMetricsEnable: false,
  sysMetricsSetting: undefined,
  autoUpdateEnable: false,
  autoUpdateSetting: '',
  autoUpdateRestart: false,
  webhook: [],
})

const globalSettingsForm = ref({
  playerGetFrequency: undefined,
  playerInfoSaveTime: undefined,
  UIDMaintainEnable: false,
  sysMetricsEnable: false,
  sysMetricsSetting: undefined,
  autoUpdateEnable: false,
  autoUpdateSetting: '',
  autoUpdateRestart: false,
  webhook: [],
})

const globalSettingsFormRules = ref({
  playerGetFrequency: [
    value => {
      if (value) return true

      return t('platform.settings.form.playerGetFrequency.required')
    },
  ],
  sysMetricsSetting: [
    value => {
      if (value) return true

      return t('platform.settings.form.sysMetricsSetting.required')
    },
  ],
})

const webhookEventItems = ref([])
const testLoading = ref({})
const roomOptions = ref([])

const fetchWebhookEvents = async () => {
  const response = await platformApi.webhook.events.get()

  webhookEventItems.value = response.data.map(e => ({
    label: e[globalStore.language],
    value: e.type,
  }))
}

const fetchRoomOptions = async () => {
  const response = await roomApi.basic.get()

  roomOptions.value = response.data || []
}

const addWebhook = () => {
  globalSettingsForm.value.webhook.push({
    id: uuidv4(),
    name: '',
    url: '',
    events: webhookEventItems.value.map(i => i.value),
    enabled: true,
    secret: '',
    roomIds: [],
  })
}

const deleteWebhook = index => {
  globalSettingsForm.value.webhook.splice(index, 1)
}

const handleWebhookTest = (item, index) => {
  testLoading.value[index] = true
  platformApi.webhook.test.post({ url: item.url, secret: item.secret }).then(response => {
    showSnackbar(response.message)
  }).finally(() => {
    testLoading.value[index] = false
  })
}

const isWebhookSecretVisible = ref(false)

const getGlobalSettingsLoading = ref(false)

const getGlobalSettings = () => {
  getGlobalSettingsLoading.value = true
  platformApi.globalSettings.get().then(response => {
    globalSettingsForm.value = response.data
    globalSettingsFormOld.value = deepCopy(globalSettingsForm.value)
    if (globalSettingsForm.value.playerInfoSaveTime === 0) {
      globalSettingsForm.value.playerInfoSaveTime = 1
    }

    // Parse webhook setting
    if (globalSettingsForm.value.webhookSetting) {
      try {
        globalSettingsForm.value.webhook = JSON.parse(globalSettingsForm.value.webhookSetting)
      } catch {
        globalSettingsForm.value.webhook = []
      }
    } else {
      globalSettingsForm.value.webhook = []
    }

    // Remove raw field to avoid confusion
    delete globalSettingsForm.value.webhookSetting
  }).finally(() => {
    getGlobalSettingsLoading.value = false
  })
}

const updateLoading = ref(false)

const handleUpdate = async () => {
  const { valid } = await globalSettingsFormRef.value.validate()
  if (valid) {
    globalSettingsForm.value.webhookSetting = JSON.stringify(globalSettingsForm.value.webhook)

    const webhook = globalSettingsForm.value.webhook

    delete globalSettingsForm.value.webhook

    if (_.isEqual(globalSettingsFormOld.value, globalSettingsForm.value)) {
      globalSettingsForm.value.webhook = webhook
      showSnackbar(t('platform.settings.noChange'), 'error')
    } else {
      globalSettingsForm.value.webhook = webhook
      updateLoading.value = true
      platformApi.globalSettings.post(globalSettingsForm.value).then(response => {
        showSnackbar(response.message)
      }).finally(() => {
        updateLoading.value = false
      })
    }
  }
}

onMounted(() => {
  getGlobalSettings()
  fetchWebhookEvents()
  fetchRoomOptions()
})
</script>

