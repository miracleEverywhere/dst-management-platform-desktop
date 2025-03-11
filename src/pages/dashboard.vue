<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title>
          房间信息
        </v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="12" sm="7">
              <div class="d-flex align-center">
                <span>房间名</span>
                <v-btn v-copy="globalStore.name" variant="text" append-icon="ri-file-copy-2-line">{{truncateString(globalStore.name)}}</v-btn>
              </div>
            </v-col>
            <v-col cols="12" sm="5">
              <div class="d-flex align-center">
                <span>直连代码</span>
                <v-btn v-copy="connectionCode" variant="text" :loading="connectionCodeLoading"
                       append-icon="ri-file-copy-2-line">点击复制</v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col  cols="12" sm="6">
      <v-card>
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
                :gradient="gradients[5]"
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
                :gradient="gradients[5]"
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

const gradients = [
  ['#222'],
  ['#42b3f4'],
  ['red', 'orange', 'yellow'],
  ['purple', 'violet'],
  ['#00c6ff', '#F0F', '#FF0'],
  ['#f72047', '#ffd200', '#1feaea'],
]

onBeforeUnmount(() => {
  cancelRequests();
  window.removeEventListener('beforeunload', cancelRequests);
})
</script>