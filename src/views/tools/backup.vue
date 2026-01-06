<template>
  <!-- 游戏是否安装 -->
  <template v-if="globalStore.gameVersion.local!==0">
    <!-- 房间是否选择 -->
    <template v-if="globalStore.room.id!==0">
      <v-sheet
        border
        rounded
      >
        <v-data-table
          v-model="selectedFiles"
          show-select
          return-object
          :headers="headers"
          :items="backupFiles"
          :loading="getBackupFilesLoading"
        >
          <template #loading>
            <v-skeleton-loader type="table-row@10" />
          </template>
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>
                <v-icon
                  icon="ri-save-2-line"
                  start
                />
                <span v-if="!mobile">{{ t('tools.backup.title') }}</span>
              </v-toolbar-title>
              <v-btn
                prepend-icon="ri-add-line"
                color="success"
                :loading="createBackupLoading"
                @click="createBackup"
              >
                {{ t('tools.backup.backup') }}
              </v-btn>
              <v-btn
                prepend-icon="ri-delete-bin-5-line"
                color="error"
                :disabled="selectedFiles.length===0"
                :loading="singleDeleteLoading"
                @click="multiDeleteBackup"
              >
                {{ t('tools.backup.multiDelete') }}
              </v-btn>
              <v-btn
                v-if="!mobile"
                prepend-icon="ri-refresh-line"
                :loading="getBackupFilesLoading"
                color="default"
                @click="getBackupFiles"
              >
                {{ t('platform.user.table.refresh') }}
              </v-btn>
            </v-toolbar>
          </template>
          <template #item.gameName="{ value }">
            <v-chip
              label
              color="primary"
            >
              {{ value }}
            </v-chip>
          </template>
          <template #item.cycles="{ value }">
            <v-chip
              label
              color="info"
            >
              {{ value }}
            </v-chip>
          </template>
          <template #item.size="{ value }">
            <v-chip
              label
              color="success"
            >
              {{ formatBytes(value) }}
            </v-chip>
          </template>
          <template #item.timestamp="{ value }">
            <v-chip
              label
              color="default"
            >
              {{ timestamp2time(value) }}
            </v-chip>
          </template>
          <template #item.actions="{ item }">
            <v-btn
              color="info"
              append-icon="ri-arrow-drop-down-line"
              variant="text"
              :loading="actionButtonLoading"
            >
              {{ t('tools.backup.actions') }}
              <v-menu activator="parent">
                <v-list>
                  <v-list-item
                    class="text-success"
                    @click="restore(item.fileName)"
                  >
                    <template #prepend>
                      <v-icon
                        icon="ri-device-recover-line"
                        size="22"
                      />
                    </template>
                    <v-list-item-title>
                      {{ t('tools.backup.restore') }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    class="text-info"
                    @click="downloadBackup(item.fileName)"
                  >
                    <template #prepend>
                      <v-icon
                        icon="ri-download-line"
                        size="22"
                      />
                    </template>
                    <v-list-item-title>
                      {{ t('tools.backup.download') }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    class="text-error"
                    @click="deleteBackup(item.fileName)"
                  >
                    <template #prepend>
                      <v-icon
                        icon="ri-delete-bin-line"
                        size="22"
                      />
                    </template>
                    <v-list-item-title>
                      {{ t('tools.backup.delete') }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-btn>
          </template>
        </v-data-table>
      </v-sheet>
    </template>
    <template v-else>
      <result
        :title="t('global.noRoomSelected.title')"
        :sub-title="t('global.noRoomSelected.subTitle')"
        type="error"
        :height="calculateContainerSize()"
      >
        <v-btn
          to="/rooms"
          class="mt-4"
        >
          {{ t('global.noRoomSelected.button') }}
        </v-btn>
      </result>
    </template>
  </template>
  <template v-else>
    <result
      v-if="userStore.userInfo.role==='admin'"
      :title="t('global.noGame.title')"
      :sub-title="t('global.noGame.subTitle')"
      :height="calculateContainerSize()"
      type="error"
    >
      <v-btn
        to="/install"
        class="mt-4"
      >
        {{ t('global.noGame.button') }}
      </v-btn>
    </result>
    <result
      v-else
      :title="t('global.noGameNoAdmin.title')"
      :sub-title="t('global.noGameNoAdmin.subTitle')"
      :height="calculateContainerSize()"
      type="error"
    />
  </template>
</template>

<script setup>
import toolsApi from "@/api/tools.js"
import useGlobalStore from "@store/global.js"
import { useI18n } from "vue-i18n"
import { debounce, formatBytes, timestamp2time } from "@/utils/tools.js"
import { showSnackbar } from "@/utils/snackbar.js"
import { useDisplay } from "vuetify/framework"
import useUserStore from "@store/user.js"


const globalStore = useGlobalStore()
const userStore = useUserStore()
const { t } = useI18n()
const { mobile } = useDisplay()
const windowHeight = ref(window.innerHeight)
const getBackupFilesLoading = ref(false)
const backupFiles = ref([])

const getBackupFiles = () => {
  if (globalStore.room.id === 0) return
  getBackupFilesLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
  }

  toolsApi.backup.get(reqForm).then(response => {
    backupFiles.value = response.data
    backupFiles.value.sort((a, b) => b.timestamp - a.timestamp)
  }).finally(() => {
    getBackupFilesLoading.value = false
  })
}

const selectedFiles = ref([])

const headers = [
  { key: 'gameName', title: t('tools.backup.gameName') },
  { key: 'cycles', title: t('tools.backup.cycles') },
  { key: 'size', title: t('tools.backup.size') },
  { key: 'timestamp', title: t('tools.backup.timestamp') },
  { key: 'actions', title: t('tools.backup.actions') },
]

const actionButtonLoading = ref(false)

const createBackupLoading = ref(false)

const createBackup = () => {
  createBackupLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
  }

  toolsApi.backup.post(reqForm).then(response => {
    getBackupFiles()
    showSnackbar(response.message)
  }).finally(() => {
    createBackupLoading.value = false
  })
}

const singleDeleteLoading = ref(false)

const deleteBackup = filename => {
  singleDeleteLoading.value = true
  actionButtonLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
    filenames: [filename],
  }

  toolsApi.backup.delete(reqForm).then(response => {
    getBackupFiles()
    showSnackbar(t('tools.backup.deleteMessage1')+response.data+t('tools.backup.deleteMessage2'))
  }).finally(() => {
    singleDeleteLoading.value = false
    actionButtonLoading.value = false
  })
}

