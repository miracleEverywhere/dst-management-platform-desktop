<template>
  <v-tabs v-model="activeTab" align-tabs="start"
          class="v-tabs-pill" color="primary" show-arrows @update:modelValue="handleTabClick">
    <v-tab value="players">玩家列表</v-tab>
    <v-tab value="adminList">管理员</v-tab>
    <v-tab value="blockList">黑名单</v-tab>
    <v-tab value="whiteList">白名单</v-tab>
    <v-tab value="history">历史玩家</v-tab>
  </v-tabs>

  <v-tabs-window v-model="activeTab">
    <v-tabs-window-item value="players">
      <v-card class="mt-4" height="800">
        <v-card-title>
          <div class="card-header">
            <span>玩家列表</span>
            <v-btn @click="getPlayerList(true)">刷新</v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <template v-if="playersData">
            <v-container height="700" style="overflow-y: auto">
              <v-data-table
                :headers="playerTableHeaders"
                :items="playersData"
                :items-per-page="10"
                :loading="playerListLoading"
                :page.sync="playerListPage"
                :server-items-length="playerListRows"
                class="mt-4"
              >
                <template v-slot:loading>
                  <v-skeleton-loader type="table-row@12"></v-skeleton-loader>
                </template>
                <template v-slot:item.prefab="{item}">
                  <v-chip v-if="item.prefab" color="info" label>
                    {{ item.prefab }}
                  </v-chip>
                  <v-chip v-else color="warning" label>
                    获取失败
                  </v-chip>
                </template>
                <template v-slot:item.age="{item}">
                  <v-chip v-if="item.age" color="info" label>
                    <v-icon icon="ri-calendar-2-line" start/>
                    {{ item.age }}
                  </v-chip>
                  <v-chip v-else color="warning" label>
                    <v-icon icon="ri-calendar-2-line" start/>
                    获取失败
                  </v-chip>
                </template>
                <template v-slot:item.actions="{item}">
                  <v-menu open-on-hover>
                    <template v-slot:activator="{ props }">
                      <v-btn append-icon="ri-arrow-down-s-line" color="xx" v-bind="props" variant="text">
                        操作
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item :disabled="adminDisable(item.uid)" title="添加管理员" @click="handleAddAdmin(item.uid)"/>
                      <v-list-item :disabled="blockDisable(item.uid)" title="添加黑名单" @click="handleAddBlock(item.uid)"/>
                      <v-list-item :disabled="whiteDisable(item.uid)" title="添加白名单" @click="handleAddWhite(item.uid)"/>
                      <v-divider/>
                      <v-list-item :disabled="adminDisable(item.uid)" title="踢出玩家" @click="handleKick(item.uid)"/>
                    </v-list>
                  </v-menu>
                </template>
              </v-data-table>
            </v-container>
          </template>
          <template v-else>
            <div class="d-flex flex-column align-center justify-center" style="height: 600px">
              <v-icon color="warning" icon="ri-error-warning-fill" size="128"/>
              <div class="mt-8" style="font-size: 1.6rem; font-weight: 300; line-height: 1; letter-spacing: -0.015625em">
                没有发现玩家
              </div>
            </div>
          </template>
        </v-card-text>
      </v-card>
    </v-tabs-window-item>
    <v-tabs-window-item value="adminList">
      <v-card class="mt-4" height="800">
        <v-card-title>
          <div class="card-header">
            <span>管理员</span>
            <v-btn @click="getPlayerList(true)">刷新</v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <v-container height="700" style="overflow-y: auto">
            <v-row v-if="adminListData.length > 0">
              <v-col class="mt-4" cols="12">
                <v-alert color="success" density="compact">提示：点击玩家UID后的 "×" 即可删除</v-alert>
              </v-col>
                <v-chip v-for="uid in adminListData" closable color="info" class="mt-2 mr-2"
                        size="large" @click:close="handleDeleteAdmin(uid)">
                  {{ uid + getNickname(uid) }}
                </v-chip>
            </v-row>
            <div v-else class="d-flex flex-column align-center justify-center" style="height: 600px">
              <v-icon color="warning" icon="ri-error-warning-fill" size="128"/>
              <div class="mt-8" style="font-size: 1.6rem; font-weight: 300; line-height: 1; letter-spacing: -0.015625em">
                没有发现管理员
              </div>
            </div>
          </v-container>
        </v-card-text>
      </v-card>
    </v-tabs-window-item>
    <v-tabs-window-item value="blockList">
      <v-card class="mt-4" height="800">
        <v-card-title>
          <div class="card-header">
            <span>黑名单</span>
            <div>
              <v-dialog v-model="blockListUploadVisible" class="flex-wrap" max-width="500">
                <template v-slot:activator="{ props: activatorProps }">
                  <v-btn class="mr-2" color="success" v-bind="activatorProps">导入</v-btn>
                </template>
                <template v-slot:default="{ isActive }">
                  <v-card title="导入黑名单">
                    <v-card-text>
                      <v-file-upload density="default" icon="ri-upload-cloud-2-line"
                                     @update:modelValue="handleUpload">
                      </v-file-upload>
                    </v-card-text>
                  </v-card>
                </template>
              </v-dialog>
              <v-btn @click="getPlayerList(true)">刷新</v-btn>
            </div>
          </div>
        </v-card-title>
        <v-card-text>
          <v-container height="700" style="overflow-y: auto">
            <v-row v-if="blockListData.length > 0">
              <v-col class="mt-4" cols="12">
                <v-alert color="success" density="compact">提示：点击玩家UID后的 "×" 即可删除</v-alert>
              </v-col>
              <v-chip v-for="uid in blockListData" closable color="success" class="mt-2 mr-2"
                      size="large" @click:close="handleDeleteBlock(uid)">
                {{ uid + getNickname(uid) }}
              </v-chip>
            </v-row>
            <div v-else class="d-flex flex-column align-center justify-center" style="height: 600px">
              <v-icon color="warning" icon="ri-error-warning-fill" size="128"/>
              <div class="mt-8" style="font-size: 1.6rem; font-weight: 300; line-height: 1; letter-spacing: -0.015625em">
                没有发现黑名单
              </div>
            </div>
          </v-container>
        </v-card-text>
      </v-card>
    </v-tabs-window-item>
    <v-tabs-window-item value="whiteList">
      <v-card class="mt-4" height="800">
        <v-card-title>
          <div class="card-header">
            <span>白名单</span>
            <v-btn @click="getPlayerList(true)">刷新</v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <v-container height="700" style="overflow-y: auto">
            <v-row v-if="whiteListData.length > 0">
              <v-col class="mt-4" cols="12">
                <v-alert color="success" density="compact">提示：点击玩家UID后的 "×" 即可删除</v-alert>
              </v-col>
              <v-chip  v-for="uid in whiteListData" closable color="success" class="mt-2 mr-2"
                       size="large" @click:close="handleDeleteWhite(uid)">
                {{ uid + getNickname(uid) }}
              </v-chip>
            </v-row>
            <div v-else class="d-flex flex-column align-center justify-center" style="height: 600px">
              <v-icon color="warning" icon="ri-error-warning-fill" size="128"/>
              <div class="mt-8" style="font-size: 1.6rem; font-weight: 300; line-height: 1; letter-spacing: -0.015625em">
                没有发现白名单
              </div>
            </div>
          </v-container>
        </v-card-text>
      </v-card>
    </v-tabs-window-item>
    <v-tabs-window-item value="history">
      <v-card class="mt-4" height="800">
        <v-card-title>
          <div class="card-header">
            <span>
              历史玩家
              <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                指平台启动以来，记录到的所有玩家信息
              </v-tooltip>
            </span>
            <v-btn @click="handleGetHistoryPlayer(true)">刷新</v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <v-container height="700" style="overflow-y: auto">
            <v-data-table
              :headers="historyTableHeaders"
              :items="uids"
              :items-per-page="10"
              :loading="historyListLoading"
              :page.sync="playerListPage"
              :server-items-length="playerListRows"
              class="mt-4"
            >
              <template v-slot:loading>
                <v-skeleton-loader type="table-row@12"></v-skeleton-loader>
              </template>

              <template v-slot:item.age="{item}">
                <v-chip v-if="item.age" color="info" label>
                  <v-icon icon="ri-calendar-2-line" start/>
                  {{ item.age }}
                </v-chip>
                <v-chip v-else color="warning" label>
                  <v-icon icon="ri-calendar-2-line" start/>
                  获取失败
                </v-chip>
              </template>
              <template v-slot:item.prefab="{item}">
                <v-chip v-if="item.prefab" color="info" label>
                  {{ item.prefab }}
                </v-chip>
                <v-chip v-else color="warning" label>
                  获取失败
                </v-chip>
              </template>
              <template v-slot:item.actions="{item}">
                <v-menu open-on-hover>
                  <template v-slot:activator="{ props }">
                    <v-btn append-icon="ri-arrow-down-s-line" color="xx" v-bind="props" variant="text">
                      操作
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item :disabled="adminDisable(item.uid)" title="添加管理员" @click="handleAddAdmin(item.uid)"/>
                    <v-list-item :disabled="blockDisable(item.uid)" title="添加黑名单" @click="handleAddBlock(item.uid)"/>
                    <v-list-item :disabled="whiteDisable(item.uid)" title="添加白名单" @click="handleAddWhite(item.uid)"/>
                    <v-divider/>
                    <v-list-item :disabled="adminDisable(item.uid)" title="踢出玩家" @click="handleKick(item.uid)"/>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </v-container>
        </v-card-text>
      </v-card>
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script setup>
import settingApi from "@/api/setting"
import {showSnackbar} from "@/utils/snackbar";

