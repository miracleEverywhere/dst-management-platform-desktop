<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card height="300">
        <v-card-title>
          房间信息
        </v-card-title>
        <v-card-text v-if="roomInfo.clusterSetting.name!==''">
          <v-row dense class="mb-2 mt-2">
            <v-col cols="12" sm="7">
              <div class="d-flex align-center">
                <span>房间名</span>
                <v-btn v-copy="roomInfo.clusterSetting.name" variant="text"
                       append-icon="ri-file-copy-2-line"
                >{{truncateString(roomInfo.clusterSetting.name, 12)}}</v-btn>
              </div>
            </v-col>
            <v-col cols="12" sm="5">
              <div class="d-flex align-center">
                <span>直连代码</span>
                <v-btn v-copy="connectionCode" variant="text" :loading="connectionCodeLoading"
                       v-tooltip:top="connectionCode"
                       append-icon="ri-file-copy-2-line"
                >点击复制</v-btn>
              </div>
            </v-col>
          </v-row>
          <v-row dense class="mb-2 mt-2">
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
          <v-row dense class="mb-2 mt-2">
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
                           :disabled="roomInfo.modsCount===0"
                           v-bind="activatorProps" class="ml-4">
                      {{ roomInfo.modsCount }}
                    </v-btn>
                  </template>
                  <v-card title="模组信息">
                    <v-card-text>
                      <v-data-table
                          :headers="modInfoTableHeaders"
                          :items="modInfoList.filter(mod => mod.id!==1)"
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
          <v-row dense class="mb-2 mt-2">
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
                <v-chip v-if="roomInfo.players!==null" v-tooltip:top="roomInfo.players.join(', ')" label color="success" class="ml-4">
                  {{ roomInfo.players.length }}
                </v-chip>
                <v-chip v-else label color="success" class="ml-4">
                  0
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text v-else>
          <v-alert type="warning" prominent>
            请前往 设置-房间 进行存档创建，创建前请确认游戏已经安装成功，可以显示游戏版本
          </v-alert>
          <v-alert type="error" prominent class="mt-3">
            本平台需要游戏安装完成后才能正常运行，请安装游戏后再进行操作，如果游戏安装失败或安装进度缓慢，请执行手动安装脚本
          </v-alert>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col  cols="12" sm="6">
      <v-card height="300">
        <v-card-title>
          系统信息
        </v-card-title>
        <v-card-text>
          <div >
            <div class="d-flex align-center justify-center">
              <v-icon icon="ri-cpu-line"></v-icon>
              <span class="mr-2 ml-1">CPU</span>
              <v-progress-linear :model-value="sysInfo.cpu" rounded height="8"
                                 :indeterminate="sysInfo.cpu===0" rounded-bar
                                 color="grey-lighten-2" class="w-33 ml-2"/>
              <span class="ml-2">{{sysInfo.cpu.toFixed(1)}}%</span>
            </div>
            <v-sparkline
                height="50"
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
          <div>
            <div class="d-flex align-center justify-center">
              <v-icon icon="ri-ram-2-line"></v-icon>
              <span class="mr-2 ml-1">内存</span>
              <v-progress-linear :model-value="sysInfo.memory" rounded height="8"
                                 :indeterminate="sysInfo.memory===0" rounded-bar
                                 color="grey-lighten-2" class="w-33 ml-2"/>
              <span class="ml-2">{{sysInfo.memory.toFixed(1)}}%</span>
            </div>
            <v-sparkline
                height="50"
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
      <v-card height="300">
        <v-card-title>
          控制面板
        </v-card-title>
        <v-card-text>
          <v-row dense class="mb-4 mt-6">
            <div class="d-flex align-center">
              <span style="font-size: larger">回档</span>
              <template v-for="day in 5">
                <v-dialog max-width="500">
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-btn v-bind="activatorProps" color="info" :text="day+'天'"
                           :disabled="roomInfo.clusterSetting.name===''"
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
          <v-row dense class="mb-4 mt-6">
            <div class="d-flex align-center">
              <template v-for="[k, v] in Object.entries(buttonMap).slice(0, 3)">
                <v-dialog persistent max-width="500" class="flex-wrap">
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-btn v-bind="activatorProps" :color="v.color" :text="v.name"
                           size="large" class="mr-6" variant="tonal"
                           :disabled="roomInfo.clusterSetting.name===''"
                           :loading="v.name==='更新游戏'&&isUpdating"
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
                           :disabled="roomInfo.clusterSetting.name===''"
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
      <v-card height="300">
        <v-card-title>
          命令执行
        </v-card-title>
        <v-card-text>
          <v-row no-gutters class="mb-4 mt-6">
            <v-text-field v-model="announceForm.message"
                          append-inner-icon="ri-send-plane-fill"
                          @click:append-inner="handleAnnounce"
                          :loading="announceLoading"
                          :disabled="roomInfo.clusterSetting.name===''"
                          class="w-100"
                          label="公告内容" clearable>
            </v-text-field>
          </v-row>
          <v-row no-gutters class="mb-4 mt-16" style="margin-top: 100px">
            <v-col cols="3">
              <v-select v-model="consoleForm.world"
                        density="compact" label="世界"
                        class="mr-1"
                        item-title="world"
                        item-value="world"
                        :items="worldInfo"
                        :disabled="roomInfo.clusterSetting.name===''"
                        :item-props="worldInfoProps">
              </v-select>
            </v-col>
            <v-col>
              <v-text-field v-model="consoleForm.cmd" density="compact"
                            append-inner-icon="ri-send-plane-fill"
                            @click:append-inner="handleConsole"
                            :loading="consoleLoading"
                            :disabled="roomInfo.clusterSetting.name===''"
                            label="命令内容" clearable>
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-card height="250">
        <v-card-title>
          <div class="d-flex justify-space-between">
            <span>世界信息</span>
            <v-dialog v-model="allScreensDialogVisible" max-width="1000" @after-enter="handleOpenAllScreensDialog">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn variant="text" v-bind="activatorProps" class="ml-4">
                  检查世界
                </v-btn>
              </template>
              <v-card title="正在运行的饥荒程序">
                <v-card-text>
                  <v-select v-model="selectRegions" item-value="value" item-title="label"
                            :disabled="lobbyCheckLoading"
                            @update:model-value="handleCheckLobby"
                            :items="regions" multiple chips></v-select>

                  <div class="mt-4">
                    <v-alert v-if="lobbyCheckLoading" prominent
                             density="compact" type="info">
                      正在从饥荒大厅中查询结果，请稍后
                    </v-alert>
                    <v-alert v-if="lobbyCheckResult&&!lobbyCheckLoading" prominent
                             density="compact" type="success">
                      已在饥荒大厅中查询到对应房间，检查通过
                    </v-alert>
                    <v-alert v-if="!lobbyCheckResult&&!lobbyCheckLoading" prominent
                             density="compact" type="error">
                      未在饥荒大厅中查询到对应房间，检查未通过，请在上面的下拉菜单中增加查询地区或检查主世界是否启动成功
                    </v-alert>
                  </div>

                  <v-alert prominent density="compact" type="warning" variant="outlined" class="mt-4">
                    由于无法预知的异常情况(房间设置中删除世界后，平台未能成功关闭对应的饥荒程序等)，可能会存在异常运行的进程，导致额外资源占用，平台提供该页面进行手动停止
                  </v-alert>
                  <v-alert prominent density="compact" type="info" variant="outlined" class="mt-4">
                    名称格式为：DST_集群名_世界ID
                  </v-alert>

                  <v-sheet border rounded class="my-4">
                    <v-data-table :items="allScreens" hide-default-footer :headers="screenHeaders" :loading="allScreensLoading">
                      <template #loading>
                        <v-skeleton-loader type="table-row@2"></v-skeleton-loader>
                      </template>

                      <template #item.screenName="{item}">
                        <v-chip label>{{item.screenName}}</v-chip>
                      </template>

                      <template #item.actions="{item}">
                        <v-btn color="error" variant="text" @click="handleKillScreen(item.screenName)">删除</v-btn>
                      </template>

                    </v-data-table>
                  </v-sheet>
                </v-card-text>
              </v-card>
            </v-dialog>
          </div>
        </v-card-title>
        <v-card-text>
          <template v-if="roomInfo.clusterSetting.name!==''">
            <v-sheet border rounded>
              <v-data-table
                :headers="worldInfoHeaders"
                :items="worldInfo"
                hide-default-footer
              >
                <template v-slot:item.id="{item}">
                  <v-chip label>
                    {{item.id}}
                  </v-chip>
                </template>
                <template v-slot:item.world="{item}">
                  <v-chip label color="info">
                    {{item.world}}
                  </v-chip>
                </template>
                <template v-slot:item.type="{item}">
                  <v-chip v-if="item.type==='forest'" label color="success">
                    地面
                  </v-chip>
                  <v-chip v-else label color="warning">
                    洞穴
                  </v-chip>
                </template>
                <template v-slot:item.isMaster="{item}">
                  <v-chip v-if="item.isMaster" label color="info">
                    是
                  </v-chip>
                  <v-chip v-else label>
                    否
                  </v-chip>
                </template>
                <template v-slot:item.cpu="{item}">
                  <v-chip label>
                    {{item.cpu.toFixed(2)}}%
                  </v-chip>
                </template>
                <template v-slot:item.mem="{item}">
                  <v-chip label>
                    {{item.memSize.toFixed(0)}} [{{item.mem.toFixed(0)}}%]
                  </v-chip>
                </template>
                <template v-slot:item.diskUsed="{item}">
                  <v-chip label>
                    {{formatBytes(item.diskUsed, 0)}}
                  </v-chip>
                </template>
                <template v-slot:item.stat="{item}">
                  <v-switch
                    v-model="item.stat"
                    :loading="worldSwitchLoading"
                    @update:modelValue="handleWorldSwitch(item.world)"
                    color="info"
                    hide-details
                  ></v-switch>
                </template>
              </v-data-table>
            </v-sheet>
          </template>
          <template v-else>
            <v-alert
              type="info"
              prominent
              title="没有发现世界"
            >
              请前往 设置-房间 进行创建，创建前请确认游戏已经安装成功，可以显示游戏版本
            </v-alert>
          </template>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import {onMounted, onBeforeUnmount} from "vue";
