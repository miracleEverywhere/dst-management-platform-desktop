<template>
  <v-card height="870">
    <v-card-title>
      <div class="card-header">
        <span>存档导入</span>
        <div>
          <v-dialog v-model="uploadDialogVisible" :persistent="uploadLoading" class="flex-wrap" max-width="65%">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn class="mr-2" color="primary" v-bind="activatorProps">上传存档</v-btn>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card title="导入存档" min-height="500">
                <v-card-text>
                  <template v-if="!uploadLoading">
                    <v-alert color="warning" density="compact" class="mt-2 mb-2">
                      请上传.zip文件，请严格按照教程中的路径进行压缩，上传过程中请勿关闭本对话框
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
          <v-dialog v-model="helpDialogVisible" class="flex-wrap" max-width="75%">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn class="mr-2" color="success" v-bind="activatorProps">查看教程</v-btn>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card title="压缩教程">
                <v-card-text>
                  <v-alert color="error" density="compact" class="mt-2 mb-2">
                    注意！注意！！注意！！！请仔细查看导入页面文件树，加粗为必须，缺少
                    <v-icon icon="ri-pushpin-fill" color="xx"></v-icon>
                    的文件会导致导入失败
                  </v-alert>
                  <v-tabs v-model="activeTabName" align-tabs="start"
                          class="v-tabs-pill" color="primary" show-arrows>
                    <v-tab value="win">Windows</v-tab>
                    <v-tab value="mac">MacOS</v-tab>
                  </v-tabs>

                  <v-tabs-window v-model="activeTabName">
                    <v-tabs-window-item value="win">
                      <div class="mt-4 fcc" style="height: 500px">
                        <video controls width="80%">
                          <source src="./components/importVideos/win_import.mp4"
                                  type="video/mp4"/>
                        </video>
                      </div>
                    </v-tabs-window-item>
                    <v-tabs-window-item value="mac">
                      <div class="mt-4 fcc" style="height: 500px">
                        <video controls width="80%">
                          <source src="./components/importVideos/mac_import.mp4"
                                  type="video/mp4"/>
                        </video>
                      </div>
                    </v-tabs-window-item>
                  </v-tabs-window>
                </v-card-text>
              </v-card>
            </template>
          </v-dialog>
        </div>
      </div>
    </v-card-title>
    <v-card-text>
      <v-container height="700" style="overflow-y: auto">
        <v-alert color="info" density="compact" class="mt-2">
          上传过程中会自动备份存档，上传完成后请手动启动服务器
        </v-alert>
        <v-alert color="warning" density="compact" class="mt-2">
          请上传压缩文件(例如：my_cluster.zip)，压缩文件的内容如下，<v-icon icon="ri-pushpin-fill" color="error"></v-icon>文件为必须，会自动进行检测，如缺失会导致导入失败
        </v-alert>
        <v-treeview
          v-model:opened="open"
          :items="items"
          item-value="id"
          variant="flat"
          density="compact"
          activatable
          open-on-click
          no-filter
        >
          <template v-slot:prepend="{ item, isOpen }">
            <v-icon v-if="!item.file" :icon="isOpen ? 'ri-folder-open-fill' : 'ri-folder-fill'"></v-icon>
            <v-icon v-else :icon="files[item.file]"></v-icon>
          </template>

          <template #append="{ item }">
            <v-icon v-if="item.required" icon="ri-pushpin-fill" color="error"></v-icon>
          </template>
        </v-treeview>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script setup>
import settingApi from "@/api/setting"
import {showSnackbar} from "@/utils/snackbar";
import useGlobalStore from "@/plugins/pinia/global"


const globalStore = useGlobalStore()

const helpDialogVisible = ref(false)

const uploadLoading = ref(false)
const uploadDialogVisible = ref(false)
const uploadRef = ref()
const checkUploadFile = (param) => {
  const zipPattern = /\.zip$/i;
  return zipPattern.test(param.name);
}
const handleUpload = (file) => {
  if (!checkUploadFile(file)) {
    showSnackbar('请上传zip文件', 'error')
    uploadDialogVisible.value = false
    return
  }
  uploadLoading.value = true
  const formData = new FormData()
  formData.append('file', file)
  formData.append('clusterName', globalStore.selectedDstCluster)
  settingApi.import.upload.post(formData).then(response => {
    getClusters()
    showSnackbar(response.message)
  }).finally(() => {
    uploadDialogVisible.value = false
    uploadLoading.value = false
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

const activeTabName = ref('win')

const open = shallowRef(['public'])
const files = shallowRef({
  ini: 'ri-file-settings-line',
  lua: 'ri-file-code-line',
  txt: 'ri-file-text-line',
})

const items = [
  {
    id: 1,
    title: '压缩文件名xxx.zip',
    subtitle: '点击打开我',
    children: [
      {
        id: 2,
        title: 'adminlist.txt',
        file: 'txt',
      },
      {
        id: 3,
        title: 'blocklist.txt',
        file: 'txt',
      },
      {
        id: 4,
        title: 'Caves',
        children: [
          {
            id: 5,
            title: 'backup',
          },
          {
            id: 6,
            title: 'leveldataoverride.lua',
            file: 'lua',
          },
          {
            id: 7,
            title: 'modoverrides.lua',
            file: 'lua',
          },
          {
            id: 8,
            title: 'save',
          },
          {
            id: 9,
            title: 'server_chat_log.txt',
            file: 'txt',
          },
          {
            id: 10,
            title: 'server.ini',
            file: 'ini',
          },
          {
            id: 11,
            title: 'server_log.txt',
            file: 'txt',
          },
        ]
      },
      {
        id: 12,
        title: 'cluster.ini',
        file: 'ini',
        required: true
      },
      {
        id: 13,
        title: 'cluster_token.txt',
        file: 'txt',
        required: true
      },
      {
        id: 14,
        title: 'Master',
        children: [
          {
            id: 15,
            title: 'backup',
          },
          {
            id: 16,
            title: 'leveldataoverride.lua',
            file: 'lua',
            required: true
          },
          {
            id: 17,
            title: 'modoverrides.lua',
            file: 'lua',
          },
          {
            id: 18,
            title: 'save',
          },
          {
            id: 19,
            title: 'server_chat_log.txt',
            file: 'txt',
          },
          {
            id: 20,
            title: 'server.ini',
            file: 'ini',
            required: true
          },
          {
            id: 21,
            title: 'server_log.txt',
            file: 'txt',
          },
        ],
        required: true
      },
      {
        id: 22,
        title: 'whitelist.txt',
        file: 'txt',
      },
    ]
  }
]
</script>

<style scoped>
.tree-tab {
  margin-left: 1.5px
}

.bolder {
  font-weight: bolder
}
</style>