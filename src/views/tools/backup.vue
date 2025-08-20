<template>
  <v-card>
    <v-card-title>
      <div class="d-flex justify-space-between align-center">
        <span>备份管理</span>
        <div>
          <v-dialog v-model="uploadDialogVisible" :persistent="uploadLoading" class="flex-wrap" max-width="65%">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn class="mr-2" color="warning" density="comfortable"
                     v-bind="activatorProps" append-icon="ri-question-fill">
                导入备份
              </v-btn>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card title="导入备份" min-height="500">
                <v-card-text>
                  <template v-if="!uploadLoading">
                    <v-alert color="warning" density="compact" class="mt-2 mb-2">
                      请上传由饥荒管理平台生成的.tgz备份文件，并且集群名必须一致
                    </v-alert>
                    <v-file-upload density="default" icon="ri-upload-cloud-2-line"
                                   @update:modelValue="handleUpload">
                    </v-file-upload>
                  </template>
                  <template v-else>
                    <sc-loading>上传中，请稍后</sc-loading>
                  </template>
                </v-card-text>
              </v-card>
            </template>
          </v-dialog>
          <v-btn color="info" class="mr-2" density="comfortable" :loading="manualBackupLoading" @click="handleManualBackup">
            立即备份
          </v-btn>
          <v-btn color="error" class="mr-2" density="comfortable"
                 :loading="multipleDeleteLoading" @click="handleMultiDelete">
            批量删除
          </v-btn>
        </div>
      </div>
    </v-card-title>
    <v-card-text>
      <v-progress-linear v-model="diskUsage" rounded :indeterminate="getInfoLoading"
                         height="20" color="info" class="mt-4">
        <span>磁盘使用率: {{diskUsage.toFixed(2)}}%</span>
      </v-progress-linear>

      <v-sheet border rounded class="mt-6">
        <v-data-table v-model="multipleSelection" :items="backupFiles"
                      return-object show-select
                      :loading="getInfoLoading" :headers="headers">
          <template #loading>
            <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
          </template>

          <template #item.createTime="{item}">
            {{item.createTime}}
          </template>
          <template #item.cycles="{item}">
            <v-chip label>{{item.cycles}}</v-chip>
          </template>
          <template #item.size="{item}">
            {{formatBytes(item.size)}}
          </template>
          <template v-slot:item.actions="{item}">
            <v-menu open-on-hover>
              <template v-slot:activator="{ props }">
                <v-btn append-icon="ri-arrow-down-s-line" color="info" v-bind="props" variant="text">
                  操作
                </v-btn>
              </template>
              <v-list>
                <v-list-item title="下载" @click="handleDownload(item)">
                </v-list-item>
                <v-list-item title="恢复" @click="">
                  <v-dialog activator="parent" max-width="40%">
                    <template #default="{isActive}">
                      <v-card>
                        <v-card-title>
                          请确认
                        </v-card-title>
                        <v-card-text>
                          <v-alert prominent variant="text" type="info" :color="colors.grey.darken1" class="mt-4">
                            是否执行 恢复 操作？
                          </v-alert>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn @click="isActive.value = false">取消</v-btn>
                          <v-btn @click="handleRestore(item)" :loading="restoreLoading">确定</v-btn>
                        </v-card-actions>
                      </v-card>
                    </template>
                  </v-dialog>
                </v-list-item>
                <v-list-item title="删除" @click="">
                  <v-dialog activator="parent" max-width="40%">
                    <template #default="{isActive}">
                      <v-card>
                        <v-card-title>
                          请确认
                        </v-card-title>
                        <v-card-text>
                          <v-alert prominent variant="text" type="info" :color="colors.grey.darken1" class="mt-4">
                            是否执行 删除 操作？
                          </v-alert>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn @click="isActive.value = false">取消</v-btn>
                          <v-btn @click="handleDelete(item)" :loading="deleteLoading">确定</v-btn>
                        </v-card-actions>
                      </v-card>
                    </template>
                  </v-dialog>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-sheet>
    </v-card-text>
  </v-card>