const multiDeleteBackup = () => {
  singleDeleteLoading.value = true
  actionButtonLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
    filenames: selectedFiles.value.map(item => item.fileName),
  }

  toolsApi.backup.delete(reqForm).then(response => {
    getBackupFiles()
    selectedFiles.value = []
    showSnackbar(t('tools.backup.deleteMessage1')+response.data+t('tools.backup.deleteMessage2'))
  }).finally(() => {
    singleDeleteLoading.value = false
    actionButtonLoading.value = false
  })
}

const restoreLoading = ref(false)

const restore = filename => {
  actionButtonLoading.value = true
  restoreLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
    filename: filename,
  }

  toolsApi.backup.restore.post(reqForm).then(response => {
    showSnackbar(response.message)
  }).finally(() => {
    restoreLoading.value = false
    actionButtonLoading.value = false
  })
}

const downloadBackup = filename => {
  actionButtonLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
    filename: filename,
  }

  toolsApi.backup.download.download(reqForm, "dmp_backup.zip").finally(() => {
    actionButtonLoading.value = false
  })
}

const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
}, 200)

const calculateContainerSize = () => {
  // 64(navbar) + 37(tab header) + 20(card padding) + 16(card padding) = 137
  const other = 150

  return Math.max(2, Math.floor(windowHeight.value - other))
}

onMounted(() => {
  getBackupFiles()
})
</script>

