<template>
  <v-tabs v-model="activeTabName" align-tabs="start"
          class="v-tabs-pill" color="primary" show-arrows>
    <v-tab value="config">备份配置</v-tab>
    <v-tab value="manage">备份管理</v-tab>
  </v-tabs>

  <v-tabs-window v-model="activeTabName">
    <v-tabs-window-item value="config">
      <v-card class="mt-4" height="820">
        <v-card-title>
          <div class="card-header">
            <span>备份配置</span>
            <v-btn :loading="manualBackupLoading" @click="handleManualBackup">立即备份</v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <v-alert color="warning" density="compact" class="mt-4 mb-4">
            定时更新和定时备份的时间不能相同，否则会覆盖其中一个任务的执行
          </v-alert>
          <div class="d-flex align-center justify-space-between mb-4">
            <div class="mr-4" style="width: 100%;">
              <v-progress-linear :model-value="parseFloat(diskUsage.toFixed(1))"
                                 bg-color="blue" height="20" rounded-bar rounded>
                <template #default>
                  <span>磁盘使用率:{{ parseFloat(diskUsage.toFixed(1)) }}%</span>
                </template>
              </v-progress-linear>
            </div>

          </div>
          <div class="d-flex align-center mb-4">
            <span>将在</span>
            <div style="width: 120px; margin: 0 8px">
              <v-menu v-model="backupTimeMenu" :close-on-content-click="false"
                      offset-y transition="scale-transition">
                <template v-slot:activator="{ props }">
                  <v-text-field v-model="backupSetting.time" :loading="loadingTime" density="compact" label="检查时间"
                                readonly v-bind="props"></v-text-field>
                </template>
                <v-time-picker v-model="backupSetting.time" format="24hr" scrollable title="选择时间"
                               use-seconds @update:model-value="handleUpdate">
                </v-time-picker>
              </v-menu>
            </div>
            <span>对服务器进行备份，可能会导致1秒左右的卡顿。</span>
          </div>
          <div class="d-flex align-center mb-4">
            <span>自动备份功能已</span>
            <v-switch v-model="backupSetting.enable" :label="backupSetting.enable ? '开启' : '关闭'" :loading="loadingEnable"
                      class="ml-4 mr-4" inset @change="handleUpdate"></v-switch>
          </div>
          <div class="mb-4">
            <span>请留意上方磁盘使用率，如空间不足，可批量删除多个备份。</span>
          </div>
          <div class="mb-4">
            <span>点击恢复可恢复至备份创建时间点，恢复后请手动启动服务器。</span>
          </div>

        </v-card-text>
      </v-card>
    </v-tabs-window-item>
    <v-tabs-window-item value="manage">
      <v-card class="mt-4" height="820">
        <v-card-title>
          <div class="card-header">
            <span>备份管理</span>
            <v-btn color="error" @click="handleMultiDelete">批量删除</v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <v-container height="700" style="overflow-y: auto">
            <v-data-table v-model="multipleSelection" :headers="headers" :items="backupFiles"
                          hide-default-footer item-value="name" show-select>
              <template v-slot:loading>
                <v-skeleton-loader type="table-row@12"></v-skeleton-loader>
              </template>
              <!-- 文件大小 -->
              <template v-slot:item.size="{ item }">
                <v-chip color="info" label>
                  {{ formatBytes(item.size) }}
                </v-chip>
              </template>

              <!-- 操作列 -->
              <template v-slot:item.actions="{ item }">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn append-icon="$dropdown" color='#007bff' size="small"
                           v-bind="props" variant="text">
                      操作
                    </v-btn>
                  </template>
                  <v-list :loading="actionsLoading">
                    <v-list-item link @click="handleCommand({ cmd: 'download', row: item })">
                      <v-list-item-title>下载</v-list-item-title>
                    </v-list-item>
                    <v-list-item link @click="handleCommand({ cmd: 'restore', row: item })">
                      <v-list-item-title>恢复</v-list-item-title>
                    </v-list-item>
                    <v-list-item color="error" link
                                 @click="handleCommand({ cmd: 'delete', row: item })">
                      <v-list-item-title class="text-error">删除</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </v-container>
        </v-card-text>
      </v-card>
    </v-tabs-window-item>
  </v-tabs-window>

  <v-dialog v-model="confirmDialog" max-width="400">
    <v-card>
      <v-card-title>请确认您的操作</v-card-title>
      <v-card-text>
        {{ dialogMessage }}
      </v-card-text>
      <v-card-actions>
        <v-btn size="small" variant="tonal" @click="confirmDialog = false">取消</v-btn>
        <v-btn :loading="confirmLoading" color="primary" size="small" variant="tonal"
               @click="confirmAction">确认
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import toolsApi from "@/api/tools";
import {VTimePicker} from "vuetify/labs/VTimePicker";
import {formatBytes, saveFile} from "@/utils/tools.js";
import {showSnackbar} from "@/utils/snackbar";

onMounted(() => {
  getInfo()
})

const activeTabName = ref('config')

