<template>
  <v-tabs v-model="activeTab" @update:modelValue="handleTabClick"
          align-tabs="start" color="primary" show-arrows class="v-tabs-pill">
    <v-tab value="players">玩家列表</v-tab>
    <v-tab value="adminList">管理员</v-tab>
    <v-tab value="blockList">黑名单</v-tab>
    <v-tab value="whiteList">白名单</v-tab>
    <v-tab value="history">历史玩家</v-tab>
  </v-tabs>

  <v-tabs-window v-model="activeTab">
    <v-tabs-window-item value="players">
      <v-card height="800" class="mt-4">
        <v-card-title>
          <div class="card-header">
            <span>玩家列表</span>
            <v-btn @click="getPlayerList(true)">刷新</v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <template v-if="playersData">

          </template>
          <template v-else>
            <div class="d-flex flex-column align-center justify-center" style="height: 600px">
              <v-icon color="warning" size="128" icon="ri-error-warning-fill"/>
              <div class="mt-8" style="font-size: 1.6rem; font-weight: 300; line-height: 1; letter-spacing: -0.015625em">
                没有发现玩家
              </div>
            </div>
          </template>
        </v-card-text>
      </v-card>
    </v-tabs-window-item>
    <v-tabs-window-item value="adminList">
      adminList
    </v-tabs-window-item>
    <v-tabs-window-item value="blockList">
      blockList
    </v-tabs-window-item>
    <v-tabs-window-item value="whiteList">
      whiteList
    </v-tabs-window-item>
    <v-tabs-window-item value="history">
      history
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script setup>
import settingApi from "@/api/setting"
import {showSnackbar} from "@/utils/snackbar";

onMounted(() => {
  getPlayerList()
})

const getPlayerList = (tip = false) => {
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
    koiMsgSuccess(response.message)
    getPlayerList()
  })
}

const handleDeleteAdmin = (uid) => {
  settingApi.player.deleteAdmin.post({uid: uid}).then(response => {
    koiMsgSuccess(response.message)
    getPlayerList()
  })
}

const handleAddBlock = (uid) => {
  settingApi.player.addBlock.post({uid: uid}).then(response => {
    koiMsgSuccess(response.message)
    getPlayerList()
  })
}

const handleDeleteBlock = (uid) => {
  settingApi.player.deleteBlock.post({uid: uid}).then(response => {
    koiMsgSuccess(response.message)
    getPlayerList()
  })
}

const handleAddWhite = (uid) => {
  settingApi.player.addWhite.post({uid: uid}).then(response => {
    koiMsgSuccess(response.message)
    getPlayerList()
  })
}

const handleDeleteWhite = (uid) => {
  settingApi.player.deleteWhite.post({uid: uid}).then(response => {
    koiMsgSuccess(response.message)
    getPlayerList()
  })
}

const handleKick = (uid) => {
  settingApi.player.kick.post({uid: uid}).then(response => {
    koiMsgSuccess(response.message)
  })
}

const getNickname = (uid) => {
  if (uid in uidMap.value) {
    return ' [' + uidMap.value[uid] + ']'
  } else {
    if (language.value === 'zh') {
      return ' [暂未获取到]'
    } else {
      return ' [Not yet obtained]'
    }
  }
}

const handleTabClick = (tab) => {
  if (tab === "history") {
    handleGetHistoryPlayer()
  }
}

const uids = ref([])
const tableLoading = ref(false)
const handleGetHistoryPlayer = (tip = false) => {
  tableLoading.value = true
  uids.value = []
  settingApi.player.history.get().then(response => {
    for (let i of response.data) {
      if (i.uid.length === 11) {
        uids.value.push(i)
      }
    }
    if (tip) {
      let message
      if (language.value === 'zh') {
        message = '刷新成功'
      } else {
        message = 'Refresh Success'
      }
      koiMsgSuccess(message)
    }
  }).finally(() => {
    tableLoading.value = false
  })
}

const uploadRef = ref()
const blockListUploadVisible = ref(false)
const uploadLoading = ref(false)
const openBlockListDialog = () => {
  if (uploadRef.value) {
    // 清空上次上传的文件
    uploadRef.value.clearFiles()
  }
  blockListUploadVisible.value = true
  uploadLoading.value = false
}
const checkUploadFile = (param) => {
  const zipPattern = /\.xls|xlsx$/i;
  if (zipPattern.test(param.name)) {
    return true
  } else {
    koiMsgError(language.value === 'zh' ? '请上传Excel文件' : 'Please upload a Excel file')
    return false
  }
}
const handleUpload = (param) => {
  uploadLoading.value = true
  const formData = new FormData()
  formData.append('file', param.file)
  settingApi.player.addBlockUpload.post(formData).then(response => {
    getPlayerList()
    koiMsgSuccess(response.message)
  }).finally(() => {
    blockListUploadVisible.value = false
    uploadLoading.value = false
  })
}
</script>

<style scoped>
</style>