onMounted(() => {
  getPlayerList()
})


const playerListLoading = ref(false)
const playerListPage = ref(1)
const playerListRows = ref(0)
const getPlayerList = (tip = false) => {
  playerListLoading.value = true
  settingApi.player.list.get().then(response => {
    playersData.value = response.data.players
    uidMap.value = response.data.uidMap
    adminListData.value = []
    for (let i of response.data.adminList) {
      if (i !== '') {
        adminListData.value.push(i)
      }
    }
    blockListData.value = []
    for (let i of response.data.blockList) {
      if (i !== '') {
        blockListData.value.push(i)
      }
    }
    whiteListData.value = []
    for (let i of response.data.whiteList) {
      if (i !== '') {
        whiteListData.value.push(i)
      }
    }
    if (tip) {
      showSnackbar('刷新成功')
    }
  }).finally(() => {
    playerListLoading.value = false
  })
}

const activeTab = ref('players')

const playersData = ref([])
const uidMap = ref({})
const adminListData = ref([])
const blockListData = ref([])
const whiteListData = ref([])

const adminDisable = (uid) => {
  for (let i of adminListData.value) {
    if (i === uid) {
      return true
    }
  }
}

const blockDisable = (uid) => {
  for (let i of blockListData.value) {
    if (i === uid) {
      return true
    }
  }
}

