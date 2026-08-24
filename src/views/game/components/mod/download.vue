<template>
  <div ref="downloadPageRef">
    <template v-if="mobile">
      <v-row class="ma-1">
        <v-select
          v-model="modSearchForm.searchType"
          :items="searchTypeMap"
          density="compact"
        />
      </v-row>
      <v-row class="mx-1">
        <v-text-field
          v-model="modSearchForm.searchText"
          :label="modSearchForm.searchType==='text'?t('game.mod.download.searchPlaceholderName'):t('game.mod.download.searchPlaceholderID')"
          clearable
          density="compact"
          @keyup.enter="handleModSearch"
        >
          <template #append>
            <v-btn
              size="small"
              @click="handleModSearch"
            >
              {{ t('game.mod.download.searchButton') }}
            </v-btn>
          </template>
        </v-text-field>
      </v-row>
    </template>
    <template v-else>
      <v-text-field
        v-model="modSearchForm.searchText"
        :label="modSearchForm.searchType==='text'?t('game.mod.download.searchPlaceholderName'):t('game.mod.download.searchPlaceholderID')"
        clearable
        class="my-2"
        @keyup.enter="handleModSearch"
      >
        <template #prepend>
          <v-select
            v-model="modSearchForm.searchType"
            :items="searchTypeMap"
          />
        </template>
        <template #append>
          <v-btn
            size="large"
            @click="handleModSearch"
          >
            {{ t('game.mod.download.searchButton') }}
          </v-btn>
        </template>
      </v-text-field>
    </template>
    <template v-if="modSearchLoading || downloadedModIdsLoading">
      <v-skeleton-loader
        type="table-row@20"
        class="my-8"
      />
    </template>
    <template v-else>
      <div class="item-container my-8">
        <template
          v-for="mod in modSearchData.rows"
          :key="mod.id"
        >
          <mod-info
            :mod="mod"
            :room-i-d="globalStore.room.id"
            :downloaded="downloadedModIds.has(Number(mod.id))"
            :download-progress="downloadProgress.get(Number(mod.id)) || 0"
            @download="handleDownload"
          />
        </template>
      </div>
      <div class="d-flex justify-end mt-4">
        <span class="align-content-center mr-2">
          {{ t('game.mod.download.total') }} {{ modSearchData.total }}
        </span>
        <v-pagination
          v-model="modSearchForm.page"
          variant="text"
          :length="Math.ceil(modSearchData.total/modSearchForm.pageSize)"
          :total-visible="7"
          @update:model-value="handleModSearch(false)"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import ModInfo from "@/views/game/components/mod/modInfo.vue"
import modApi from "@/api/mod"
import { showSnackbar } from "@/utils/snackbar"
import useGlobalStore from "@store/global.js"
import { useI18n } from "vue-i18n"
import { useDisplay } from "vuetify/framework"


const globalStore = useGlobalStore()
const { t } = useI18n()
const { mobile } = useDisplay()

const searchTypeMap = ref([
  { title: t('game.mod.download.searchName'), value: 'text' },
  { title: 'ID', value: 'id' },
])

const modSearchLoading = ref(false)
const downloadedModIdsLoading = ref(false)
const downloadedModIds = ref(new Set())
const downloadProgress = reactive(new Map())
const progressPollingTimer = ref(null)
const progressPollingInFlight = ref(false)

const getDownloadedModIds = () => {
  const reqForm = {
    roomID: globalStore.room.id,
  }

  downloadedModIdsLoading.value = true
  modApi.downloadedIds.get(reqForm).then(response => {
    downloadedModIds.value = new Set((response.data || []).map(Number))
  }).finally(() => {
    downloadedModIdsLoading.value = false
  })
}

const markModDownloaded = modId => {
  downloadedModIds.value = new Set(downloadedModIds.value).add(Number(modId))
}

const activeDownloadIds = () => {
  return [...downloadProgress.entries()]
    .filter(([, progress]) => progress > 0 && progress < 100)
    .map(([modId]) => modId)
}

const stopProgressPolling = () => {
  if (progressPollingTimer.value) {
    clearInterval(progressPollingTimer.value)
    progressPollingTimer.value = null
  }
}

const updateDownloadProgress = async modId => {
  try {
    const response = await modApi.download.status.get({
      roomID: globalStore.room.id,
      id: modId,
    })

    const progress = Math.min(100, Math.max(0, Number(response.data) || 0))
    const currentProgress = downloadProgress.get(modId) || 0

    // 新启动的任务在首次状态更新前可能返回 0，保留本地启动状态，避免按钮重复提交。
    if (progress > 0 || currentProgress === 0) {
      downloadProgress.set(modId, progress)
    }

    if (progress >= 100) {
      markModDownloaded(modId)
      downloadProgress.delete(modId)
    }
  } catch {
    // 共享 Axios 拦截器已经显示请求错误。
  }
}

const pollDownloadProgress = async () => {
  if (progressPollingInFlight.value) return

  const modIds = activeDownloadIds()
  if (modIds.length === 0) {
    stopProgressPolling()

    return
  }

  progressPollingInFlight.value = true

  try {
    await Promise.all(modIds.map(updateDownloadProgress))
  } finally {
    progressPollingInFlight.value = false
    if (activeDownloadIds().length === 0) {
      stopProgressPolling()
    }
  }
}

const ensureProgressPolling = () => {
  if (progressPollingTimer.value || activeDownloadIds().length === 0) return

  progressPollingTimer.value = setInterval(pollDownloadProgress, 1000)
  pollDownloadProgress()
}

const syncPageDownloadProgress = async mods => {
  await Promise.all(mods.map(async mod => {
    const modId = Number(mod.id)

    // 已下载模组没有需要恢复的活动进度，除非当前页面仍在轮询该任务。
    if (downloadedModIds.value.has(modId) && !downloadProgress.has(modId)) return

    await updateDownloadProgress(modId)
  }))
  ensureProgressPolling()
}

const handleDownload = async mod => {
  const modId = Number(mod.id)
  if (downloadProgress.get(modId) > 0 && downloadProgress.get(modId) < 100) return

  downloadProgress.set(modId, 1)

  const reqForm = {
    roomID: globalStore.room.id,
    id: mod.id,
    // eslint-disable-next-line camelcase
    file_url: mod.file_url,
    update: false,
    size: mod.size,
    name: mod.name,
  }

  try {
    const response = await modApi.download.post(reqForm)

    showSnackbar(response.message)
    ensureProgressPolling()
  } catch {
    downloadProgress.delete(modId)
  }
}

const modSearchData = ref({
  total: 0,
  rows: [],
})

const modSearchFormRef = ref()
const downloadPageRef = ref()

const modSearchForm = ref({
  page: 1,
  pageSize: 36,
  searchText: "",
  searchType: "text",
})

const handleModSearch = async (resetPage = true) => {
  if (resetPage) {
    modSearchForm.value.page = 1
  }
  modSearchLoading.value = true

  try {
    const response = await modApi.search.get(modSearchForm.value)

    modSearchData.value.rows = response.data.rows
    modSearchData.value.total = response.data.total
    syncPageDownloadProgress(response.data.rows)
    if (modSearchForm.value.searchType === "id") {
      showSnackbar('ID搜索不显示评分', 'info')
    }
  } finally {
    modSearchLoading.value = false
  }

  if (!resetPage) {
    await nextTick()
    downloadPageRef.value?.parentElement?.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
}



onMounted(() => {
  getDownloadedModIds()
  handleModSearch()
})

onUnmounted(() => {
  stopProgressPolling()
})
</script>

<style scoped>
.item-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}
</style>
