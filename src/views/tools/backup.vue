<template>
  <v-card>
    <v-card-title>
      <div class="d-flex justify-space-between align-center">
        <span>日志管理</span>
        <div>
          <v-btn color="warning" class="mr-2" density="comfortable"
                 v-tooltip:top="'请导入由饥荒管理平台创建的备份，并且集群名要相同，否则会恢复失败(不推荐使用此功能，建议解压后重新打包并导入)'"
                 append-icon="ri-question-fill">
            导入备份
          </v-btn>
          <v-btn color="info" class="mr-2" density="comfortable">
            立即备份
          </v-btn>
          <v-btn color="error" class="mr-2" density="comfortable">
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
        <v-data-table :items="backupFiles" :loading="getInfoLoading" :headers="headers">
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
                          <v-btn @click="handleClusterDeactivate(item)" :loading="confirmBoxButtonLoading">确定</v-btn>
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
                          <v-btn @click="handleClusterDelete(item)" :loading="confirmBoxButtonLoading">确定</v-btn>
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

</script>