const whiteDisable = (uid) => {
  for (let i of whiteListData.value) {
    if (i === uid) {
      return true
    }
  }
}

const handleCommand = (cmd) => {
  switch (cmd.type) {
    case 'admin':
      handleAddAdmin(cmd.uid)
      break;
    case 'block':
      handleAddBlock(cmd.uid)
      break;
    case 'white':
      handleAddWhite(cmd.uid)
      break;
    case 'kick':
      handleKick(cmd.uid)
      break;
  }
}

const handleAddAdmin = (uid) => {
  settingApi.player.addAdmin.post({uid: uid}).then(response => {
    showSnackbar(response.message)
    getPlayerList()
  })
}

const handleDeleteAdmin = (uid) => {
  settingApi.player.deleteAdmin.post({uid: uid}).then(response => {
    showSnackbar(response.message)
    getPlayerList()
  })
}

const handleAddBlock = (uid) => {
  settingApi.player.addBlock.post({uid: uid}).then(response => {
    showSnackbar(response.message)
    getPlayerList()
  })
}

const handleDeleteBlock = (uid) => {
  settingApi.player.deleteBlock.post({uid: uid}).then(response => {
    showSnackbar(response.message)
    getPlayerList()
  })
}

const handleAddWhite = (uid) => {
  settingApi.player.addWhite.post({uid: uid}).then(response => {
    showSnackbar(response.message)
    getPlayerList()
  })
}

const handleDeleteWhite = (uid) => {
  settingApi.player.deleteWhite.post({uid: uid}).then(response => {
    showSnackbar(response.message)
    getPlayerList()
  })
}

const handleKick = (uid) => {
  settingApi.player.kick.post({uid: uid}).then(response => {
    showSnackbar(response.message)
  })
}

const getNickname = (uid) => {
  if (uid in uidMap.value) {
    return ' [' + uidMap.value[uid] + ']'
  } else {
    return ' [暂未获取到]'
  }
}

const handleTabClick = async (tab) => {
  if (tab === "history") {
    await handleGetHistoryPlayer()
  }
}

const uids = ref([])
const historyListLoading = ref(false)
const handleGetHistoryPlayer = (tip = false) => {
  historyListLoading.value = true
  uids.value = []
  settingApi.player.history.get().then(response => {
    for (let i of response.data) {
      if (i.uid.length === 11) {
        uids.value.push(i)
      }
    }
    if (tip) {
      showSnackbar('刷新成功')
    }
  }).finally(() => {
    historyListLoading.value = false
  })
}

const blockListUploadVisible = ref(false)

const blockListFile = ref(null)

const checkUploadFile = (file) => {
  const zipPattern = /\.xls|xlsx$/i;
  return zipPattern.test(file.name);
}
const handleUpload = (file) => {
  if (!checkUploadFile(file)) {
    showSnackbar('请上传Excel文件', 'error')
    blockListUploadVisible.value = false
    return
  }
  console.log(file)
  uploadLoading.value = true
  const formData = new FormData()
  formData.append('file', file)
  settingApi.player.addBlockUpload.post(formData).then(response => {
    getPlayerList()
    showSnackbar(response.message)
  }).finally(() => {
    blockListUploadVisible.value = false
    uploadLoading.value = false
  })
}

const playerTableHeaders = ref([
  {title: "名字", value: "nickName"},
  {title: "角色", value: "prefab"},
  {title: "天数", value: "age"},
  {title: "UID", value: "uid"},
  {title: "操作", value: "actions"},
])
const historyTableHeaders = ref([
  {title: "名字", value: "nickname"},
  {title: "角色", value: "prefab"},
  {title: "天数", value: "age"},
  {title: "UID", value: "uid"},
  {title: "操作", value: "actions"},
])
</script>

<style scoped>
</style>