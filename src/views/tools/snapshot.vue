<template>
  <!-- 游戏是否安装 -->
  <template v-if="globalStore.gameVersion.local!==0">
    <!-- 房间是否选择 -->
    <template v-if="globalStore.room.id!==0">
      <v-expansion-panels>
        <v-expansion-panel>
          <template #title>
            <v-icon
              icon="ri-information-line"
              start
            />
            <span>
              {{ t('tools.snapshot.expansion.title') }}
            </span>
          </template>
          <template #text>
            <div class="mb-2">
              {{ t('tools.snapshot.expansion.text1') }}
            </div>
            <div class="mb-2">
              {{ t('tools.snapshot.expansion.text2') }}
            </div>
            <div class="mb-2">
              {{ t('tools.snapshot.expansion.text3') }}
            </div>
            <div class="mb-2 text-error">
              {{ t('tools.snapshot.expansion.text4') }}
            </div>
          </template>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-sheet
        border
        rounded
        class="mt-4"
      >
        <v-data-table
          v-model:sort-by="sortBy"
          :headers="headers"
          :items="files"
          :loading="getSnapshotLoading"
        >
          <template #loading>
            <v-skeleton-loader type="table-row@10" />
          </template>
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>
                <v-icon
                  icon="ri-flip-horizontal-line"
                  start
                />
                <span v-if="!mobile">{{ t('tools.snapshot.title') }}</span>
              </v-toolbar-title>
              <v-btn
                prepend-icon="ri-refresh-line"
                :loading="getSnapshotLoading"
                color="default"
                @click="getSnapshot"
              >
                {{ t('platform.user.table.refresh') }}
              </v-btn>
            </v-toolbar>
          </template>
          <template #item.name="{value}">
            <v-chip
              label
              color="info"
            >
              {{ value }}
            </v-chip>
          </template>
          <template #item.size="{value}">
            <v-chip
              label
              color="default"
            >
              {{ formatBytes(value) }}
            </v-chip>
          </template>
          <template #item.modTime="{value}">
            <v-chip
              label
              color="primary"
            >
              {{ isoTime2time(value) }}
            </v-chip>
          </template>
          <template #item.actions="{ item }">
            <v-btn
              variant="text"
              color="error"
              prepend-icon="ri-delete-bin-line"
              @click="deleteFilename = item.name; confirmVisible = true"
            >
              {{ t('tools.snapshot.table.delete') }}
            </v-btn>
          </template>
        </v-data-table>
      </v-sheet>
      <confirm-box
        v-model="confirmVisible"
        type="warning"
        :title="t('global.confirm.title')"
        :content="t('global.confirm.content')"
        :confirm-text="t('global.confirm.confirm')"
        :cancel-text="t('global.confirm.cancel')"
        :confirm-loading="confirmLoading"
        @confirm="handleDelete"
        @cancel="confirmVisible=false"
      />
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
import useUserStore from "@store/user.js"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import { debounce, formatBytes, isoTime2time } from "@/utils/tools.js"
import { showSnackbar } from "@/utils/snackbar.js"

const globalStore = useGlobalStore()
const userStore = useUserStore()
const { mobile } = useDisplay()
const { t } = useI18n()
const windowHeight = ref(window.innerHeight)

const files = ref([])
const getSnapshotLoading = ref(false)

const getSnapshot = () => {
  if (globalStore.room.id === 0) return

  getSnapshotLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
  }

  toolsApi.snapshot.get(reqForm).then(response => {
    files.value = response.data || []
  }).finally(() => {
    getSnapshotLoading.value = false
  })
}

const sortBy = ref([{ key: 'name', order: 'desc' }])

const headers = [
  { key: 'name', title: t('tools.snapshot.table.header.name') },
  { key: 'size', title: t('tools.snapshot.table.header.size') },
  { key: 'modTime', title: t('tools.snapshot.table.header.modTime') },
  { key: 'actions', title: t('tools.snapshot.table.header.actions') },
]

const confirmVisible = ref(false)
const confirmLoading = ref(false)
const deleteFilename = ref('')

const handleDelete = () => {
  confirmLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
    name: deleteFilename.value,
  }

  toolsApi.snapshot.delete(reqForm).then(response => {
    showSnackbar(response.message)
    confirmVisible.value = false
    getSnapshot()
  }).finally(() => {
    confirmLoading.value = false
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
  getSnapshot()
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

