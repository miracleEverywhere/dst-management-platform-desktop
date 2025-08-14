<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card height="400">
        <v-card-title>
          房间信息
        </v-card-title>
        <v-card-text v-if="roomInfo.roomSettingBase.name!==''">
          <v-row dense class="mb-4 mt-4">
            <v-col cols="12" sm="7">
              <div class="d-flex align-center">
                <span>房间名</span>
                <v-btn v-copy="globalStore.name" variant="text"
                       append-icon="ri-file-copy-2-line"
                >{{truncateString(globalStore.name, 12)}}</v-btn>
              </div>
            </v-col>
            <v-col cols="12" sm="5">
              <div class="d-flex align-center">
                <span>直连代码</span>
                <v-btn v-copy="connectionCode" variant="text" :loading="connectionCodeLoading"
                       append-icon="ri-file-copy-2-line"
                >点击复制</v-btn>
              </div>
            </v-col>
          </v-row>
          <v-row dense class="mb-4 mt-6">
            <v-col cols="12" sm="7">
              <div class="d-flex align-center">
                <span>天数</span>
                <v-chip :color="roomInfo.seasonInfo.cycles>-1?'success':'error'"
                        label class="ml-4">
                  {{ roomInfo.seasonInfo.cycles }}
                </v-chip>
              </div>
            </v-col>
            <v-col cols="12" sm="5">
              <div class="d-flex align-center">
                <span>阶段</span>
                <v-chip :color="roomInfo.seasonInfo.phase.zh==='获取失败'?'error':'success'"
                        label class="ml-4">
                  {{ roomInfo.seasonInfo.phase.zh }}
                </v-chip>
              </div>
            </v-col>
          </v-row>
          <v-row dense class="mb-4 mt-6">
            <v-col cols="12" sm="7">
              <div class="d-flex align-center">
                <span>季节</span>
                <v-chip :color="roomInfo.seasonInfo.cycles>-1?'success':'error'"
                        label class="ml-4">
                  {{ roomInfo.seasonInfo.season.zh }} {{ getSeasonDays(roomInfo.seasonInfo.season.en) }}
                </v-chip>
              </div>
            </v-col>
            <v-col cols="12" sm="5">
              <div class="d-flex align-center">
                <span>模组数量</span>
                <v-dialog v-model="dialogMod" max-width="1000" @after-enter="handleGetModInfo">
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-btn variant="tonal" size="small" color="success"
                           v-bind="activatorProps" class="ml-4">
                      {{ roomInfo.modsCount }}
                    </v-btn>
                  </template>
                  <v-card title="模组信息">
                    <v-card-text>
                      <v-data-table
                          :headers="modInfoTableHeaders"
                          :items="modInfoList"
                          :loading="modInfoLoading"
                          :items-per-page="10"
                          :page.sync="modInfoTablePage"
                          :server-items-length="modInfoTableRows"
                      >
                        <!-- 加载效果 -->
                        <template v-slot:loading>
                          <v-skeleton-loader type="table-row@8"></v-skeleton-loader>
                        </template>

                        <template v-slot:item.preview_url="{item}">
                          <v-img :src="item.preview_url" aspect-ratio="1" width="100"/>
                        </template>

                        <template v-slot:item.size="{item}">
                          <v-chip label color="info">
                            <v-icon icon="ri-hard-drive-3-line" start/>
                            {{formatBytes(item.size)}}
                          </v-chip>
                        </template>

                        <template v-slot:item.id="{item}">
                          <v-chip label color="primary">
                            <v-icon icon="ri-info-card-line" start/>
                            {{item.id}}
                          </v-chip>
                        </template>

                        <!-- 自定义 tags 列 -->
                        <template v-slot:item.tags="{ item }">
                          <v-chip v-for="tag in item.tags" :key="tag.tag" class="ma-1" label small>
                            {{ tag.display_name }}
                          </v-chip>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </v-dialog>
              </div>
            </v-col>
          </v-row>
          <v-row dense class="mb-4 mt-6">
            <v-col cols="12" sm="7">
              <div class="d-flex align-center">
                <span>游戏版本</span>
                <v-chip :color="version.local===version.server?'success':'error'"
                        label class="ml-4">
                  ({{ version.local }}/{{ version.server }})
                </v-chip>
              </div>
            </v-col>
            <v-col cols="12" sm="5">
              <div class="d-flex align-center">
                <span>在线玩家</span>
                <v-chip label color="success" class="ml-4">
                  {{ roomInfo.playerNum }}
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text v-else>
          <v-alert type="warning" title="没有发现存档">
            请前往 设置-房间 进行创建，创建前请确认游戏已经安装成功，可以显示游戏版本
          </v-alert>
          <v-alert type="info" title="温馨提示" class="mt-3">
            本平台需要游戏安装完成后才能正常运行，请建议安装游戏后再进行操作，如果游戏安装失败或安装进度缓慢，请执行手动安装脚本
          </v-alert>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col  cols="12" sm="6">
      <v-card height="400">
        <v-card-title>
          系统信息
        </v-card-title>
        <v-card-text>
          <div class="mt-2">
            <div class="d-flex align-center justify-center">
              <v-icon icon="ri-cpu-line"></v-icon>
              <span class="mr-2 ml-1">CPU</span>
              <v-progress-linear :model-value="sysInfo.cpu" rounded height="8"
                                 :indeterminate="sysInfo.cpu===0" rounded-bar
                                 color="grey-lighten-2" class="w-33 ml-2"/>
              <span class="ml-2">{{sysInfo.cpu.toFixed(1)}}%</span>
            </div>
            <v-sparkline
                height="60"
                :auto-line-width="false"
                :fill="false"
                :gradient="gradients"
                gradient-direction="top"
                line-width="2"
                :model-value="cpuList"
                padding="8"
                smooth
                stroke-linecap="round"
                type="trend"
                auto-draw
            ></v-sparkline>
          </div>
          <v-divider/>
          <div class="mt-2">
            <div class="d-flex align-center justify-center">
              <v-icon icon="ri-ram-line"></v-icon>
              <span class="mr-2 ml-1">内存</span>
              <v-progress-linear :model-value="sysInfo.memory" rounded height="8"
                                 :indeterminate="sysInfo.memory===0" rounded-bar
                                 color="grey-lighten-2" class="w-33 ml-2"/>
              <span class="ml-2">{{sysInfo.memory.toFixed(1)}}%</span>
            </div>
            <v-sparkline
                height="60"
                :auto-line-width="false"
                :fill="false"
                :gradient="gradients"
                gradient-direction="top"
                line-width="2"
                :model-value="memoryList"
                padding="8"
                smooth
                stroke-linecap="round"
                type="trend"
                auto-draw
            ></v-sparkline>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card height="400">
        <v-card-title>
          控制面板
        </v-card-title>
        <v-card-text>
          <v-row dense class="mb-4 mt-4">
            <div class="d-flex align-center">
              <span style="font-size: larger">地面</span>
              <v-switch v-model="computedSwitchMaster" :loading="masterLoading"
                        :label="computedSwitchMaster?'运行中':'已停止'"
                        color="success"
                        @change="masterCavesChange('master')" class="ml-4">
              </v-switch>
              <span class="ml-8" style="font-size: larger">洞穴</span>
              <v-switch v-model="computedSwitchCaves" :loading="cavesLoading"
                        color="success"
                        :label="computedSwitchCaves?'运行中':'已停止'"
                        @change="masterCavesChange('caves')" class="ml-4">
              </v-switch>
            </div>
          </v-row>
          <v-row dense class="mb-4 mt-6">
            <div class="d-flex align-center">
              <span style="font-size: larger">回档</span>
              <template v-for="day in 5">
                <v-dialog max-width="500">
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-btn v-bind="activatorProps" color="info" :text="day+'天'"
                           variant="text" size="large"
                    ></v-btn>
                  </template>
                  <template v-slot:default="{ isActive }">
                    <v-card title="请确认此操作">
                      <v-card-text>
                        将进行回档{{day}}天操作，是否继续？
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text="取消" @click="isActive.value = false"></v-btn>
                        <v-btn text="回档" :loading="execDialogConfirmButtonLoading"
                               @click="handleExec('rollback', day);isActive.value=false"
                        ></v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
              </template>
            </div>
          </v-row>
          <v-divider class="mt-10 mb-10"/>
          <v-row dense class="mb-4 mt-6">
            <div class="d-flex align-center">
              <template v-for="[k, v] in Object.entries(buttonMap).slice(0, 3)">
                <v-dialog persistent max-width="500" class="flex-wrap">
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-btn v-bind="activatorProps" :color="v.color" :text="v.name"
                           size="large" class="mr-6" variant="tonal"
                    ></v-btn>
                  </template>
                  <template v-slot:default="{ isActive }">
                    <v-card title="请确认此操作">
                      <v-card-text>
                        将进行{{v.name}}操作，是否继续？
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text="取消" @click="isActive.value = false"></v-btn>
                        <v-btn :text="v.name" :loading="execDialogConfirmButtonLoading"
                               @click="async () => {await handleExec(k, 0);isActive.value = false}"
                        ></v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
              </template>
            </div>
          </v-row>
          <v-row dense class="mb-4 mt-6">
            <div class="d-flex align-center">
              <template v-for="[k, v] in Object.entries(buttonMap).slice(-3)">
                <v-dialog persistent max-width="500" class="flex-wrap">
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-btn v-bind="activatorProps" :color="v.color" :text="v.name"
                           size="large" class="mr-6" variant="tonal"
                    ></v-btn>
                  </template>
                  <template v-slot:default="{ isActive }">
                    <v-card title="请确认此操作">
                      <v-card-text>
                        将进行{{v.name}}操作，是否继续？
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text="取消" @click="isActive.value = false"></v-btn>
                        <v-btn :text="v.name" :loading="execDialogConfirmButtonLoading"
                               @click="async () => {await handleExec(k, 0);isActive.value = false}"
                        ></v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
              </template>
            </div>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6">
      <v-card height="400">
        <v-card-title>
          命令执行
        </v-card-title>
        <v-card-text>
          <v-row no-gutters class="mb-16 mt-12">
            <v-col>
              <v-text-field v-model="announceForm.message" density="compact" label="公告内容" variant="underlined" clearable>
              </v-text-field>
            </v-col>
            <v-col cols="2">
              <v-btn color="black" variant="text"
                     :loading="announceLoading" @click="handleAnnounce">发送</v-btn>
            </v-col>
          </v-row>
          <v-row no-gutters class="mb-4" style="margin-top: 100px">
            <v-col cols="3">
              <v-select v-model="consoleForm.world" density="compact" label="世界" :items="consoleExecMap"
                        :item-props="setItemProps" variant="underlined">
              </v-select>
            </v-col>
            <v-col>
              <v-text-field v-model="consoleForm.cmd" density="compact" label="命令内容" variant="underlined" clearable>
              </v-text-field>
            </v-col>
            <v-col cols="2">
              <v-btn color="black" variant="text" :loading="consoleLoading"
                     @click="handleConsole">执行</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import {onMounted, onBeforeUnmount} from "vue";