const backupFiles = ref([])
const backupSetting = ref({
  enable: false,
  time: '00:00:00'
})
const diskUsage = ref(0)
const backupTimeMenu = ref(false);
const loadingTime = ref(false)
const loadingEnable = ref(false)

const multipleSelection = ref([])

function DEFAULT_HEADERS() {
  return [
    {
      title: '文件名',
      align: 'start',
      key: 'name',
    },
    {title: '文件大小', key: 'size',},
    {title: '创建时间', key: 'createTime',},
    {title: '操作', key: 'actions', sortable: false}
  ]
}

const headers = ref(DEFAULT_HEADERS())

// 获取信息
const loading = ref(false)
const getInfo = () => {
  loading.value = true
  toolsApi.backup.get().then(response => {
    backupFiles.value = response.data.backupFiles
    backupSetting.value = response.data.backupSetting
    diskUsage.value = response.data.diskUsage
  }).finally(() => {
    loading.value = false
  })
}

// 更新备份时间
const handleUpdate = () => {
  if (!backupSetting.value.time) {
    showSnackbar('请选择时间', 'warning')
    return
  }
  loadingTime.value = true
  loadingEnable.value = true
  const backupForm = {
    time: backupSetting.value.time,
    enable: backupSetting.value.enable
  }
  toolsApi.backup.put(backupForm).then(response => {
    showSnackbar(response.message, 'success')
  }).finally(() => {
    loadingTime.value = false
    loadingEnable.value = false
  })
}

// 操作
const actionsLoading = ref(false)
const handleCommand = (actions) => {
  let cmd = actions.cmd
  let row = actions.row
  actionsLoading.value = true
  switch (cmd) {
    case 'download':
      handleDownload(row)
      break;
    case 'restore':
      showConfirmDialog('将执行恢复操作，是否继续？', () => handleActionConfirm(row, 'restore'))
      break;
    case 'delete':
      showConfirmDialog('将执行删除操作，是否继续？', () => handleActionConfirm(row, 'delete'))
      break;
    default:
      actionsLoading.value = false
      showSnackbar('error')
  }
}

// 批量删除
const handleMultiDelete = () => {
  console.log(multipleSelection.value)
  if (multipleSelection.value.length === 0) {
    showSnackbar('请至少选择一个文件', 'warning')
    return
  }
  showConfirmDialog('将执行批量删除操作，是否继续？', () => confirmMultiDelete())
}

// 确认对话框相关
const confirmDialog = ref(false)
const confirmLoading = ref(false)
const dialogMessage = ref('')
let currentAction = null

// 显示确认对话框
const showConfirmDialog = (message, action) => {
  dialogMessage.value = message
  currentAction = action
  confirmDialog.value = true
}

// 执行确认操作
const confirmAction = () => {
  confirmLoading.value = true
  if (currentAction) {
    currentAction()
  } else {
    confirmLoading.value = false
    confirmDialog.value = false
  }
}

// 确认删除操作
const confirmMultiDelete = () => {
  const reqForm = {
    names: []
  }

  Object.values(multipleSelection.value).forEach(fileName => {
    reqForm.names.push(fileName);
  });

  toolsApi.multiDelete.delete(reqForm).then(response => {
    showSnackbar(response.message, 'success')
  }).catch((error) => {
    showSnackbar(error.message || '删除失败', 'error')
  }).finally(() => {
    confirmLoading.value = false
    confirmDialog.value = false
    getInfo()
  })
}

// 下载
const handleDownload = (row) => {
  toolsApi.backupDownload.post({filename: row.name}).then(async (response) => {
    await saveFile(response.data, row.name)
  }).finally(() => {
    actionsLoading.value = false
  })
}

// 单个删除确认 - 删除/恢复
const handleActionConfirm = (row, action) => {
  const reqForm = {
    name: row.name
  }

  switch (action) {
    case 'delete':
      toolsApi.backup.delete(reqForm).then(response => {
        showSnackbar(response.message, 'success');
      }).catch((error) => {
        showSnackbar(error.message || '删除失败', 'error');
      }).finally(() => {
        confirmLoading.value = false;
        confirmDialog.value = false;
        actionsLoading.value = false;
        getInfo();
      });
      break;
    case 'restore':
      toolsApi.backupRestore.post(reqForm).then(response => {
        showSnackbar(response.message, 'success');
      }).catch((error) => {
        showSnackbar(error.message || '恢复失败', 'error');
      }).finally(() => {
        confirmLoading.value = false;
        confirmDialog.value = false;
        actionsLoading.value = false;
        getInfo();
      });
      break;
    default:
      confirmLoading.value = false;
      confirmDialog.value = false;
      actionsLoading.value = false;
  }
}

// 立即备份
const manualBackupLoading = ref(false)
const handleManualBackup = () => {
  manualBackupLoading.value = true
  toolsApi.backup.post().then(response => {
    showSnackbar(response.message, 'success')
  }).finally(() => {
    manualBackupLoading.value = false
    getInfo()
  })
}


</script>

<style scoped></style>
