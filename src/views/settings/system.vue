<template>
  <v-card height="870">
    <v-card-title>
      <div class="card-header">
        <span>系统设置</span>
        <div>
          <v-btn :loading="submitButtonLoading" @click="handleSubmit">
            提交
          </v-btn>
        </div>
      </div>
    </v-card-title>
    <v-card-text>
      <v-container v-if="!loading" height="700" style="overflow-y: auto">
        <v-form ref="systemSettingFormRef" class="mt-4" fast-fail>
          <v-alert border color="error" class="mb-4">
            以下为全局设置，影响所有集群
          </v-alert>

          <v-alert color="error" title="玩家列表" density="compact" class="mt-4"
                   variant="tonal" icon="ri-bookmark-3-fill"></v-alert>
          <v-row class="mt-0">
            <v-col>
              <v-number-input v-model="systemSettingForm.schedulerSetting.playerGetFrequency"
                              v-tooltip:top="'单位秒，默认为30秒，间隔越小，平台更新游戏玩家信息越及时，但会带来额外的性能消耗和更乱的世界日志'"
                              :rules="playerGetFrequencyRules" :min="1"
                              variant="outlined"
                              control-variant="stacked" inset label="玩家列表获取频率">
                <template #append-inner>
                  <div style="width: 50px">分钟</div>
                </template>
              </v-number-input>
            </v-col>
            <v-spacer/>
          </v-row>

          <v-alert color="error" title="昵称字典维护" density="compact" class="mt-4"
                   variant="tonal" icon="ri-bookmark-3-fill"></v-alert>
          <v-row class="mt-0">
            <v-col>
              <v-radio-group v-model="systemSettingForm.schedulerSetting.UIDMaintain.disable"
                             v-tooltip:top="'默认开启，关闭后，在设置-玩家的管理员黑名单白名单页面中将不再显示玩家昵称，历史玩家信息也不会再新增'"
                             inline class="mt-2">
                <template #prepend>
                  <span>
                    玩家昵称字典维护开关
                  </span>
                </template>
                <v-radio label="开启" :value="false"></v-radio>
                <v-radio label="关闭" :value="true"></v-radio>
              </v-radio-group>
            </v-col>
            <v-spacer/>
          </v-row>
          <v-row class="mt-0">
            <v-col>
              <v-number-input v-model="systemSettingForm.schedulerSetting.UIDMaintain.frequency"
                              v-tooltip:top="'单位分钟，默认为5分钟，即更新昵称字典的间隔'"
                              :rules="playerGetFrequencyRules" :min="1"
                              :disabled="systemSettingForm.schedulerSetting.UIDMaintain.disable"
                              control-variant="stacked" inset label="玩家昵称字典写入频率" variant="outlined">
                <template #append-inner>
                  <div style="width: 50px">分钟</div>
                </template>
              </v-number-input>
            </v-col>
            <v-spacer/>
          </v-row>

          <v-alert color="error" title="系统监控" density="compact" class="mt-4"
                   variant="tonal" icon="ri-bookmark-3-fill"></v-alert>
          <v-row class="mt-0">
            <v-col>
              <v-radio-group v-model="systemSettingForm.schedulerSetting.sysMetricsGet.disable"
                             v-tooltip:top="'默认开启，关闭后，在工具-系统监控页面中将不再显示任何内容'"
                             inline>
                <template #prepend>
                  <span>
                    系统监控开关
                  </span>
                </template>
                <v-radio label="开启" :value="false"></v-radio>
                <v-radio label="关闭" :value="true"></v-radio>
              </v-radio-group>
            </v-col>
            <v-spacer/>
          </v-row>


        </v-form>
      </v-container>
      <sc-loading v-else :height="700"></sc-loading>
    </v-card-text>
  </v-card>
</template>

<script setup>
import settingApi from "@/api/setting"
import _ from 'lodash'
import {deepCopy} from "@/utils/tools.js";
import toolsApi from "@/api/tools";
import {showSnackbar} from "@/utils/snackbar";
import colors from 'vuetify/lib/util/colors'
import useGlobalStore from "@/plugins/pinia/global";