import {formatBytes, initTheme, truncateString} from "@/utils/tools";
import useGlobalStore from "@/plugins/pinia/global";
import useConfigStore from "@/plugins/pinia/config";
import externalApi from "@/api/externalApi";
import homeApi from "@/api/home";
import {showSnackbar} from "@/utils/snackbar";


onMounted(() => {
  console.log(configStore.inConfig)
  if (configStore.inConfig === false) {

  }
  initTheme()
  getConnectionCode()
  getRoomInfo()
  getVersion()
  startRequests()
})

const globalStore = useGlobalStore()
const configStore = useConfigStore()

const connectionCode = ref('')
const connectionCodeLoading = ref(false)
const getConnectionCode = () => {
  connectionCodeLoading.value = true
  externalApi.connectionCode.get().then(response => {
    connectionCode.value = response.data
  }).finally(() => {
    connectionCodeLoading.value = false
  })
}

const sysInfo = ref({
  cpu: 0,
  memory: 0,
  master: 0,
  caves: 0,
})

const cpuList = ref(Array(60).fill(0)) 
const memoryList = ref(Array(60).fill(0))

const getSysInfo = () => {
  homeApi.sysInfo.get().then(response => {
    if (!response.data) return; 
    
    const cpu = Number(response.data.cpu) || 0;
    const memory = Number(response.data.memory) || 0;
    
    sysInfo.value = {
      ...response.data,
      cpu,
      memory
    }
    
    cpuList.value = [...cpuList.value.slice(1), cpu];
    memoryList.value = [...memoryList.value.slice(1), memory];
  }).catch(() => {
    needContinue.value = false
  })
}
const needContinue = ref(true)

