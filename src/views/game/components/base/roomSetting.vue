<template>
  <v-form
    ref="roomSettingFormRef"
    class="mt-4"
    fast-fail
  >
    <!-- 自动备份 -->
    <v-alert
      color="primary"
      :title="t('game.base.step4.form.backup.name')"
      density="compact"
      class="mt-8"
      variant="tonal"
      icon="ri-bookmark-fill"
    />
    <v-row class="mt-0">
      <v-col>
        <v-radio-group
          v-model="roomSettingForm.backup.enable"
          v-tooltip="t('game.base.step4.form.backup.tip.name')"
          inline
          color="primary"
          class="mt-2"
        >
          <template #prepend>
            <span>
              {{ t('game.base.step4.form.backup.name') }}
            </span>
          </template>
          <v-radio
            :label="t('game.base.step4.form.backup.enable')"
            :value="true"
          />
          <v-radio
            :label="t('game.base.step4.form.backup.disable')"
            :value="false"
          />
        </v-radio-group>
      </v-col>
      <v-spacer v-if="!mobile" />
    </v-row>
    <v-row class="mt-0">
      <v-col
        v-for="i in roomSettingForm.backup.setting"
        :cols="mobile?10:3"
      >
        <v-text-field
          v-model="i.time"
          v-tooltip="t('game.base.step4.form.backup.tip.time')"
          :disabled="!roomSettingForm.backup.enable"
          append-icon="ri-close-line"
          :label="t('game.base.step4.form.backup.time')"
          @click:append="deleteBackupTime(i.time)"
        >
          <v-menu
            :close-on-content-click="false"
            activator="parent"
          >
            <v-time-picker
              v-model="i.time"
              use-seconds
              format="24hr"
            />
          </v-menu>
        </v-text-field>
      </v-col>
      <v-col :cols="1">
        <div class="fcc h-100">
          <v-btn
            variant="text"
            color="primary"
            :disabled="!roomSettingForm.backup.enable"
            density="comfortable"
            prepend-icon="ri-add-line"
            @click="roomSettingForm.backup.setting.push({time: '00:00:00'})"
          >
            {{ t('game.base.step4.form.backup.add') }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <!-- 备份清理 -->
    <v-alert
      color="primary"
      :title="t('game.base.step4.form.backupClean.name')"
      density="compact"
      class="mt-8"
      variant="tonal"
      icon="ri-bookmark-fill"
    />
    <v-row class="mt-0">
      <v-col>
        <v-radio-group
          v-model="roomSettingForm.backupClean.enable"
          v-tooltip="t('game.base.step4.form.backupClean.tip.name')"
          inline
          color="primary"
          class="mt-2"
        >
          <template #prepend>
            <span>
              {{ t('game.base.step4.form.backupClean.name') }}
            </span>
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
    <v-row class="mt-0">
      <v-col :cols="mobile?12:4">
        <v-number-input
          v-model="roomSettingForm.backupClean.setting"
          v-tooltip="t('game.base.step4.form.backupClean.tip.days')"
          :rules="roomSettingFormRules.backupClean"
          :disabled="!roomSettingForm.backupClean.enable"
          :label="t('game.base.step4.form.backupClean.days')"
          :min="1"
          style="margin-bottom: -1.25rem"
        >
          <template #append-inner>
            <div style="width: 30px">
              {{ t('game.base.step4.form.backupClean.unit') }}
            </div>
          </template>
        </v-number-input>
      </v-col>
      <v-spacer v-if="!mobile" />
    </v-row>
    <!-- 自动重启 -->
    <v-alert
      color="primary"
      :title="t('game.base.step4.form.restart.name')"
      density="compact"
      class="mt-8"
      variant="tonal"
      icon="ri-bookmark-fill"
    />
    <v-row class="mt-0">
      <v-col>
        <v-radio-group
          v-model="roomSettingForm.restart.enable"
          v-tooltip="t('game.base.step4.form.restart.tip.name')"
          inline
          color="primary"
          class="mt-2"
        >
          <template #prepend>
            <span>
              {{ t('game.base.step4.form.restart.name') }}
            </span>
          </template>
          <v-radio
            :label="t('game.base.step4.form.restart.enable')"
            :value="true"
          />
          <v-radio
            :label="t('game.base.step4.form.restart.disable')"
            :value="false"
          />
        </v-radio-group>
      </v-col>
      <v-spacer v-if="!mobile" />
    </v-row>
    <v-row class="mt-0">
      <v-col :cols="mobile?12:4">
        <v-text-field
          v-model="roomSettingForm.restart.setting"
          v-tooltip="t('game.base.step4.form.restart.tip.time')"
          :disabled="!roomSettingForm.restart.enable"
          :label="t('game.base.step4.form.backup.time')"
        >
          <v-menu
            :close-on-content-click="false"
            activator="parent"
          >
            <v-time-picker
              v-model="roomSettingForm.restart.setting"
              use-seconds
              format="24hr"
            />
          </v-menu>
        </v-text-field>
      </v-col>
      <v-spacer v-if="!mobile" />
    </v-row>
    <!-- 自动保活 -->
    <v-alert
      color="primary"
      :title="t('game.base.step4.form.keepalive.name')"
      density="compact"
      class="mt-8"
      variant="tonal"
      icon="ri-bookmark-fill"
    />
    <v-row class="mt-0">
      <v-col>
        <v-radio-group
          v-model="roomSettingForm.keepalive.enable"
          v-tooltip="t('game.base.step4.form.restart.tip.name')"
          inline
          color="primary"
          class="mt-2"
        >
          <template #prepend>
            <span>
              {{ t('game.base.step4.form.keepalive.name') }}
            </span>
          </template>
          <v-radio
            :label="t('game.base.step4.form.keepalive.enable')"
            :value="true"
          />
          <v-radio
            :label="t('game.base.step4.form.keepalive.disable')"
            :value="false"
          />
        </v-radio-group>
      </v-col>
      <v-spacer v-if="!mobile" />
    </v-row>
    <v-row class="mt-0">
      <v-col :cols="mobile?12:4">
        <v-number-input
          v-model="roomSettingForm.keepalive.setting"
          v-tooltip="t('game.base.step4.form.keepalive.tip.interval')"
          :rules="roomSettingFormRules.keepalive"
          :disabled="!roomSettingForm.keepalive.enable"
          :label="t('game.base.step4.form.keepalive.interval')"
          :min="1"
          style="margin-bottom: -1.25rem"
        >
          <template #append-inner>
            <div style="width: 55px">
              {{ t('game.base.step4.form.keepalive.unit') }}
            </div>
          </template>
        </v-number-input>
      </v-col>
      <v-spacer v-if="!mobile" />
    </v-row>
    <!-- 自动开启关闭 -->
    <v-alert
      color="primary"
      :title="t('game.base.step4.form.scheduledStartStop.name')"
      density="compact"
      class="mt-8"
      variant="tonal"
      icon="ri-bookmark-fill"
    />
    <v-row class="mt-0">
      <v-col>
        <v-radio-group
          v-model="roomSettingForm.scheduledStartStop.enable"
          v-tooltip="t('game.base.step4.form.scheduledStartStop.tip.name')"
          inline
          color="primary"
          class="mt-2"
        >
          <template #prepend>
            <span>
              {{ t('game.base.step4.form.scheduledStartStop.name') }}
            </span>
          </template>
          <v-radio
            :label="t('game.base.step4.form.scheduledStartStop.enable')"
            :value="true"
          />
          <v-radio
            :label="t('game.base.step4.form.scheduledStartStop.disable')"
            :value="false"
          />
        </v-radio-group>
      </v-col>
      <v-spacer v-if="!mobile" />
    </v-row>
    <v-row class="mt-0">
      <v-col :cols="mobile?12:4">
        <v-text-field
          v-model="roomSettingForm.scheduledStartStop.setting.start"
          v-tooltip="t('game.base.step4.form.scheduledStartStop.tip.start')"
          :disabled="!roomSettingForm.scheduledStartStop.enable"
          :label="t('game.base.step4.form.scheduledStartStop.time.start')"
        >
          <v-menu
            :close-on-content-click="false"
            activator="parent"
          >
            <v-time-picker
              v-model="roomSettingForm.scheduledStartStop.setting.start"
              use-seconds
              format="24hr"
            />
          </v-menu>
        </v-text-field>
      </v-col>
      <v-col :cols="mobile?12:4">
        <v-text-field
          v-model="roomSettingForm.scheduledStartStop.setting.stop"
          v-tooltip="t('game.base.step4.form.scheduledStartStop.tip.stop')"
          :disabled="!roomSettingForm.scheduledStartStop.enable"
          :label="t('game.base.step4.form.scheduledStartStop.time.stop')"
        >
          <v-menu
            :close-on-content-click="false"
            activator="parent"
          >
            <v-time-picker
              v-model="roomSettingForm.scheduledStartStop.setting.stop"
              use-seconds
              format="24hr"
            />
          </v-menu>
        </v-text-field>
      </v-col>
      <v-spacer v-if="!mobile" />
    </v-row>
    <!-- Tick Rate -->
    <v-alert
      color="primary"
      :title="t('game.base.step4.form.tickRate.name')"
      density="compact"
      class="mt-8"
      variant="tonal"
      icon="ri-bookmark-fill"
    />
    <v-row class="mt-0">
      <v-col>
        <v-radio-group
          v-model="roomSettingForm.tickRate"
          v-tooltip="t('game.base.step4.form.tickRate.tip')"
          inline
          color="primary"
          class="mt-2"
        >
          <template #prepend>
            <span>
              {{ t('game.base.step4.form.tickRate.name') }}
            </span>
          </template>
          <v-radio
            label="15"
            :value="15"
            class="mr-4"
          />
          <v-radio
            label="30"
            :value="30"
            class="mr-4"
          />
          <v-radio
            label="45"
            :value="45"
            class="mr-4"
          />
          <v-radio
            label="60"
            :value="60"
            class="mr-4"
          />
        </v-radio-group>
      </v-col>
      <v-spacer v-if="!mobile" />
    </v-row>
    <!-- 启动类型 -->
    <v-alert
      color="primary"
      :title="t('game.base.step4.form.startType.name')"
      density="compact"
      class="mt-8"
      variant="tonal"
      icon="ri-bookmark-fill"
    />
    <v-row class="mt-0">
      <v-col>
        <v-radio-group
          v-model="roomSettingForm.startType"
          v-tooltip="t('game.base.step4.form.startType.tip')"
          inline
          color="primary"
          class="mt-2"
        >
          <template #prepend>
            <span>
              {{ t('game.base.step4.form.startType.name') }}
            </span>
          </template>
          <v-radio
            :label="t('game.base.step4.form.startType.32-bit')"
            value="32-bit"
          />
          <v-radio
            :label="t('game.base.step4.form.startType.64-bit')"
            value="64-bit"
          />
          <v-radio
            label="LuaJIT"
            value="luajit"
          />
        </v-radio-group>
      </v-col>
      <v-spacer v-if="!mobile" />
    </v-row>
  </v-form>
</template>

<script setup>
import { useI18n } from "vue-i18n"
import { useDisplay } from "vuetify/framework"
import { showSnackbar } from "@/utils/snackbar.js"

const props = defineProps({
  roomSetting: {
    type: Object,
    default: () => ({}),
  },
})

onMounted(() => {
  if (Object.keys(props.roomSetting).length !== 0) {
    roomSettingForm.value = props.roomSetting
  }
})

const { t } = useI18n()
const { mobile } = useDisplay()

const roomSettingFormRef = ref()

const roomSettingForm = ref({
  backup: {
    enable: true,
    setting: [{
      time: '06:00:00',
    }],
  },
  backupClean: {
    enable: false,
    setting: 30,
  },
  restart: {
    enable: false,
    setting: '06:30:00',
  },
  keepalive: {
    enable: false,
    setting: 30,
  },
  scheduledStartStop: {
    enable: false,
    setting: {
      start: '07:00:00',
      stop: '01:00:00',
    },
  },
  tickRate: 15,
  startType: '32-bit',
})

const roomSettingFormRules = ref({
  backupClean: [
    value => {
      if (value) return true

      return t('game.base.step4.form.backupClean.required')
    },
  ],
  keepalive: [
    value => {
      if (value) return true

      return t('game.base.step4.form.keepalive.required')
    },
  ],
})

const deleteBackupTime = time => {
  if (roomSettingForm.value.backup.setting.length === 1) {
    showSnackbar(t('game.base.step4.form.backup.deleteBlock'), 'error')
    
    return
  }

  roomSettingForm.value.backup.setting = roomSettingForm.value.backup.setting.filter(item => item.time !== time)
}

const validate = async () => {
  const returnData = {
    validate: false,
    formData: {},
  }

  const { valid } = await roomSettingFormRef.value.validate()
  if (valid) {
    return {
      validate: true,
      formData: roomSettingForm.value,
    }
  }

  return returnData
}

defineExpose({
  validate,
})
</script>