onMounted(async () => {
  loading.value = true
  await handleGetSystemSetting()
  await handleGetOSPlatform()
})

const globalStore = useGlobalStore();

// 数据获取不成功就一直加载，不允许修改页面
const loading = ref(false)

const systemSettingFormRef = ref()
const systemSettingFormOld = ref({
  sysSetting: {
    autoRestart: {
      enable: false,
      time: "",
    },
    autoBackup: {
      enable: false,
      time: "",
    },
    keepalive: {
      enable: false,
      frequency: 0,
    },
    scheduledStartStop: {
      enable: false,
      startTime: "",
      stopTime: "",
    },
    bit64: false,
    tickRate: 15,
  },
  schedulerSetting: {
    playerGetFrequency: 30,
    UIDMaintain: {
      disable: false,
      frequency: 0,
    },
    sysMetricsGet: {
      disable: undefined,
      frequency: undefined,
    },
    autoUpdate: {
      enable: false,
      time: "",
    },
    playerUpdateMod: {
      disable: false,
      frequency: 0,
    }
  },
})
const systemSettingForm = ref({
  sysSetting: {
    autoRestart: {
      enable: false,
      time: "",
    },
    autoBackup: {
      enable: false,
      time: "",
    },
    backupClean: {
      enable: false,
      days: 0,
    },
    keepalive: {
      enable: false,
      frequency: 0,
    },
    scheduledStartStop: {
      enable: false,
      startTime: "",
      stopTime: "",
    },
    bit64: false,
    tickRate: 15,
  },
  schedulerSetting: {
    playerGetFrequency: 30,
    UIDMaintain: {
      disable: false,
      frequency: 0,
    },
    sysMetricsGet: {
      disable: undefined,
      frequency: undefined,
    },
    autoUpdate: {
      enable: false,
      time: "",
    },
    playerUpdateMod: {
      disable: false,
      frequency: 0,
    }
  },
})

const keepaliveFrequencyRules = [
  (value) => {
    if (value) {
      return true
    }
    return "自动保活检测频率";
  },
]
const playerGetFrequencyRules = [
  (value) => {
    if (value) {
      return true
    }
    return "自动保活检测频率";
  },
]

const handleGetSystemSetting = () => {
  loading.value = true
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
  }
  settingApi.system.setting.get(reqForm).then(response => {
    systemSettingForm.value = response.data
    if (systemSettingForm.value.sysSetting.scheduledStartStop.startTime === "") {
      systemSettingForm.value.sysSetting.scheduledStartStop.startTime = "08:00:00"
      systemSettingForm.value.sysSetting.scheduledStartStop.stopTime = "02:00:00"
    }
    systemSettingFormOld.value = deepCopy(systemSettingForm.value)
  }).finally(() => {
    loading.value = false
  })
}

const submitButtonLoading = ref(false)
const handleSubmit = async () => {
  const {valid} = await systemSettingFormRef.value.validate();
  if (valid) {
    if (_.isEqual(systemSettingFormOld.value, systemSettingForm.value)) {
      showSnackbar('配置未修改', 'error')
    } else {
      submitButtonLoading.value = true
      const reqForm = {
        clusterName: globalStore.selectedDstCluster,
        settings: systemSettingForm.value,
      }
      settingApi.system.setting.put(reqForm).then(response => {
        handleGetSystemSetting()
        showSnackbar(response.message)
        if (systemSettingFormOld.value.bit64 !== systemSettingForm.value.bit64) {
          const message = '正在后台切换32/64，可依据CPU使用率判断是否执行完毕，执行完毕后重启游戏即可。'
          showSnackbar(message, 'info')
        }
      }).finally(() => {
        submitButtonLoading.value = false
      })
    }
  }
}

const OSPlatform = ref("")
const handleGetOSPlatform = () => {
  toolsApi.osInfo.get().then(response => {
    OSPlatform.value = response.data.Platform
  })
}
</script>

<style scoped>
</style>