const gradients = ['#f72047', '#ffd200', '#1feaea']

const roomInfo = ref({
  roomSettingBase: {},
  seasonInfo: {
    season: {},
    cycles: 0,
    elapsedDays: 0,
    seasonLength: {
      summer: 15,
      autumn: 20,
      spring: 20,
      winter: 15
    },
    phase: {}
  },
  modsCount: 0,
  playerNum: 0,
})
const getRoomInfo = () => {
  homeApi.roomInfo.get().then(response => {
    roomInfo.value = response.data
  })
}

const getSeasonDays = (season) => {
  if (roomInfo.value.seasonInfo.cycles > -1) {
    return `(${roomInfo.value.seasonInfo.elapsedDays}/${roomInfo.value.seasonInfo.seasonLength[season]})`
  } else {
    return ''
  }
}

const version = ref({
  server: 0,
  local: 0
})

const versionLoading = ref(false)
const getVersion = () => {
  versionLoading.value = true
  externalApi.dstVersion.get().then(response => {
    version.value = response.data
  }).finally(() => {
    versionLoading.value = false
  })
}

const dialogMod = ref(false)

const modInfoList = ref([])
const modInfoLoading = ref(false)
const handleGetModInfo = () => {
  modInfoLoading.value = true
  externalApi.modInfo.get().then(response => {
    modInfoList.value = response.data
    modInfoTableRows.value = modInfoList.value.length
  }).finally(() => {
    modInfoLoading.value = false
  })
}
const modInfoTableHeaders = ref([
  { title: "名称", value: "name"},
  { title: "预览", value: "preview_url" },
  { title: "大小", value: "size" },
  { title: "ID", value: "id" },
  { title: "标签", value: "tags" },
])
const modInfoTablePage = ref(1)
const modInfoTableRows = ref(0)

