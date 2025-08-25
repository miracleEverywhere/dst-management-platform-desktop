<template>
  <v-tabs v-model="tab">
    <v-tab value="info">
      集群信息
    </v-tab>
    <v-tab value="port">
      集群端口
    </v-tab>
  </v-tabs>
  <v-tabs-window v-model="tab">
    <v-tabs-window-item value="info">
      <v-alert prominent density="compact" color="warning" class="mt-4">
        删除集群会清理.klei配置文件与dst模组文件，并关闭对应的世界，该操作不会删除该集群的[备份文件，uid昵称字典]，如果你想恢已经被删除的集群，可以创建一个相同名称的集群即可
      </v-alert>
      <v-sheet border rounded class="mt-4">
        <v-data-table :items="clustersInfo" :loading="loading" :headers="clusterInfoHeaders">
          <template #loading>
            <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
          </template>

          <template #item.clusterName="{item}">
            <v-chip label color="info">
              {{item.clusterName}}
            </v-chip>
          </template>
          <template #item.clusterDisplayName="{item}">
            <v-chip label color="success">
              {{item.clusterDisplayName}}
            </v-chip>
          </template>
          <template #item.status="{item}">
            <v-chip v-if="item.status" label color="success">
              激活
            </v-chip>
            <v-chip v-else label>
              关闭
            </v-chip>
          </template>
          <template #item.worlds="{item}">
            <v-chip label>
              {{ item.worlds?.length || 0 }}
            </v-chip>
          </template>
          <template v-slot:item.actions="{item}">
            <v-menu open-on-hover>
              <template v-slot:activator="{ props }">
                <v-btn append-icon="ri-arrow-down-s-line" color="info" v-bind="props" variant="text">
                  操作
                </v-btn>
              </template>
              <v-list>
                <v-list-item title="激活集群" @click="">
                  <v-dialog activator="parent" max-width="40%">
                    <template #default="{isActive}">
                      <v-card>
                        <v-card-title>
                          请确认
                        </v-card-title>
                        <v-card-text>
                          <v-alert prominent variant="text" type="info" :color="colors.grey.darken1" class="mt-4">
                            是否执行 激活集群 操作？
                          </v-alert>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn @click="isActive.value = false">取消</v-btn>
                          <v-btn @click="handleClusterActivate(item)" :loading="confirmBoxButtonLoading">确定</v-btn>
                        </v-card-actions>
                      </v-card>
                    </template>
                  </v-dialog>
                </v-list-item>
                <v-list-item title="关闭集群" @click="">
                  <v-dialog activator="parent" max-width="40%">
                    <template #default="{isActive}">
                      <v-card>
                        <v-card-title>
                          请确认
                        </v-card-title>
                        <v-card-text>
                          <v-alert prominent variant="text" type="info" :color="colors.grey.darken1" class="mt-4">
                            是否执行 关闭集群 操作？
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
                <v-divider/>
                <v-list-item title="修改集群" @click="updateDialogForm=deepCopy(item)">
                  <v-dialog v-model="updateClusterVisible" activator="parent" max-width="40%">
                    <template #default="{isActive}">
                      <v-card>
                        <v-card-title>
                          修改集群
                        </v-card-title>
                        <v-card-text>
                          <v-row class="my-4">
                            <v-text-field v-model="updateDialogForm.clusterName" label="集群名" disabled></v-text-field>
                          </v-row>
                          <v-row class="my-4">
                            <v-text-field v-model="updateDialogForm.clusterDisplayName" label="集群昵称"></v-text-field>
                          </v-row>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn @click="isActive.value = false">取消</v-btn>
                          <v-btn @click="handleClusterUpdate" :loading="updateDialogLoading">确定</v-btn>
                        </v-card-actions>
                      </v-card>
                    </template>
                  </v-dialog>
                </v-list-item>
                <v-list-item title="删除集群" @click="">
                  <v-dialog activator="parent" max-width="40%">
                    <template #default="{isActive}">
                      <v-card>
                        <v-card-title>
                          请确认
                        </v-card-title>
                        <v-card-text>
                          <v-alert prominent variant="text" type="info" :color="colors.grey.darken1" class="mt-4">
                            是否执行 删除集群 操作？
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
    </v-tabs-window-item>
   <v-tabs-window-item value="port">
     <v-alert prominent density="compact" color="warning" class="mt-4">
       以下是集群的端口信息，需要在云服务器安全组开通以下所有UDP端口
     </v-alert>
     <v-alert v-if="uniquePortNum!==allPortNum" prominent density="compact" color="error" class="mt-1">
       发现端口冲突！！！请仔细检查
     </v-alert>
     <v-sheet border rounded class="mt-4">
       <v-data-table :items="clustersWorldPort" :headers="clustersWorldPortHeaders">
         <template #loading>
           <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
         </template>

         <template #item.clusterName="{item}">
           <v-chip label color="info">
             {{item.clusterName}}
           </v-chip>
         </template>
         <template #item.clusterDisplayName="{item}">
           <v-chip label color="success">
             {{item.clusterDisplayName}}
           </v-chip>
         </template>
         <template #item.port="{item}">
           <template v-if="item.worldPort" v-for="port in item.worldPort">
             <v-chip label :color="conflictPorts.includes(port)?'warning':'success'" class="mr-2">
               {{port}}
             </v-chip>
           </template>
           <template v-else>
             <v-chip label>无端口暴露</v-chip>
           </template>

         </template>
       </v-data-table>
     </v-sheet>
   </v-tabs-window-item>
  </v-tabs-window>
