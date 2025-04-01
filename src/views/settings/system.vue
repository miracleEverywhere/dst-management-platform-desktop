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
          <v-alert density="compact" color="primary" class="mb-4">自动保活</v-alert>
          <v-row>
            <v-col cols="3">
              <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                关闭后不会自动启动失效的饥荒服务器
              </v-tooltip>
              <v-radio-group v-model="systemSettingForm.keepaliveDisable" inline class="mt-2">
                <template #prepend>
                  <span>
                    自动保活开关
                  </span>
                </template>
                <v-radio label="开启" :value="false"></v-radio>
                <v-radio label="关闭" :value="true"></v-radio>
              </v-radio-group>
            </v-col>
            <v-spacer/>
            <v-col cols="6">
              <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                单位分钟，默认为30分钟，如果不清楚保活原理，请勿随意修改
              </v-tooltip>
              <v-number-input v-model="systemSettingForm.keepaliveFrequency"
                              :rules="keepaliveFrequencyRules" :min="1"
                              control-variant="stacked" inset label="自动保活检测频率" variant="outlined">
                <template #append-inner>
                  <div style="width: 50px">分钟</div>
                </template>
              </v-number-input>
            </v-col>
          </v-row>

          <v-alert density="compact" color="primary" class="mt-12 mb-4">玩家列表</v-alert>
          <v-row>
            <v-col>
              <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                单位秒，默认为30秒，日志杂乱度与功能实现的矛与盾^_^（此功能影响自动保活和昵称字典维护）
              </v-tooltip>
              <v-number-input v-model="systemSettingForm.playerGetFrequency"
                              :rules="playerGetFrequencyRules" :min="1"
                              control-variant="stacked" inset label="玩家列表获取频率" variant="outlined">
                <template #append-inner>
                  <div style="width: 50px">分钟</div>
                </template>
              </v-number-input>
            </v-col>

          </v-row>

          <v-alert density="compact" color="primary" class="mt-12 mb-4">昵称字典维护</v-alert>
          <v-row>
            <v-col cols="4">
              <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                默认开启，关闭后，在设置-玩家的管理员黑名单白名单页面中将不再显示玩家昵称
              </v-tooltip>
              <v-radio-group v-model="systemSettingForm.UIDMaintain.disable" inline class="mt-2">
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
            <v-col cols="6">
              <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                单位分钟，默认为5分钟，磁盘IO与功能实现的矛与盾^_^
              </v-tooltip>
              <v-number-input v-model="systemSettingForm.UIDMaintain.frequency"
                              :min="1"
                              control-variant="stacked" inset label="玩家昵称字典写入频率" variant="outlined">
                <template #append-inner>
                  <div style="width: 50px">分钟</div>
                </template>
              </v-number-input>
            </v-col>
          </v-row>

          <v-alert density="compact" color="primary" class="mt-12 mb-4">系统监控</v-alert>
          <v-row>
            <v-col cols="4">
              <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                默认开启，关闭后，在工具-系统监控页面中将不再显示任何内容
              </v-tooltip>
              <v-radio-group v-model="systemSettingForm.sysMetricsGet.disable" inline>
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

          <v-alert density="compact" color="primary" class="mt-12 mb-4">64位启动</v-alert>
          <v-row>
            <v-col cols="4">
              <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                默认关闭，开启后会提升游戏性能，但会增加内存占用，请酌情开启
              </v-tooltip>
              <v-radio-group v-model="systemSettingForm.bit64" :disabled="OSPlatform==='darwin'"
                             inline>
                <template #prepend>
                  <span>
                    64位启动
                  </span>
                </template>
                <v-radio label="开启" :value="true"></v-radio>
                <v-radio label="关闭" :value="false"></v-radio>
              </v-radio-group>
            </v-col>
            <v-spacer/>
          </v-row>

          <v-alert density="compact" color="primary" class="mt-12 mb-4">通信频率</v-alert>
          <v-row>
            <v-col cols="4">
              <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                越大游戏越流畅，但会带来更高的带宽和CPU消耗
              </v-tooltip>
              <v-radio-group v-model="systemSettingForm.tickRate" inline>
                <template #prepend>
                  <span>
                    Tick Rate
                  </span>
                </template>
                <v-radio label="15" :value="15"></v-radio>
                <v-radio label="30" :value="30"></v-radio>
                <v-radio label="45" :value="45"></v-radio>
                <v-radio label="60" :value="60"></v-radio>
              </v-radio-group>
            </v-col>
            <v-spacer/>
          </v-row>

          <v-alert density="compact" color="primary" class="mt-12 mb-4">用户路径编码</v-alert>
          <v-row>
            <v-col cols="3">
              <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                切换后会自动生成游戏配置文件，手动重启后即可生效
              </v-tooltip>
              <v-radio-group v-model="systemSettingForm.encodeUserPath.ground" inline>
                <template #prepend>
                  <span>
                    地面
                  </span>
                </template>
                <v-radio label="开启" :value="true"></v-radio>
                <v-radio label="关闭" :value="false"></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="3"></v-col>
            <v-col cols="3">
              <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                切换后会自动生成游戏配置文件，手动重启后即可生效
              </v-tooltip>
              <v-radio-group v-model="systemSettingForm.encodeUserPath.cave" inline>
                <template #prepend>
                  <span>
                    洞穴
                  </span>
                </template>
                <v-radio label="开启" :value="true"></v-radio>
                <v-radio label="关闭" :value="false"></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="3"></v-col>
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
import {VNumberInput} from "vuetify/labs/VNumberInput";

onMounted(async () => {
  loading.value = true
  await handleGetSystemSetting()
  await handleGetOSPlatform()
})

// 数据获取不成功就一直加载，不允许修改页面
const loading = ref(false)

const systemSettingFormRef = ref()
const systemSettingFormOld = ref({
  keepaliveDisable: undefined,
  keepaliveFrequency: undefined,
  playerGetFrequency: undefined,
  UIDMaintain: {
    disable: undefined,
    frequency: undefined,
  },
  sysMetricsGet: {
    disable: undefined,
    frequency: undefined,
  },
  bit64: undefined,
  tickRate: undefined,
  encodeUserPath: {
    ground: false,
    cave: false,
  }
})
const systemSettingForm = ref({
  keepaliveDisable: undefined,
  keepaliveFrequency: undefined,
  playerGetFrequency: undefined,
  UIDMaintain: {
    disable: undefined,
    frequency: undefined,
  },
  sysMetricsGet: {
    disable: undefined,
    frequency: undefined,
  },
  bit64: undefined,
  tickRate: undefined,
  encodeUserPath: {
    ground: false,
    cave: false,
  }
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
  settingApi.system.setting.get().then(response => {
    systemSettingForm.value = response.data
    systemSettingFormOld.value = deepCopy(systemSettingForm.value)
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
      settingApi.system.setting.put(systemSettingForm.value).then(response => {
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
    loading.value = false
  })
}
</script>

<style scoped>
</style>