const computedSwitchMaster = computed({
  get: () => sysInfo.value.master === 1,
  set: (newValue) => {
    sysInfo.value.master = newValue ? 1 : 0;
  },
})
const computedSwitchCaves = computed({
  get: () => sysInfo.value.caves === 1,
  set: (newValue) => {
    sysInfo.value.caves = newValue ? 1 : 0;
  },
})
const masterLoading = ref(false)
const cavesLoading = ref(false)
const masterCavesChange = (world) => {
  needContinue.value = false
  const reqForm = {
    type: 'masterSwitch',
    info: sysInfo.value.master
  }
  if (world === 'master') {
    const reqForm = {
      type: 'masterSwitch',
      info: sysInfo.value.master
    }
    masterLoading.value = true
    homeApi.exec.post(reqForm).finally(() => {
      masterLoading.value = false
      needContinue.value = true
    })
  } else {
    const reqForm = {
      type: 'cavesSwitch',
      info: sysInfo.value.caves
    }
    cavesLoading.value = true
    homeApi.exec.post(reqForm).finally(() => {
      cavesLoading.value = false
      needContinue.value = true
    })
  }
}

const execDialogConfirmButtonLoading = ref(false)
const handleExec = async (type, info) => {
  execDialogConfirmButtonLoading.value = true
  const reqForm = {
    type: type,
    info: info
  }
  try {
    const response = await homeApi.exec.post(reqForm)
    showSnackbar(response.message)
  } finally {
    execDialogConfirmButtonLoading.value = false
  }

}
const buttonMap = {
  startup: {name: '启动游戏', color: 'success'},
  restart: {name: '重启游戏', color: 'info'},
  update: {name: '更新游戏', color: 'warning'},
  shutdown: {name: '关闭游戏', color: 'secondary'},
  reset: {name: '重置世界', color: 'error'},
  delete: {name: '删除世界', color: 'primary'},
}

const consoleExecMap = ref([
  {title: '地面', value: 'master'},
  {title: '洞穴', value: 'caves'},
])

const announceLoading = ref(false)
const announceForm = ref({
  message: ''
})
const handleAnnounce = () => {
  if (announceForm.value.message === '') {
    showSnackbar('请输入要宣告的内容', 'error')
    return
  }
  announceLoading.value = true
  homeApi.interface.announce.post(announceForm.value).then(response => {
    showSnackbar(response.message)
    announceForm.value.message = ''
  }).finally(() => {
    announceLoading.value = false
  })
}

const consoleLoading = ref(false)
const consoleForm = ref({
  cmd: '',
  world: ''
})
const handleConsole = () => {
  if (consoleForm.value.world === '') {
    showSnackbar('请选择地面或洞穴', 'error')
    return
  }
  if (consoleForm.value.cmd === '') {
    showSnackbar('请输入要执行的命令', 'error')
    return
  }
  consoleLoading.value = true
  homeApi.interface.console.post(consoleForm.value).then(response => {
    showSnackbar(response.message)
    consoleForm.value.cmd = ''
  }).finally(() => {
    consoleLoading.value = false
  })
}
const setItemProps = (item) => {
  let disabled, icon
  if (item.title === '地面') {
    icon = 'ri-sun-fill'
    disabled = sysInfo.value.master !== 1;
  } else {
    icon = 'ri-typhoon-fill'
    disabled = sysInfo.value.caves !== 1;
  }

  return {
    disabled: disabled,
    prependIcon: icon
  }
};

let intervalId = null
const startRequests = () => {
  intervalId = setInterval(() => {
    if (needContinue.value) {
      getSysInfo()
    }
  }, 2000)
}
const cancelRequests = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onBeforeUnmount(() => {
  cancelRequests();
  window.removeEventListener('beforeunload', cancelRequests);
})
</script>