</template>

<script setup>
import settingApi from '@/api/setting'
import useGlobalStore from "@/plugins/pinia/global"
import {showSnackbar} from "@/utils/snackbar"
import colors from 'vuetify/lib/util/colors'
import {deepCopy} from "@/utils/tools";


onMounted(() => {
  getClustersInfo()
  getClustersWorldPort()
})

const globalStore = useGlobalStore()

const tab = ref('info')

const infoLoading = ref(false)
const portLoading = ref(false)
const loading = computed(() => {
  return infoLoading.value || portLoading.value
})


const clustersInfo = ref([])
const clusterInfoHeaders = ref([
  {title: '集群名', key: 'clusterName'},
  {title: '集群昵称', key: 'clusterDisplayName'},
  {title: '集群状态', key: 'status'},
  {title: '世界个数', key: 'worlds'},
  {title: '操作', key: 'actions'},
])
const getClustersInfo = () => {
  infoLoading.value = true
  settingApi.clusters.get().then(response => {
    clustersInfo.value = response.data
  }).finally(() => {
    infoLoading.value = false
  })
}

const clustersWorldPort = ref([])
const allPortNum = ref(0)
const uniquePortNum = ref(0)
const conflictPorts = ref([])
const clustersWorldPortHeaders = ref([
  {title: '集群名', key: 'clusterName'},
  {title: '集群昵称', key: 'clusterDisplayName'},
  {title: '端口', key: 'port'},
])

const getClustersWorldPort = () => {
  portLoading.value = true
  settingApi.clustersWorldPort.get().then(response => {
    clustersWorldPort.value = response.data
    let ports = []
    for (let cluster of clustersWorldPort.value) {
      if (cluster.worldPort === null) {
        continue
      }
      for (let port of cluster.worldPort) {
        ports.push(port)
      }
    }
    allPortNum.value = ports.length
    uniquePortNum.value = new Set(ports).size
    conflictPorts.value = ports.filter((item, index) => ports.indexOf(item) !== index)
  }).finally(() => {
    portLoading.value = false
  })
}

const getClusters = () => {
  settingApi.clusters.get().then(response => {
    globalStore.dstClusters = response.data
    if (globalStore.selectedDstCluster === null && globalStore.dstClusters !== null) {
      globalStore.selectedDstCluster = globalStore.dstClusters[0].clusterName
    }
  })
}

const updateDialogVisible = ref(false)
const updateDialogLoading = ref(false)
const updateDialogForm = ref({
  clusterName: '',
  clusterDisplayName: '',
})

const handleOpenClusterUpdateDialog = (row) => {
  updateDialogForm.value = {
    clusterName: row.clusterName,
    clusterDisplayName: row.clusterDisplayName,
  }
}

const updateClusterVisible = ref(false)
const handleClusterUpdate = (isActive) => {
  if (updateDialogForm.value === '') {
    showSnackbar('请输入集群昵称', 'error')
    return
  }
  updateDialogLoading.value = true
  settingApi.cluster.put(updateDialogForm.value).then(response => {
    settingApi.clusters.get().then(x => {
      clustersInfo.value = x.data
      globalStore.dstClusters = x.data
    })
    showSnackbar(response.message)
    updateDialogVisible.value = false
    updateClusterVisible.value = false
  }).finally(() => {
    updateDialogLoading.value = false
  })

}

const handleClusterDelete = (row) => {
  const clusterName = row.clusterName
  const reqForm = {
    clusterName: clusterName
  }
  settingApi.cluster.delete(reqForm).then(async response => {
    showSnackbar(response.message)
    await getClustersInfo()
    await getClustersWorldPort()
    await getClusters()
    if (globalStore.selectedDstCluster === clusterName && globalStore.dstClusters !== null) {
      globalStore.selectedDstCluster = globalStore.dstClusters[0].clusterName
    }
  }).catch(() => {
  }).finally(() => {

  })
}

const handleClusterActivate = (row) => {
  confirmBoxButtonLoading.value = true
  const clusterName = row.clusterName
  const reqForm = {
    clusterName: clusterName,
    status: true,
  }
  settingApi.cluster.status.put(reqForm).then(async response => {
    showSnackbar(response.message)
    await getClustersInfo()
    await getClustersWorldPort()
    await getClusters()
  }).catch(() => {
  }).finally(() => {
    confirmBoxButtonLoading.value = false
  })
}

const handleClusterDeactivate = (row) => {
  const clusterName = row.clusterName
  const reqForm = {
    clusterName: clusterName,
    status: false,
  }
  settingApi.cluster.status.put(reqForm).then(async response => {
    showSnackbar(response.message)
    await getClustersInfo()
    await getClustersWorldPort()
    await getClusters()
  }).catch(() => {
  }).finally(() => {

  })
}

const confirmBoxButtonLoading = ref(false)
const handleCommand = (cmd) => {
  switch (cmd.type) {
    case 'activate':
      handleClusterActivate(cmd)
      break;
    case 'deactivate':
      handleClusterDeactivate(cmd)
      break;
    case 'update':
      handleOpenClusterUpdateDialog(cmd)
      break;
    case 'delete':
      handleClusterDelete(cmd)
      break;
  }
}

</script>

<style scoped>
</style>