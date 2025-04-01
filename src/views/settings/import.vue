<template>
  <v-card height="800">
    <v-card-title>
      <div class="card-header">
        <span>存档导入</span>
        <div>
          <v-dialog v-model="uploadDialogVisible" class="flex-wrap" max-width="65%">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn class="mr-2" color="primary" v-bind="activatorProps">导入存档</v-btn>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card title="导入存档">
                <v-card-text>
                  <v-alert color="warning" density="compact" class="mt-2 mb-2">
                    请上传.zip文件，请严格按照教程中的路径进行压缩，上传过程中请勿关闭本对话框
                  </v-alert>
                  <v-file-upload density="default" icon="ri-upload-cloud-2-line"
                                 @update:modelValue="handleUpload">
                  </v-file-upload>
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
                    注意！注意！！注意！！！请仔细查看导入页面文件树，加粗为必须，缺少加粗的文件会导致导入失败
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
      <v-alert color="success" density="compact" class="mt-2">
        上传过程中会自动备份存档，上传完成后请手动启动服务器
      </v-alert>
      <div class="tip_info">
        <div>
              <span class="bolder">
                请上传压缩文件(例如：my_cluster.zip)，压缩文件的内容如下，加粗文件为必须，会自动进行检测，如缺失会导致导入失败
              </span>
        </div>
        <div>.</div>
        <div>├── adminlist.txt</div>
        <div>├── blocklist.txt</div>
        <div>├── Caves</div>
        <div><span class="tree-tab">│</span>   ├── backup</div>
        <div><span class="tree-tab">│</span>   ├── leveldataoverride.lua</div>
        <div><span class="tree-tab">│</span>   ├── modoverrides.lua</div>
        <div><span class="tree-tab">│</span>   ├── save</div>
        <div><span class="tree-tab">│</span>   ├── server_chat_log.txt</div>
        <div><span class="tree-tab">│</span>   ├── server.ini</div>
        <div><span class="tree-tab">│</span>   └── server_log.txt</div>
        <div>
          <span class="bolder">├── cluster.ini</span>
        </div>
        <div>
          <span class="bolder">├── cluster_token.txt</span>
        </div>
        <div class="bolder">├── Master</div>
        <div><span class="tree-tab">│</span>   ├── backup</div>
        <div class="bolder"><span class="tree-tab">│</span>   ├── leveldataoverride.lua</div>
        <div class="bolder"><span class="tree-tab">│</span>   ├── modoverrides.lua</div>
        <div><span class="tree-tab">│</span>   ├── save</div>
        <div><span class="tree-tab">│</span>   ├── server_chat_log.txt</div>
        <div class="bolder"><span class="tree-tab">│</span>   ├── server.ini</div>
        <div><span class="tree-tab">│</span>   └── server_log.txt</div>
        <div>└── whitelist.txt</div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import settingApi from "@/api/setting"
import {showSnackbar} from "@/utils/snackbar";


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
    showSnackbar('请上传Excel文件', 'error')
    uploadDialogVisible.value = false
    return
  }

  const formData = new FormData()
  formData.append('file', file)
  settingApi.import.upload.post(formData).then(response => {
    showSnackbar(response.message)
  }).finally(() => {
    uploadDialogVisible.value = false
  })
}

const activeTabName = ref('win')
</script>

<style scoped>
</style>