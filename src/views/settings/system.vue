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

          <!--玩家列表-->
          <v-alert color="error" title="玩家列表" density="compact" class="mt-4"
                   variant="tonal" icon="ri-bookmark-3-fill"></v-alert>
          <v-row class="mt-0">
            <v-col>
              <v-number-input v-model="systemSettingForm.schedulerSetting.playerGetFrequency"
                              v-tooltip:top="'单位秒，默认为30秒，间隔越小，平台更新游戏玩家信息越及时，但会带来额外的性能消耗和更乱的世界日志'"
                              :min="1"
                              variant="outlined"
                              control-variant="stacked" inset label="玩家列表获取频率">
                <template #append-inner>
                  <div style="width: 50px">秒</div>
                </template>
              </v-number-input>
            </v-col>
            <v-spacer/>
          </v-row>

          <!--昵称字典维护-->
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
                              :min="1"
                              :disabled="systemSettingForm.schedulerSetting.UIDMaintain.disable"
                              control-variant="stacked" inset label="玩家昵称字典写入频率" variant="outlined">
                <template #append-inner>
                  <div style="width: 50px">分钟</div>
                </template>
              </v-number-input>
            </v-col>
            <v-spacer/>
          </v-row>

          <!--系统监控-->
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

          <!--自动更新-->
          <v-alert color="error" title="自动更新" density="compact" class="mt-4"
                   variant="tonal" icon="ri-bookmark-3-fill"></v-alert>
          <v-row class="mt-0">
            <v-col>
              <v-radio-group v-model="systemSettingForm.schedulerSetting.autoUpdate.enable"
                             v-tooltip:top="'默认开启，会在指定的时间检查游戏是否有更新，如果有则会自动更新'"
                             inline class="mt-2">
                <template #prepend>
                  <span>
                    自动更新开关
                  </span>
                </template>
                <v-radio label="开启" :value="true"></v-radio>
                <v-radio label="关闭" :value="false"></v-radio>
              </v-radio-group>
            </v-col>
            <v-spacer/>
          </v-row>
          <v-row class="mt-0">
            <v-col>
              <v-text-field v-model="systemSettingForm.schedulerSetting.autoUpdate.time"
                            v-tooltip:top="'每天会在该时间进行检查'"
                            readonly
                            :disabled="!systemSettingForm.schedulerSetting.autoUpdate.enable"
                            label="自动更新检查时间">
                <v-menu :close-on-content-click="false" activator="parent">
                  <v-time-picker v-model="systemSettingForm.schedulerSetting.autoUpdate.time"
                                 use-seconds
                                 format="24hr"></v-time-picker>
                </v-menu>
              </v-text-field>
            </v-col>
            <v-spacer/>
          </v-row>

          <!--玩家更新模组-->
          <v-alert color="error" title="玩家更新模组" density="compact" class="mt-4"
                   variant="tonal" icon="ri-bookmark-3-fill"></v-alert>
          <v-row class="mt-0">
            <v-col>
              <v-radio-group v-model="systemSettingForm.schedulerSetting.playerUpdateMod.disable"
                             v-tooltip:top="'默认开启，开启后游戏中的玩家可在聊天框中控制服务器进行模组更新'"
                             inline class="mt-2">
                <template #prepend>
                  <span>
                    玩家更新模组开关
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
              <v-number-input v-model="systemSettingForm.schedulerSetting.playerUpdateMod.frequency"
                              v-tooltip:top="'单位分钟，默认为10分钟，即发现有模组需要更新后，每10分钟提示一次（太频繁可能会很讨厌'"
                              :min="1"
                              :disabled="systemSettingForm.schedulerSetting.UIDMaintain.disable"
                              control-variant="stacked" inset label="玩家更新模组检查频率" variant="outlined">
                <template #append-inner>
                  <div style="width: 50px">分钟</div>
                </template>
              </v-number-input>
            </v-col>
            <v-spacer/>
          </v-row>

          <v-alert border color="success" class="my-8">
            以下为集群设置，影响当前集群
          </v-alert>

          <!--自动重启-->
          <v-alert color="success" title="自动重启" density="compact" class="mt-4"
                   variant="tonal" icon="ri-bookmark-fill"></v-alert>
          <v-row class="mt-0">
            <v-col>
              <v-radio-group v-model="systemSettingForm.sysSetting.autoRestart.enable"
                             v-tooltip:top="'默认开启，会在指定的时间重启服务器，自动更新模组'"
                             inline class="mt-2">
                <template #prepend>
                  <span>
                    自动重启开关
                  </span>
                </template>
                <v-radio label="开启" :value="true"></v-radio>
                <v-radio label="关闭" :value="false"></v-radio>
              </v-radio-group>
            </v-col>
            <v-spacer/>
          </v-row>
          <v-row class="mt-0">
            <v-col>
              <v-text-field v-model="systemSettingForm.sysSetting.autoRestart.time"
                            v-tooltip:top="'每天会在该时间进行检查'"
                            readonly
                            :disabled="!systemSettingForm.sysSetting.autoRestart.enable"
                            label="自动重启时间">
                <v-menu :close-on-content-click="false" activator="parent">
                  <v-time-picker v-model="systemSettingForm.sysSetting.autoRestart.time"
                                 use-seconds
                                 format="24hr"></v-time-picker>
                </v-menu>
              </v-text-field>
            </v-col>
            <v-spacer/>
          </v-row>

          <!--自动备份-->
          <v-alert color="success" title="自动备份" density="compact" class="mt-4"
                   variant="tonal" icon="ri-bookmark-fill"></v-alert>
          <v-row class="mt-0">
            <v-col>
              <v-radio-group v-model="systemSettingForm.sysSetting.autoBackup.enable"
                             v-tooltip:top="'默认开启，会在指定的时间备份服务器，备份路径为~/dmp_files/backup/[集群名]'"
                             inline class="mt-2">
                <template #prepend>
                  <span>
                    自动备份开关
                  </span>
                </template>
                <v-radio label="开启" :value="true"></v-radio>
                <v-radio label="关闭" :value="false"></v-radio>
              </v-radio-group>
            </v-col>
            <v-spacer/>
          </v-row>
          <v-row class="mt-0">
            <v-col>
              <v-text-field v-model="systemSettingForm.sysSetting.autoBackup.time"
                            v-tooltip:top="'每天会在该时间进行自动备份'"
                            readonly
                            :disabled="!systemSettingForm.sysSetting.autoBackup.enable"
                            label="自动备份时间">
                <v-menu :close-on-content-click="false" activator="parent">
                  <v-time-picker v-model="systemSettingForm.sysSetting.autoBackup.time"
                                 use-seconds
                                 format="24hr"></v-time-picker>
                </v-menu>
              </v-text-field>
            </v-col>
            <v-spacer/>
          </v-row>

          <!--备份清理-->
          <v-alert color="success" title="备份清理" density="compact" class="mt-4"
                   variant="tonal" icon="ri-bookmark-fill"></v-alert>
          <v-row class="mt-0">
            <v-col>
              <v-radio-group v-model="systemSettingForm.sysSetting.backupClean.enable"
                             v-tooltip:top="'默认关闭，会定时清理自动、手动创建的存档备份文件'"
                             inline class="mt-2">
                <template #prepend>
                  <span>
                    备份清理开关
                  </span>
                </template>
                <v-radio label="开启" :value="true"></v-radio>
                <v-radio label="关闭" :value="false"></v-radio>
              </v-radio-group>
            </v-col>
            <v-spacer/>
          </v-row>
          <v-row class="mt-0">
            <v-col>
              <v-number-input v-model="systemSettingForm.sysSetting.backupClean.days"
                              v-tooltip:top="'需要设置大于0的数字，如设置30，则会删除30天前创建的备份文件'"
                              :min="1"
                              :disabled="!systemSettingForm.sysSetting.backupClean.enable"
                              control-variant="stacked" inset label="备份保留天数" variant="outlined">
                <template #append-inner>
                  <div style="width: 50px">天</div>
                </template>
              </v-number-input>
            </v-col>
            <v-spacer/>
          </v-row>

          <!--自动保活-->
          <v-alert color="success" title="自动保活" density="compact" class="mt-4"
                   variant="tonal" icon="ri-bookmark-fill"></v-alert>
          <v-row class="mt-0">
            <v-col>
              <v-radio-group v-model="systemSettingForm.sysSetting.keepalive.enable"
                             v-tooltip:top="'关闭后不会处理失效的世界'"
                             inline class="mt-2">
                <template #prepend>
                  <span>
                    自动保活开关
                  </span>
                </template>
                <v-radio label="开启" :value="true"></v-radio>
                <v-radio label="关闭" :value="false"></v-radio>
              </v-radio-group>
            </v-col>
            <v-spacer/>
          </v-row>
          <v-row class="mt-0">
            <v-col>
              <v-number-input v-model="systemSettingForm.sysSetting.keepalive.frequency"
                              v-tooltip:top="'单位分钟，默认为30分钟，即每30分钟检测一次世界是否正常，如果异常则会重启对应的世界，对其他正常运行的世界无影响'"
                              :min="1"
                              :disabled="!systemSettingForm.sysSetting.keepalive.enable"
                              control-variant="stacked" inset label="自动保活检测频率" variant="outlined">
                <template #append-inner>
                  <div style="width: 50px">分钟</div>
                </template>
              </v-number-input>
            </v-col>
            <v-spacer/>
          </v-row>

          <!--定时开启关闭集群-->
          <v-alert color="success" title="定时开启关闭集群" density="compact" class="mt-4"
                   variant="tonal" icon="ri-bookmark-fill"></v-alert>
          <v-row class="mt-0">
            <v-col>
              <v-radio-group v-model="systemSettingForm.sysSetting.scheduledStartStop.enable"
                             v-tooltip:top="'默认关闭；如使用此功能，请关闭定时重启、自动保活'"
                             inline class="mt-2">
                <template #prepend>
                  <span>
                    定时开启关闭集群开关
                  </span>
                </template>
                <v-radio label="开启" :value="true"></v-radio>
                <v-radio label="关闭" :value="false"></v-radio>
              </v-radio-group>
            </v-col>
            <v-spacer/>
          </v-row>
          <v-row class="mt-0">
            <v-col>
              <v-text-field v-model="systemSettingForm.sysSetting.scheduledStartStop.startTime"
                            v-tooltip:top="'每天会在该时间开启本集群的所有世界'"
                            readonly
                            :disabled="!systemSettingForm.sysSetting.scheduledStartStop.enable"
                            label="开启集群时间">
                <v-menu :close-on-content-click="false" activator="parent">
                  <v-time-picker v-model="systemSettingForm.sysSetting.scheduledStartStop.startTime"
                                 use-seconds
                                 format="24hr"></v-time-picker>
                </v-menu>
              </v-text-field>
            </v-col>
            <v-spacer/>
          </v-row>
          <v-row class="mt-0">
            <v-col>
              <v-text-field v-model="systemSettingForm.sysSetting.scheduledStartStop.stopTime"
                            v-tooltip:top="'每天会在该时间关闭本集群的所有世界'"
                            readonly
                            :disabled="!systemSettingForm.sysSetting.scheduledStartStop.enable"
                            label="关闭集群时间">
                <v-menu :close-on-content-click="false" activator="parent">
                  <v-time-picker v-model="systemSettingForm.sysSetting.scheduledStartStop.stopTime"
                                 use-seconds
                                 format="24hr"></v-time-picker>
                </v-menu>
              </v-text-field>
            </v-col>
            <v-spacer/>
          </v-row>

          <!--64位启动-->
          <v-alert color="success" title="64位启动" density="compact" class="mt-4"
                   variant="tonal" icon="ri-bookmark-fill"></v-alert>
          <v-row class="mt-0">
            <v-col>
              <v-radio-group v-model="systemSettingForm.sysSetting.bit64"
                             :disabled="OSPlatform==='darwin'"
                             v-tooltip:top="'默认关闭，开启后会提升游戏性能，但会增加内存占用，请酌情开启'"
                             inline class="mt-2">
                <template #prepend>
                  <span>
                    64位启动开关
                  </span>
                </template>
                <v-radio label="开启" :value="true"></v-radio>
                <v-radio label="关闭" :value="false"></v-radio>
              </v-radio-group>
            </v-col>
            <v-spacer/>
          </v-row>

          <!--Tick Rate-->
          <v-alert color="success" title="Tick Rate" density="compact" class="mt-4"
                   variant="tonal" icon="ri-bookmark-fill"></v-alert>
          <v-row class="mt-0">
            <v-col>
              <v-radio-group v-model="systemSettingForm.sysSetting.tickRate"
                             v-tooltip:top="'越大游戏越流畅，但会带来更高的带宽和CPU消耗（需要客户端同时配置'"
                             inline class="mt-2">
                <template #prepend>
                  <span>
                    Tick Rate
                  </span>
                </template>
                <v-radio label="15" :value="15" class="mr-4"></v-radio>
                <v-radio label="30" :value="30" class="mr-4"></v-radio>
                <v-radio label="45" :value="45" class="mr-4"></v-radio>
                <v-radio label="60" :value="60" class="mr-4"></v-radio>
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