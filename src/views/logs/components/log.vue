<template>
  <v-card height="820" class="mt-4">
    <v-card-title>
      <v-row v-if="props.type==='world'||props.type==='chat'">
        <v-col cols="6">日志查看</v-col>
        <v-spacer/>
        <v-col cols="3">
          <v-select v-model="historicalLogsForm.worldName" density="compact"
                    label="世界选择" @update:modelValue="historicalWorldChange"
                    :items="globalStore.dstClusters.find(cluster => cluster.clusterName === globalStore.selectedDstCluster).worlds"
                    variant="outlined">
          </v-select>
        </v-col>
        <v-spacer/>
        <v-col v-if="!props.historical" cols="2">
          <div class="d-flex align-center ml-12">
            <span>自动拉取</span>
            <v-switch v-model="autoPull" :true-value="1" :false-value="0" class="ml-4"/>
          </div>
        </v-col>
        <v-col v-else cols="3">
          <v-select v-model="selectedFile" density="compact"
                    label="日志文件" @update:modelValue="getFileConnect"
                    :items="fileList"
                    variant="outlined">
          </v-select>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col cols="6">日志查看</v-col>
        <v-spacer/>
        <v-col v-if="!props.historical" cols="2">
        <div class="d-flex align-center ml-12">
          <span>自动拉取</span>
          <v-switch v-model="autoPull" :true-value="1" :false-value="0" class="ml-4"/>
        </div>
      </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <MdPreview :modelValue="logsValue" :theme="editorTheme" previewTheme="github" style="height: 686px; overflow-y: auto;"/>
      <div v-if="!props.historical" class="d-flex align-center justify-end" style="width: 100%">
        <div class="d-flex align-center" style="width: 210px">
          <v-text-field v-model="logsForm.line" density="compact" class="mr-2">
            <template #append-inner>
              行
            </template>
          </v-text-field>
          <v-btn variant="elevated" text="手动拉取" @click="handlePullLogs"></v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import {onBeforeUnmount, onMounted, ref} from "vue";
import logsApi from "@/api/logs"
import useGlobalStore from "@/plugins/pinia/global";
import {MdPreview} from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import {createMdEditorValue} from "@/utils/tools";

const globalStore = useGlobalStore()
const editorTheme = computed(() => globalStore.theme)

const props = defineProps({
  type: String,
  historical: Boolean
})

onMounted(() => {
  if (props.historical) {
    handleGetLogFile();
  } else {
    init();
    startRequests();
  }
})

const init = () => {
  if (!globalStore.dstClusters || !globalStore.selectedDstCluster) return;

  logsForm.value.worldName =
    globalStore.dstClusters.find(cluster => cluster.clusterName === globalStore.selectedDstCluster)?.worlds?.[0] ??
    null;
}

const autoPull = ref(1);
const logsForm = ref({
  line: 25,
  type: props.type,
  clusterName: globalStore.selectedDstCluster,
  worldName: null, // 先设为 null，init() 会更新
});
const logsValue = ref('')

const handlePullLogs = () => {
  if (!logsForm.value.worldName && (logsForm.value.type !== 'runtime' && logsForm.value.type !== 'access')) {
    return
  }
  logsApi.logValue.get(logsForm.value).then(response => {
    if (response.data !== null) {
      if (props.type==='runtime') {
        logsValue.value = createMdEditorValue(response.data.join("\n"), 'json', 'open')
      } else {
        logsValue.value = createMdEditorValue(response.data.join("\n"), 'text', 'open')
      }

    }
  })
}

let intervalId = null
const startRequests = () => {
  intervalId = setInterval(() => {
    if (autoPull.value === 1) {
      handlePullLogs()
    }
  }, 2000)
}
const cancelRequests = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const fileList = ref([])
const selectedFile = ref('')
const historicalLogsForm = ref({
  clusterName: globalStore.selectedDstCluster,
  worldName: globalStore.dstClusters?.find(cluster => cluster.clusterName === globalStore.selectedDstCluster)?.worlds?.[0] ?? null,
  type: props.type
})
const handleGetLogFile = () => {
  const reqForm = {
    type: props.type
  }
  logsApi.historical.logFile.get(historicalLogsForm.value).then(response => {
    fileList.value = []
    if (response.data.length) {
      for (let i of response.data) {
        fileList.value.push({
          title: i.label, value: i.value
        })
      }
    }

  })
}
const historicalLogLoading = ref(false)
const historicalWorldChange = () => {
  handleGetLogFile()
  selectedFile.value = ''
}

const getFileConnect = () => {
  historicalLogLoading.value = true
  const reqForm = {
    file: selectedFile.value
  }
  logsApi.historical.log.get(reqForm).then(response => {
    logsValue.value = createMdEditorValue(response.data, 'text', 'open')
  }).finally(() => {
    historicalLogLoading.value = false
  })
}

const setItemProps = (item) => {
  return {
    prependIcon: 'ri-file-text-line'
  }
};

onBeforeUnmount(() => {
  cancelRequests();
  window.removeEventListener('beforeunload', cancelRequests);
})

defineExpose({
  cancelRequests,
  startRequests
});
</script>

<style scoped>
</style>