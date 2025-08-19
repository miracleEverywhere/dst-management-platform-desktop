<template>
  <v-card height="870">
    <v-card-title>
      <div class="card-header">
        <span>日志清理</span>
        <div class="d-flex align-center">
          <v-checkbox v-model="allSelected" :indeterminate="indeterminate"
                      label="全选" @change="toggleAll" class="mr-4"
          ></v-checkbox>
          <v-btn class="mr-4" :loading="logsInfoLoading" @click="handleGetLogsInfo">刷新</v-btn>
          <v-btn color="error" class="mr-4" :loading="cleanButtonLoading" @click="handleCleanLogs">删除</v-btn>
        </div>
      </div>
    </v-card-title>
    <v-card-text>
      <v-row class="d-flex">
        <v-checkbox v-for="(item, index) in logFileTypes" :key="index"
                    v-model="cleanLogFileTypes" :value="item"
                    :label="logFileTypeMap[item].zh" @change="updateAllSelected"
                    class="mr-4 mt-8"
        ></v-checkbox>
      </v-row>
      <v-row>
        <v-data-table
            :headers="headers"
            :items="logsInfo"
            :loading="logsInfoLoading"
            :items-per-page="10"
            :page.sync="logsInfoTablePage"
            :server-items-length="logsInfoTableRows"
            class="mt-4"
        >
          <!-- 加载效果 -->
          <template v-slot:loading>
            <v-skeleton-loader type="table-row@6"></v-skeleton-loader>
          </template>

          <template v-slot:item.name="{item}">
            <v-chip label color="success">
              <v-icon icon="ri-file-text-line" start/>
              {{item.name}}
            </v-chip>
          </template>

          <template v-slot:item.size="{item}">
            <v-chip label color="info">
              <v-icon icon="ri-hard-drive-3-line" start/>
              {{formatBytes(item.size)}}
            </v-chip>
          </template>

          <template v-slot:item.num="{item}">
            <v-chip label color="primary">
              <v-icon icon="ri-file-search-line" start/>
              {{item.num}}
            </v-chip>
          </template>

        </v-data-table>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import {showSnackbar} from "@/utils/snackbar";
import logsApi from "@/api/logs"
import {formatBytes} from "@/utils/tools.js";
import useGlobalStore from "@/plugins/pinia/global";


onMounted(() => {
  handleGetLogsInfo()
})

const globalStore = useGlobalStore()

const logsInfo = ref([])
const handleGetLogsInfo = (tip=false) => {
  if (tip) {
    showSnackbar('刷新成功', 'success')
  }
  logsInfoLoading.value = true
  const reqForm = {
    clusterName: globalStore.selectedDstCluster
  }
  logsApi.clean.status.get(reqForm).then(response => {
    logsInfo.value = response.data
  }).finally(() => {
    logsInfoLoading.value = false
  })
}

const logFileTypes = ref(['World', 'Chat', 'Access', 'Runtime'])
const cleanLogFileTypes = ref([])

const logFileTypeMap = {
  World: {
    zh: '世界日志',
    en: 'World',
  },
  Chat: {
    zh: '聊天日志',
    en: 'Chat',
  },
  Access: {
    zh: '请求日志',
    en: 'Access',
  },
  Runtime: {
    zh: '运行日志',
    en: 'Runtime',
  },
}

const cleanButtonLoading = ref(false)
const handleCleanLogs = () => {
  if (cleanLogFileTypes.value.length === 0) {
    showSnackbar("请至少选择一种日志", 'error')
    return
  }
  cleanButtonLoading.value = true
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
    logTypes: cleanLogFileTypes.value
  }
  logsApi.clean.clean.post(reqForm).then(response => {
    showSnackbar(response.message)
  }).finally(() => {
    cleanButtonLoading.value = false
    cleanLogFileTypes.value = []
    handleGetLogsInfo()
  })
}

// 全选框的状态
const allSelected = ref(false);
const indeterminate = ref(false);

// 计算属性：是否所有子复选框都被选中
const isAllSelected = computed(() => logFileTypes.value.length === cleanLogFileTypes.value.length);

// 计算属性：是否有部分子复选框被选中
const isIndeterminate = computed(() => cleanLogFileTypes.value.length > 0 && !isAllSelected.value);

// 监听子复选框的变化，更新全选框的状态
watch(cleanLogFileTypes, () => {
  allSelected.value = isAllSelected.value;
  indeterminate.value = isIndeterminate.value;
});

// 全选框的点击事件
const toggleAll = () => {
  if (allSelected.value) {
    cleanLogFileTypes.value = [...logFileTypes.value]; // 选中所有
  } else {
    cleanLogFileTypes.value = []; // 取消所有
  }
  indeterminate.value = false; // 取消 indeterminate 状态
};

// 子复选框的点击事件
const updateAllSelected = () => {
  allSelected.value = isAllSelected.value;
  indeterminate.value = isIndeterminate.value;
};

const headers = ref([
  { title: "日志类型", value: "name"},
  { title: "日志大小", value: "size" },
  { title: "日志数量", value: "num" },
])

const logsInfoLoading = ref(false)
const logsInfoTablePage = ref(1)
const logsInfoTableRows = ref(0)
</script>

<style scoped>
</style>