import {formatBytes, initTheme, truncateString, sleep} from "@/utils/tools";
import useGlobalStore from "@/plugins/pinia/global";
import useConfigStore from "@/plugins/pinia/config";
import externalApi from "@/api/externalApi";
import homeApi from "@/api/home";
import {showSnackbar} from "@/utils/snackbar";


onMounted(async () => {
  initTheme()
  await sleep(100)
  await getWorldInfo()
  await getConnectionCode()
  await getRoomInfo()
  getVersion()
  handleGetUpdating()
  startRequests()
})

const globalStore = useGlobalStore()
const configStore = useConfigStore()

const connectionCode = ref('')
const connectionCodeLoading = ref(false)
const getConnectionCode = async () => {
  connectionCodeLoading.value = true
  if (!globalStore.selectedDstCluster) {
    await sleep(1000)
  }
  externalApi.connectionCode.get({clusterName: globalStore.selectedDstCluster}).then(response => {
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
  clusterSetting: {},
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
  players: [],
})
const getRoomInfo = async () => {
  if (!globalStore.selectedDstCluster) {
    await sleep(1000)
  }
  homeApi.roomInfo.get({clusterName: globalStore.selectedDstCluster}).then(response => {
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
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
  }
  externalApi.modInfo.get(reqForm).then(response => {
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

const isUpdating = ref(false)

const handleGetUpdating = () => {
  homeApi.isUpdating.get().then(response => {
    isUpdating.value = response.data
  })
}

const execDialogConfirmButtonLoading = ref(false)
const handleExec = async (type, extraData) => {
  execDialogConfirmButtonLoading.value = true
  const reqForm = {
    type: type,
    extraData: extraData,
    clusterName: globalStore.selectedDstCluster,
    worldName: "",
  }
  try {
    const response = await homeApi.exec.post(reqForm)
    handleGetUpdating()
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
  const reqForm = {
    type: 'announce',
    extraData: announceForm.value.message,
    clusterName: globalStore.selectedDstCluster,
    worldName: '',
  }
  homeApi.exec.post(reqForm).then(response => {
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
    showSnackbar('请选择一个世界', 'error')
    return
  }
  if (consoleForm.value.cmd === '') {
    showSnackbar('请输入要执行的命令', 'error')
    return
  }
  consoleLoading.value = true
  const reqForm = {
    type: 'console',
    extraData: consoleForm.value.cmd,
    clusterName: globalStore.selectedDstCluster,
    worldName: consoleForm.value.world,
  }
  homeApi.exec.post(reqForm).then(response => {
    showSnackbar(response.message)
    consoleForm.value.cmd = ''
  }).finally(() => {
    consoleLoading.value = false
  })
}


const worldInfoProps = (item) => {
  let disabled, icon
  disabled = !item.stat
  if (item.type === 'forest') {
    icon = 'ri-sun-fill'
  } else if (item.type === 'cave') {
    icon = 'ri-typhoon-fill'
  } else {
    return {
      disabled: true,
      prependIcon: 'ri-error-warning-fill',
      title: '请选择世界',
      value: null,
    }
  }
  return {
    disabled: disabled,
    prependIcon: icon
  }

};

let intervalSysId = null
let intervalWorldId = null
const startRequests = () => {
  intervalSysId = setInterval(() => {
    if (globalStore.inDashboard) {
      getSysInfo()
    }
  }, 2000)
  intervalWorldId = setInterval(() => {
    if (globalStore.selectedDstCluster) {
      if (globalStore.inDashboard) {
        getWorldInfo()
        handleGetUpdating()
      }
    }
  }, 10000)
}
const cancelRequests = () => {
  if (intervalSysId) {
    clearInterval(intervalSysId)
    clearInterval(intervalWorldId)
    intervalSysId = null
    intervalWorldId = null
  }
}

const worldInfo = ref([{
  id: '',
  stat: false,
  world: '',
  type: '',
  cpu: 0,
  mem: 0,
  memSize: 0,
  diskUsed: 0,
}])

const worldInfoHeaders = ref([
  { title: "ID", value: 'id' },
  { title: "世界名", value: 'world' },
  { title: "类型", value: 'type' },
  { title: "主节点", value: 'isMaster' },
  { title: "CPU", value: 'cpu' },
  { title: "内存(MiB)", value: 'mem' },
  { title: "磁盘", value: 'diskUsed' },
  { title: "状态", value: 'stat' },
])

const getWorldInfo = async (force = true) => {
  if (roomInfo.value.clusterSetting.name === '') {
    return
  }
  if (!force) {
    if (!globalStore.selectedDstCluster) {
      await sleep(1000)
    }
  }
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
  }
  homeApi.worldInfo.get(reqForm).then(response => {
    worldInfo.value = response.data
  })
}

const worldSwitchLoading = ref(false)
const handleWorldSwitch = (world) => {
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
    worldName: world,
    type: 'switch',
    extraData: "",
  }
  worldSwitchLoading.value = true
  homeApi.exec.post(reqForm).finally(async () => {
    await getWorldInfo()
    await sleep(1500)
    worldSwitchLoading.value = false
  })
}

const allScreensLoading = ref(false)
const allScreens = ref([])
const allScreensDialogVisible = ref(false)
const handleOpenAllScreensDialog = () => {
  allScreensDialogVisible.value = true
  allScreensLoading.value = true
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
  }
  homeApi.allScreens.get(reqForm).then(response => {
    allScreens.value = response.data
  }).finally(() => {
    allScreensLoading.value = false
  })
  handleCheckLobby()
}
const screenKillLoading = ref(false)
const handleKillScreen = (screenName) => {
  const reqForm = {
    screenName: screenName
  }
  screenKillLoading.value = true
  homeApi.screenKill.post(reqForm).then(response => {
    showSnackbar(response.message)
    handleOpenAllScreensDialog()
  }).catch(() => {
  }).finally(() => {
    screenKillLoading.value = false
  })
}

const regions = [
  {
    label: 'ap-southeast-1',
    value: 'ap-southeast-1',
  },
  {
    label: 'ap-east-1',
    value: 'ap-east-1',
  },
  {
    label: 'us-east-1',
    value: 'us-east-1',
  },
  {
    label: 'eu-central-1',
    value: 'eu-central-1',
  },
]
const selectRegions = ref(['ap-southeast-1', 'ap-east-1'])
const lobbyCheckResult = ref(false)
const lobbyCheckLoading = ref(false)
const screenHeaders = ref([
  { title: "名称", key: 'screenName', value: 'screenName' },
  { title: "操作", key: 'actions' },
])

const handleCheckLobby = () => {
  lobbyCheckLoading.value = true
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
    regions: selectRegions.value
  }
  externalApi.checkLobby.post(reqForm).then(response => {
    lobbyCheckResult.value = response.data
  }).finally(() => {
    lobbyCheckLoading.value = false
  })
}

onBeforeUnmount(() => {
  cancelRequests();
  window.removeEventListener('beforeunload', cancelRequests);
})
</script>