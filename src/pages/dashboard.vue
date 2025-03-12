<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card min-height="330">
        <v-card-title>
          房间信息
        </v-card-title>
        <v-card-text v-if="roomInfo.roomSettingBase.name!==''">
          <v-row dense class="mb-4">
            <v-col cols="12" sm="7">
              <div class="d-flex align-center">
                <span>房间名</span>
                <v-btn v-copy="globalStore.name" variant="text"
                       append-icon="ri-file-copy-2-line"
                >{{truncateString(globalStore.name)}}</v-btn>
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
          <v-row dense class="mb-4">
            <v-col cols="12" sm="7">
              <div class="d-flex align-center">
                <span>天数</span>
                <v-chip :color="roomInfo.seasonInfo.cycles>-1?'success':'danger'"
                        label class="ml-4">
                  {{ roomInfo.seasonInfo.cycles }}
                </v-chip>
              </div>
            </v-col>
            <v-col cols="12" sm="5">
              <div class="d-flex align-center">
                <span>阶段</span>
                <v-chip :color="roomInfo.seasonInfo.phase.zh==='获取失败'?'danger':'success'"
                        label class="ml-4">
                  {{ roomInfo.seasonInfo.phase.zh }}
                </v-chip>
              </div>
            </v-col>
          </v-row>
          <v-row dense class="mb-4">
            <v-col cols="12" sm="7">
              <div class="d-flex align-center">
                <span>季节</span>
                <v-chip :color="roomInfo.seasonInfo.cycles>-1?'success':'danger'"
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
                      <v-table :theme="globalStore.theme">
                        <thead>
                        <tr>
                          <th class="text-left">
                            Name
                          </th>
                          <th class="text-left">
                            Calories
                          </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr
                            v-for="modInfo in modInfoList"
                            :key="modInfo.id"
                        >
                          <td>{{ modInfo.name }}</td>
                          <td>{{ modInfo.id }}</td>
                        </tr>
                        </tbody>
                      </v-table>
                    </v-card-text>
                  </v-card>
                </v-dialog>
              </div>
            </v-col>
          </v-row>
          <v-row dense class="mb-4">
            <v-col cols="12" sm="7">
              <div class="d-flex align-center">
                <span>游戏版本</span>
                <v-chip :color="roomInfo.seasonInfo.cycles>-1?'success':'danger'"
                        label class="ml-4">
                  ({{ version.local }}/{{ version.server }})
                </v-chip>
              </div>
            </v-col>
            <v-col cols="12" sm="5">
              <div class="d-flex align-center">
                <span>在线玩家</span>
                <v-chip label color="primary" class="ml-4">
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
      <v-card min-height="330">
        <v-card-title>
          系统信息
        </v-card-title>
        <v-card-text>
          <div class="mt-2">
            <div class="d-flex align-center justify-center">
              <v-icon icon="ri-cpu-line"></v-icon>
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
</template>

<script setup>
import {onMounted, onBeforeUnmount} from "vue";
import {initTheme, truncateString} from "@/utils/tools";
import useGlobalStore from "@/plugins/pinia/global";
import externalApi from "@/api/externalApi";
import homeApi from "@/api/home";


onMounted(() => {
  initTheme()
  getConnectionCode()
  getRoomInfo()
  getVersion()
  startRequests()
})

const globalStore = useGlobalStore()

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

const cpuList = ref([])
const memoryList = ref([])
const needContinue = ref(true)

const getSysInfo = () => {
  homeApi.sysInfo.get().then(response => {
    sysInfo.value = response.data
    if (cpuList.value.length > 60) {
      cpuList.value.shift()
      cpuList.value.push(sysInfo.value.cpu.toFixed(1))
      memoryList.value.shift()
      memoryList.value.push(sysInfo.value.memory.toFixed(1))
    } else {
      cpuList.value.push(sysInfo.value.cpu.toFixed(1))
      memoryList.value.push(sysInfo.value.memory.toFixed(1))
    }
  }).catch(() => {
    needContinue.value = false
  })
}

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
  }).finally(() => {
    modInfoLoading.value = false
  })
}

onBeforeUnmount(() => {
  cancelRequests();
  window.removeEventListener('beforeunload', cancelRequests);
})
</script>