<template>
  <v-tabs v-model="activeTabName" align-tabs="start"
          class="v-tabs-pill" color="primary" show-arrows @update:modelValue="handleTabClick">
    <v-tab value="Download">下载模组</v-tab>
    <v-tab value="Add">添加模组</v-tab>
    <v-tab v-if="!(OSPlatform==='darwin')" value="Setting">配置模组</v-tab>
  </v-tabs>

  <v-tabs-window v-model="activeTabName">
    <v-tabs-window-item value="Download">
      <v-card class="mt-4" height="820">
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
                <span class="align-content-center mr-2">
                  共 {{modSearchData.total}}
                </span>
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
    <v-tabs-window-item value="Add">
      <v-card class="mt-4" height="820">
        <v-card-title>
          <div class="card-header">
            <span>已下载的模组</span>
            <div>
              <v-btn color="xx" class="mr-4" @click="handleGetDownloadedMod">刷新</v-btn>
              <v-btn color="info" class="mr-4" :loading="syncModLoading" @click="handleSyncMod">
                <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                  该页面只展示手动下载的模组，点击此按钮将同步自动下载的模组到此页面
                </v-tooltip>
                同步
              </v-btn>
              <v-btn color="error" :loading="addClientModsDisabledConfigButtonLoading"
                     :disabled="addClientModsDisabledConfigButtonDisable"
                     @click="handleAddClientModsDisabledConfig">
                禁本地
              </v-btn>
            </div>
          </div>
        </v-card-title>
        <v-card-text>
          <v-alert color="warning" density="compact" class="mt-2">
            模组下载速度取决于网络和文件大小，请耐心等待，切勿重复下载
          </v-alert>
          <v-container height="700" style="overflow-y: auto">
            <v-data-table
              :headers="addTableHeaders"
              :items="downloadedMod"
              :items-per-page="10"
              :loading="downloadedModLoading"
              :page.sync="downloadedModPage"
              :server-items-length="downloadedModRows"
              class="mt-4"
            >
              <template v-slot:loading>
                <v-skeleton-loader type="table-row@12"></v-skeleton-loader>
              </template>
              <template v-slot:item.id="{item}">
                <v-chip :color="colors.cyan.darken1" label>
                  {{ item.id }}
                </v-chip>
              </template>
              <template v-slot:item.size="{item}">
                <v-chip color="info" label>
                  {{ formatBytes(item.size) }}
                </v-chip>
              </template>
              <template v-slot:item.downloadedReady="{item}">
                <v-chip v-if="item.downloadedReady" color="success" label>
                  <v-icon icon="$success" start/>
                  下载完成
                </v-chip>
                <v-chip v-else color="warning" label>
                  <v-icon icon="$warning" start/>
                  正在下载或需更新
                </v-chip>
              </template>
              <template v-slot:item.action="{item}">
                <v-menu open-on-hover>
                  <template v-slot:activator="{ props }">
                    <v-btn append-icon="ri-arrow-down-s-line" color="xx" v-bind="props" variant="text">
                      操作
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item title="启用" @click="handleModEnable(item)"/>
                    <v-list-item title="删除" @click="handleModDelete(item)"/>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </v-container>
        </v-card-text>
      </v-card>
    </v-tabs-window-item>
    <v-tabs-window-item value="Setting">
      <v-row class="mt-1">
        <v-col cols="4">
          <v-card height="820">
            <v-card-text>
              <v-container height="770" style="overflow-y: auto">
                <template v-if="modSettingFormatLoading">
                  <sc-loading :height="700"></sc-loading>
                </template>
                <template v-if="!modSettingFormatLoading">
                  <template v-if="modSettingFormat">
                    <template v-for="(mod, index) in modSettingFormat">
                      <template v-if="mod.id===1">
                        <div style="display: flex">
                          <div>
                            <v-img :src="imageClientModsDisabled" style="width: 75px; height: 75px"
                                   @click="handleModClick(mod.id, mod.file_url)"/>
                          </div>
                          <div style="display: flex;margin-left: 5px;flex-direction: column;justify-content: center">
                            <v-btn variant="text" color="primary" @click="handleModClick(mod.id, mod.file_url)">
                              禁用客户端模组
                            </v-btn>
                            <div class="mt-1">
                              <v-chip v-if="mod.enable" color="success">已启用</v-chip>
                              <v-chip v-if="!mod.enable" color="xx">已禁用</v-chip>
                            </div>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div style="display: flex">
                          <div>
                            <v-img :src="mod.preview_url" style="width: 75px; height: 75px"
                                   @click="handleModClick(mod.id, mod.file_url)"/>
                          </div>
                          <div style="display: flex;margin-left: 5px;flex-direction: column;justify-content: center">
                            <v-btn variant="text" color="primary" @click="handleModClick(mod.id, mod.file_url)">
                              {{ mod.name }}
                            </v-btn>
                            <div class="mt-1">
                              <v-chip v-if="mod.enable" color="success">已启用</v-chip>
                              <v-chip v-if="!mod.enable" color="xx">已禁用</v-chip>
                            </div>
                          </div>
                        </div>
                      </template>
                      <v-divider v-if="index !== (modSettingFormat.length - 1)" class="mt-4 mb-4"/>
                    </template>
                  </template>
                  <template v-else>
                    <div class="d-flex flex-column align-center justify-center" style="height: 650px;">
                      <v-icon color="warning" icon="ri-error-warning-fill" size="64"/>
                      <div class="mt-8" style="font-size: 1.6rem; font-weight: 300; line-height: 1; letter-spacing: -0.015625em">
                        服务器未添加模组
                      </div>
                    </div>
                  </template>
                </template>
              </v-container>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="8">
          <v-card height="820">
            <v-card-title>
              <div class="card-header">
                <span>
                  配置模组
                </span>
                <div>
                  <v-btn :disabled="clickedModID<2" :loading="modUpdateButtonLoading"
                         color="primary" @click="handleModUpdate">
                    更新
                  </v-btn>
                  <v-btn :disabled="clickedModID===0" :loading="buttonDisableModLoading"
                         color="error" @click="handleModDisable" class="ml-4">
                    禁用
                  </v-btn>
                </div>
              </div>
            </v-card-title>
            <v-card-text>
              <v-container height="700" style="overflow-y: auto">
                <template v-if="clickedModID>1">
                    <template v-if="modConfigurations.configOptions">
                      <v-form ref="modSettingFormRef">
                        <v-row class="mb-4">
                          <v-text-field :model-value="modConfigurations.id" label="ID"
                                        variant="outlined" disabled density="compact"
                          />
                        </v-row>
                        <v-row class="mb-4">
                          <v-text-field :model-value="modSettingFormat[modSettingFormat.findIndex(item => item.id === clickedModID)].name"
                                        label="名称" variant="outlined" disabled density="compact"
                          />
                        </v-row>
                        <v-row v-for="item in modConfigurations.configOptions" class="mb-4">
                          <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                            <template v-slot:activator="{ props }">
                              <v-select v-model="modSettingFormat[modSettingFormat.findIndex(item => item.id === clickedModID)].configurationOptions[item.name]"
                                        :items="item.options.map(item => ({title: item.description,value: item.data}))"
                                        @update:modelValue="handleModConfigChange" v-bind="props"
                                        variant="outlined" density="compact" :label="item.label"
                              >
                              </v-select>
                            </template>
                            {{item.hover}}
                          </v-tooltip>

                        </v-row>
                      </v-form>
                    </template>
                    <template v-else>
                      <<div class="d-flex flex-column align-center justify-center" style="height: 650px;">
                      <v-icon color="warning" icon="ri-error-warning-fill" size="64"/>
                      <div class="mt-8" style="font-size: 1.6rem; font-weight: 300; line-height: 1; letter-spacing: -0.015625em">
                        该模组无配置项
                      </div>
                    </div>
                    </template>
                </template>
                <template v-if="clickedModID===1">
                  <v-alert icon="$warning" color="warning" density="compact">
                    如果启用此配置，则会禁用玩家的本地模组
                  </v-alert>
                </template>
                <template v-if="clickedModID===0">
                  <div class="d-flex flex-column align-center justify-center" style="height: 650px;">
                    <v-icon color="warning" icon="ri-error-warning-fill" size="64"/>
                    <div class="mt-8" style="font-size: 1.6rem; font-weight: 300; line-height: 1; letter-spacing: -0.015625em">
                      请选择一个模组进行配置
                    </div>
                  </div>
                </template>
              </v-container>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
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
import colors from 'vuetify/lib/util/colors'


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
      addClientModsDisabledConfigButtonDisable.value = false
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

const addTableHeaders = ref([
  {title: "名称", value: "name"},
  {title: "ID", value: "id"},
  {title: "模组大小", value: "size"},
  {title: "状态", value: "downloadedReady"},
  {title: "操作", value: "action"},
])
const downloadedModPage = ref(1)
const downloadedModRows = ref(0)
</script>

<style scoped>
.item-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 10px;
}
</style>