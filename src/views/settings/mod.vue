<template>
  <v-tabs v-model="activeTabName" align-tabs="start"
          class="v-tabs-pill" color="primary" show-arrows @update:modelValue="handleTabClick">
    <v-tab value="Download">下载模组</v-tab>
    <v-tab value="Add">添加模组</v-tab>
    <v-tab value="Setting">配置模组</v-tab>
  </v-tabs>

  <v-tabs-window v-model="activeTabName">
    <v-tabs-window-item value="Download">
      <v-card class="mt-4" height="800">
        <v-card-text>
          <div>
            <v-text-field v-model="modSearchForm.searchText" density="compact"
                          :label="modSearchForm.searchType==='text'?'请输入要搜索的模组名称':'请输入要搜索的模组ID'"
                          variant="outlined" clearable>
              <template #prepend>
                <v-select v-model="modSearchForm.searchType" density="compact" :items="searchTypeMap"
                          variant="outlined">
                </v-select>
              </template>
              <template #append>
                <v-btn @click="handleModSearch">搜索</v-btn>
              </template>
            </v-text-field>
          </div>

          <v-container height="700" class="mt-4" style="overflow-y: auto">
            <template v-if="modSearchLoading">
              <v-skeleton-loader type="table-row@15"></v-skeleton-loader>
            </template>
            <template v-else>
              <div class="item-container">
                <template v-for="mod in modSearchData.rows">
                  <mod-info :mod="mod"/>
                </template>
              </div>
              <div class="d-flex justify-end mt-4">
                <v-pagination
                  v-model="modSearchForm.page"
                  :length="Math.ceil(modSearchData.total/modSearchForm.pageSize)"
                  :total-visible="7"
                  @first="handleModSearch(false)"
                  @last="handleModSearch(false)"
                  @next="handleModSearch(false)"
                  @prev="handleModSearch(false)"
                  @update:modelValue="handleModSearch(false)"
                ></v-pagination>
              </div>
            </template>
          </v-container>
        </v-card-text>
      </v-card>
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script setup>
import settingsApi from "@/api/setting"
import externalApi from "@/api/externalApi"
import toolsApi from "@/api/tools"
import modInfo from "./components/modInfo.vue"
import {formatBytes} from "@/utils/tools.js";
import {showSnackbar} from "@/utils/snackbar";


onMounted(async () => {
  await handleModSearch()
  await handleGetModSetting()
  handleGetOSPlatform()
})

const searchTypeMap = ref([
  {title: '名称', value: 'text'},
  {title: 'ID', value: 'id'},
])

const activeTabName = ref('Download')
const handleTabClick = (tab) => {
  if (tab === "Add") {
    handleGetDownloadedMod()
  }
  if (tab=== "Setting") {
    handleGetModSetting()
  }
}

const modSettingFormat = ref([])
const modSettingFormatLoading = ref(false)
const handleGetModSetting = () => {
  modSettingFormatLoading.value = true
  clickedModID.value = 0
  clickedModFileUrl.value = ""
  settingsApi.mod.settingFormat.get().then(response => {
    modSettingFormat.value = response.data
    for (let i of modSettingFormat.value) {
      if (i.id === 1) {
        addClientModsDisabledConfigButtonDisable.value = true
      }
    }
  }).finally(() => {
    modSettingFormatLoading.value = false
  })
}

const clickedModID = ref(0)
const clickedModFileUrl = ref("")
// const clickedModSetting = ref({})
const handleModClick = (modID, modFileUrl) => {
  clickedModID.value = modID
  clickedModFileUrl.value = modFileUrl
  handleGetModConfigurations()
}

const modConfigurationsLoading = ref(false)
const modConfigurations = ref({
  id: '',
  configOptions: []
})
const handleGetModConfigurations = () => {
  modConfigurationsLoading.value = true
  settingsApi.mod.configOptions.get({id: clickedModID.value}).then(response => {
    modConfigurations.value = response.data
  }).finally(() => {
    modConfigurationsLoading.value = false
  })
}

const handleModConfigChange = () => {
  modConfigurationsLoading.value = true
  settingsApi.mod.configChange.post({modFormattedData: modSettingFormat.value}).then(response => {
    showSnackbar(response.message)
  }).finally(() => {
    modConfigurationsLoading.value = false
  })
}

const modSearchLoading = ref(false)
const modSearchData = ref({
  total: 0,
  rows: [],
})
const modSearchFormRef = ref()
const modSearchForm = ref({
  page: 1,
  pageSize: 30,
  searchText: "",
  searchType: "text",
})