</template>

<script setup>
import {showSnackbar} from '@/utils/snackbar'
import useGlobalStore from '@/plugins/pinia/global'
import toolsApi from '@/api/tools'
import {deepCopy, formatBytes} from "@/utils/tools";
import colors from "vuetify/util/colors";
import ElectronApi from "@/utils/electronApi";
import settingApi from "@/api/setting";

onMounted(() => {
  getInfo()
})

const globalStore = useGlobalStore()

const backupFiles = ref([])
const diskUsage = ref(0)
const getInfoLoading = ref(false)

const getInfo = () => {
  const reqForm = {
    clusterName: globalStore.selectedDstCluster
  }
  getInfoLoading.value = true
  toolsApi.backup.get(reqForm).then(response => {
    backupFiles.value = response.data.backupFiles
    diskUsage.value = response.data.diskUsage
  }).finally(() => {
    getInfoLoading.value = false
  })
}

const headers = ref([
  {title: '创建时间', key: 'createTime'},
  {title: '天数', key: 'cycles'},
  {title: '文件大小', key: 'size'},
  {title: '操作', key: 'actions'},
])

const actionsLoading = ref(false)
const handleDownload = (row) => {
  let url = `${globalStore.url}/download/backup/${globalStore.selectedDstCluster}/${row.name}?authorization=${globalStore.token}&&clusterName=${globalStore.selectedDstCluster}&&lang=zh`
  console.log(url)
  ElectronApi.download.file(url, row.name)
}

const restoreLoading = ref(false)
const handleRestore = (row) => {
  restoreLoading.value = true
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
    name: row.name
  }
  toolsApi.backupRestore.post(reqForm).then(response => {
    showSnackbar(response.message)
  }).catch(() => {
  }).finally(() => {
    restoreLoading.value = false
    getInfo()
  })
}

const deleteLoading = ref(false)
const handleDelete = (row) => {
  deleteLoading.value = true
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
    name: row.name
  }
  toolsApi.backup.delete(reqForm).then(response => {
    showSnackbar(response.message)
  }).catch(() => {
  }).finally(() => {
    deleteLoading.value = false
    getInfo()
  })
}

const multipleSelection = ref([])
const multipleDeleteLoading = ref(false)
const handleMultiDelete = () => {
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
    names: []
  }
  if (multipleSelection.value.length === 0) {
    showSnackbar('请选择要删除的备份文件', 'error')
    return
  }
  multipleDeleteLoading.value = true
  for (let file of multipleSelection.value) {
    reqForm.names.push(file.name)
  }
  toolsApi.multiDelete.delete(reqForm).then(response => {
    showSnackbar(response.message)
    multipleSelection.value = []
  }).catch(() => {
  }).finally(() => {
    multipleDeleteLoading.value = false
    getInfo()
  })
}

const manualBackupLoading = ref(false)
const handleManualBackup = () => {
  manualBackupLoading.value = true
  const reqForm = {
    clusterName: globalStore.selectedDstCluster
  }
  toolsApi.backup.post(reqForm).then(response => {
    showSnackbar(response.message)
  }).finally(() => {
    manualBackupLoading.value = false
    getInfo()
  })
}

const uploadLoading = ref(false)
const uploadDialogVisible = ref(false)
const uploadRef = ref()
const checkUploadFile = (param) => {
  const zipPattern = /\.tgz$/i;
  return zipPattern.test(param.name);
}
const handleUpload = (file) => {
  if (!checkUploadFile(file)) {
    showSnackbar('请上传tgz文件', 'error')
    uploadDialogVisible.value = false
    return
  }
  uploadLoading.value = true
  const formData = new FormData()
  formData.append('file', file)
  formData.append('clusterName', globalStore.selectedDstCluster)
  toolsApi.backupImport.post(formData).then(response => {
    getInfo()
    showSnackbar(response.message)
  }).finally(() => {
    uploadDialogVisible.value = false
    uploadLoading.value = false
  })
}

</script>