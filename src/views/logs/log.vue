<template>
  <v-card min-height="620" class="mt-4">
    <v-card-title>
      <v-row>
        <v-col cols="8">日志查看</v-col>
        <v-col cols="4" v-if="props.historical">
          <v-select v-model="selectedFile" density="compact"
                    label="选择历史日志" @update:modelValue="getFileConnect"
                    :items="fileList" :item-props="setItemProps" variant="underlined">
          </v-select>

        </v-col>
        <v-spacer/>
        <v-col v-if="!props.historical" cols="2">
          <div class="d-flex align-center ml-12">
            <span>自动拉取</span>
            <v-switch v-model="autoPull" class="ml-4"/>
          </div>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <MdPreview :modelValue="logsValue" :theme="editorTheme" previewTheme="github" style="height: 666px;"/>
      <div class="d-flex align-center justify-end" style="width: 100%">
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
  console.log(props)
  if (props.historical) {
    handleGetLogFile()
  } else {
    startRequests()
  }
})

const autoPull = ref(true)
const logsForm = ref({
  line: 25,
  type: props.type
})
const logsValue = ref('')
const handlePullLogs = () => {
  logsApi.logValue.get(logsForm.value).then(response => {
    logsValue.value = createMdEditorValue(response.data.join("\n"), 'text', 'open')
  })
}

let intervalId = null
const startRequests = () => {
  intervalId = setInterval(() => {
    if (autoPull.value) {
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
const handleGetLogFile = () => {
  const reqForm = {
    type: props.type
  }
  logsApi.historical.logFile.get(reqForm).then(response => {
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