const handleModSearch = (resetPage = true) => {
  if (resetPage) {
    modSearchForm.value.page = 1;
  }
  modSearchLoading.value = true
  externalApi.modSearch.get(modSearchForm.value).then(response => {
    modSearchData.value.rows = response.data.rows
    modSearchData.value.total = response.data.total
    if (modSearchForm.value.searchType === "id") {
      showSnackbar('ID搜索不显示评分', 'info')
    }
  }).finally(() => {
    modSearchLoading.value = false
  })
}

const handlePageSizeChange = (pageSize) => {
  handleModSearch(false)
}
const handlePageChange = (page) => {
  handleModSearch(false)
}

const downloadedMod = ref([])
const downloadedModLoading = ref(false)
const handleGetDownloadedMod = () => {
  downloadedModLoading.value = true
  externalApi.modInfoDownloaded.get().then(response => {
    downloadedMod.value = response.data
  }).finally(() => {
    downloadedModLoading.value = false
  })
}

const syncModLoading = ref(false)
const handleSyncMod = () => {
  syncModLoading.value = true
  settingsApi.mod.sync.post().then(response => {
    showSnackbar(response.message)
    handleGetDownloadedMod()
  }).finally(() => {
    syncModLoading.value = false
  })
}

const actionsLoading = ref(false)
const handleModCommand = (actions) => {
  let cmd = actions.cmd
  let row = actions.row
  actionsLoading.value = true
  switch (cmd) {
    case 'enable':
      handleModEnable(row)
      break;
    case 'delete':
      handleModDelete(row)
      break;
    default:
      actionsLoading.value = false
      showSnackbar('未知错误', 'error')
  }
}
const handleModEnable = (row) => {
  const isUgc = row.file_url === "";
  const reqForm = {
    isUgc: isUgc,
    id: row.id
  }
  settingsApi.mod.enable.post(reqForm).then(response => {
    showSnackbar(response.message)
  }).finally(() => {
    actionsLoading.value = false
  })
}

const handleModDelete = (row) => {
  const isUgc = row.file_url === "";
  const reqForm = {
    isUgc: isUgc,
    id: row.id
  }
  settingsApi.mod.delete.post(reqForm).then(response => {
    showSnackbar(response.message)
    handleGetDownloadedMod()
  }).finally(() => {
    actionsLoading.value = false
  })
}

const buttonDisableModLoading = ref(false)
const handleModDisable = () => {
  if (clickedModID.value === 1) {
    buttonDisableModLoading.value = true
    settingsApi.mod.deleteClintModsDisabled.post().then(response => {
      showSnackbar(response.message)
      handleGetModSetting()
    }).finally(() => {
      buttonDisableModLoading.value = false
    })
  } else {
    buttonDisableModLoading.value = true
    const isUgc = clickedModFileUrl.value === "";
    const reqForm = {
      isUgc: isUgc,
      id: clickedModID.value
    }
    settingsApi.mod.disable.post(reqForm).then(response => {
      showSnackbar(response.message)
      handleGetModSetting()
    }).finally(() => {
      buttonDisableModLoading.value = false
    })
  }
}

const OSPlatform = ref("")
const handleGetOSPlatform = () => {
  toolsApi.osInfo.get().then(response => {
    OSPlatform.value = response.data.Platform
  })
}
const macOSExportButtonLoading = ref(false)
const handleMacOSExport = () => {
  macOSExportButtonLoading.value = true
  settingsApi.mod.macosExport.post().then(response => {
    showSnackbar(response.message)
  }).finally(() => {
    macOSExportButtonLoading.value = false
  })
}

const modUpdateButtonLoading = ref(false)
const handleModUpdate = () => {
  modUpdateButtonLoading.value = true
  const reqForm = {
    isUgc: clickedModFileUrl.value === "",
    id: clickedModID.value,
    fileURL: clickedModFileUrl.value
  }
  settingsApi.mod.update.post(reqForm).then(response => {
    showSnackbar(response.message)
  }).finally(() => {
    modUpdateButtonLoading.value = false
  })
}

const imageClientModsDisabled = new URL('./images/clientModsDisabled.svg', import.meta.url).href
const updateClientModsDisabledLoading = ref(false)

const addClientModsDisabledConfigButtonDisable = ref(false)
const addClientModsDisabledConfigButtonLoading = ref(false)
const handleAddClientModsDisabledConfig = () => {
  addClientModsDisabledConfigButtonLoading.value = true
  settingsApi.mod.addClintModsDisabled.post().then(response => {
    showSnackbar(response.message)
  }).finally(() => {
    addClientModsDisabledConfigButtonLoading.value = false
    addClientModsDisabledConfigButtonDisable.value = true
  })
}

</script>

<style scoped>
.item-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 10px;
}
</style>