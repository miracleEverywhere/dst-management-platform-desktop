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
          :title="t('platform.settings.form.playerGetFrequency.title')"
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


const props = defineProps({
  height: {
    type: Number,
    default: 0,
  },
})

const { mobile } = useDisplay()
const { t } = useI18n()

const globalSettingsFormRef = ref()

const globalSettingsFormOld = ref({
  playerGetFrequency: undefined,
  UIDMaintainEnable: false,
  sysMetricsEnable: false,
  sysMetricsSetting: undefined,
  autoUpdateEnable: false,
  autoUpdateSetting: '',
  autoUpdateRestart: false,
})

const globalSettingsForm = ref({
  playerGetFrequency: undefined,
  UIDMaintainEnable: false,
  sysMetricsEnable: false,
  sysMetricsSetting: undefined,
  autoUpdateEnable: false,
  autoUpdateSetting: '',
  autoUpdateRestart: false,
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

const getGlobalSettingsLoading = ref(false)

const getGlobalSettings = () => {
  getGlobalSettingsLoading.value = true
  platformApi.globalSettings.get().then(response => {
    globalSettingsForm.value = response.data
    globalSettingsFormOld.value = deepCopy(globalSettingsForm.value)
  }).finally(() => {
    getGlobalSettingsLoading.value = false
  })
}

const updateLoading = ref(false)

const handleUpdate = async () => {
  const { valid } = await globalSettingsFormRef.value.validate()
  if (valid) {
    if (_.isEqual(globalSettingsFormOld.value, globalSettingsForm.value)) {
      showSnackbar(t('platform.settings.noChange'), 'error')
    } else {
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
})
</script>

