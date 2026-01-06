<template>
  <v-card>
    <v-card-title>
      <div class="card-header">
        {{ t('game.mod.add.tabName') }}
        <div>
          <v-btn
            append-icon="ri-arrow-drop-down-line"
            :loading="multiEnableLoading"
            color="primary"
          >
            {{ t('game.mod.add.headerMenuButton') }}
            <v-menu activator="parent">
              <v-list>
                <v-list-item
                  :disabled="preDownloadLoading"
                  class="text-info"
                  @click="openPreDownloadDialog"
                >
                  <template #prepend>
                    <v-icon
                      icon="ri-download-2-line"
                      size="22"
                    />
                  </template>
                  <v-list-item-title>
                    {{ t('game.mod.add.preDownload') }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item
                  :disabled="selectedMods.length===0||multiEnableLoading"
                  class="text-success"
                  @click="multiEnable"
                >
                  <template #prepend>
                    <v-icon
                      icon="ri-list-check-3"
                      size="22"
                    />
                  </template>
                  <v-list-item-title>
                    {{ t('game.mod.add.enableMulti') }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item
                  :disabled="multiEnableLoading"
                  class="text-warning"
                  @click="handleModAction('enable', {id: 0, file_url: ''})"
                >
                  <template #prepend>
                    <v-icon
                      icon="ri-add-line"
                      size="22"
                    />
                  </template>
                  <v-list-item-title>
                    {{ t('game.mod.add.addClientModsDisabled') }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-btn>
          <v-dialog
            v-model="preDownloadDialog"
            :persistent="preDownloadLoading"
            :width="mobile?'90%':'40%'"
          >
            <v-card min-height="300">
              <v-card-title>
                <div class="card-header">
                  <span>
                    {{ t('game.mod.add.preDownloadDialog.title') }}
                  </span>
                  <v-btn
                    :disabled="preDownloadFetchInfoLoading"
                    :loading="preDownloadLoading"
                    @click="preDownload"
                  >
                    {{ t('game.mod.add.preDownloadDialog.button') }}
                  </v-btn>
                </div>
              </v-card-title>
              <v-card-text v-if="!preDownloadFetchInfoLoading">
                <v-alert
                  color="warning"
                  density="compact"
                  class="mt-2 mb-4"
                >
                  {{ t('game.mod.add.preDownloadDialog.tip') }}
                </v-alert>

                <v-progress-linear
                  v-model="preDownloadProgress"
                  color="info"
                  height="12"
                  rounded
                  rounded-bar
                  class="mb-4"
                />

                <v-chip
                  v-for="mod in modList"
                  :key="mod.id"
                  :color="mod.color"
                  label
                  class="mr-4 mt-4"
                >
                  {{ mod.name }}
                </v-chip>
              </v-card-text>
              <v-card-actions v-else>
                <result
                  :height="230"
                  color="info"
                  :title="t('game.mod.setting.tip.fetching')"
                />
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </div>
    </v-card-title>
    <v-card-text class="mt-4">
      <v-text-field
        v-model="downloadedModSearch"
        :loading="downloadedModsLoading"
        :label="t('game.mod.add.search')"
        variant="outlined"
        hide-details
        single-line
      >
        <template #append>
          <v-btn
            :loading="downloadedModsLoading"
            prepend-icon="ri-refresh-line"
            color="default"
            variant="elevated"
            size="large"
            @click="getDownloadedMods"
          >
            {{ t('game.mod.add.refresh') }}
          </v-btn>
        </template>
      </v-text-field>
      <v-sheet
        border
        rounded
        class="mt-4"
      >
        <v-data-table
          v-model="selectedMods"
          show-select
          return-object
          :headers="headers"
          :items="downloadedMods"
          :search="downloadedModSearch"
          :loading="downloadedModsLoading"
        >
          <template #loading>
            <v-skeleton-loader type="table-row@10" />
          </template>

          <template #item.preview_url="{ value }">
            <v-img
              :src="value"
              :width="100"
              cover
              rounded
              aspect-ratio="1"
              class="ma-2"
            >
              <template #placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular
                    color="grey-lighten-4"
                    indeterminate
                  />
                </div>
              </template>
            </v-img>
          </template>
          <template #item.name="{ value }">
            <v-chip
              label
              color="info"
            >
              {{ value }}
            </v-chip>
          </template>
          <template #item.serverSize="{ value }">
            <v-chip
              label
              color="primary"
            >
              {{ formatBytes(parseInt(value)) }}
            </v-chip>
          </template>
          <template #item.id="{ value }">
            <v-chip label>
              {{ value }}
            </v-chip>
          </template>
          <template #item.update="{ item }">
            <v-chip
              v-if="item.file_url!==''"
              label
            >
              {{ t('game.mod.add.notUGC') }}
            </v-chip>
            <v-chip
              v-if="item.file_url===''&&item.serverSize===item.localSize"
              label
              color="success"
            >
              {{ t('game.mod.add.needNoUpdate') }}
            </v-chip>
            <v-chip
              v-if="item.file_url===''&&item.serverSize!==item.localSize"
              label
              color="error"
            >
              {{ t('game.mod.add.needUpdate') }}
            </v-chip>
          </template>
          <template #item.actions="{ item }">
            <v-btn
              color="info"
              append-icon="ri-arrow-drop-down-line"
              variant="text"
            >
              {{ t('game.mod.add.actions') }}
              <v-menu activator="parent">
                <v-list>
                  <v-list-item
                    :disabled="modEnableLoading"
                    class="text-success"
                    @click="handleModAction('enable', item)"
                  >
                    <template #prepend>
                      <v-icon
                        icon="ri-file-check-line"
                        size="22"
                      />
                    </template>
                    <v-list-item-title>
                      {{ t('game.mod.add.enable') }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    :disabled="modUpdateLoading"
                    class="text-info"
                    @click="handleModAction('update', item)"
                  >
                    <template #prepend>
                      <v-icon
                        icon="ri-arrow-up-circle-line"
                        size="22"
                      />
                    </template>
                    <v-list-item-title>
                      {{ t('game.mod.add.updateMod') }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    :disabled="deleteModLoading"
                    class="text-error"
                    @click="handleModAction('delete', item)"
                  >
                    <template #prepend>
                      <v-icon
                        icon="ri-delete-bin-line"
                        size="22"
                      />
                    </template>
                    <v-list-item-title>
                      {{ t('game.mod.add.deleteMod') }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-btn>
          </template>
        </v-data-table>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script setup>
import modApi from "@/api/mod"
import useGlobalStore from "@store/global.js"
import { formatBytes } from "@/utils/tools"
import { showSnackbar } from "@/utils/snackbar"
import { useI18n } from "vue-i18n"
import roomApi from "@/api/room"
import { ref } from "vue"
import { useDisplay } from "vuetify/framework"

const globalStore = useGlobalStore()
const { mobile } = useDisplay()
const { t } = useI18n()

const downloadedMods = ref([])
const downloadedModsLoading = ref(false)

const getDownloadedMods = () => {
  const reqForm = {
    roomID: globalStore.room.id,
  }

  downloadedModsLoading.value = true
  modApi.downloaded.get(reqForm).then(response => {
    downloadedMods.value = response.data || []
  }).finally(() => {
    downloadedModsLoading.value = false
  })
}

const downloadedModSearch = ref('')

const headers = [
  { key: 'preview_url', title: t('game.mod.add.preview') },
  { key: 'name', title: t('game.mod.add.name') },
  { key: 'serverSize', title: t('game.mod.add.size') },
  { key: 'id', title: 'ID' },
  { key: 'update', title: t('game.mod.add.update') },
  { key: 'actions', title: t('game.mod.add.actions') },
]

const selectedMods = ref([])

const handleModAction = (action, mod) => {
  switch (action) {
  case "enable":
    modEnable(mod)
    break
  case "update":
    modUpdate(mod)
    break
  case "delete":
    handleDeleteMod(mod)
    break
  default:
    showSnackbar("牛哇", "error")
  }
}

const modEnableLoading = ref(false)

const modEnable = mod => {
  modEnableLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
    worldID: 0,
    id: mod.id,
    // eslint-disable-next-line camelcase
    file_url: mod.file_url,
  }

  modApi.add.enable.post(reqForm).then(response => {
    showSnackbar(response.message)
  }).finally(() => {
    modEnableLoading.value = false
  })
}

const modUpdateLoading = ref(false)

const modUpdate = mod => {
  modUpdateLoading.value = true

  const reqFrom = {
    roomID: globalStore.room.id,
    id: mod.id,
    // eslint-disable-next-line camelcase
    file_url: mod.file_url,
    update: true,
    name: mod.name,
    size: mod.serverSize,
  }

  modApi.download.post(reqFrom).then(response => {
    showSnackbar(response.message)
    getDownloadedMods()
  }).finally(() => {
    modUpdateLoading.value = false
  })
}

const multiEnableLoading = ref(false)

const multiEnable = async () => {
  let allSuccess = true
  multiEnableLoading.value = true
  for (let mod of selectedMods.value) {
    const reqForm = {
      roomID: globalStore.room.id,
      worldID: 0,
      id: mod.id,
      // eslint-disable-next-line camelcase
      file_url: mod.file_url,
    }

    try {
      await modApi.add.enable.post(reqForm)
    } catch {
      allSuccess = false
      showSnackbar(`${mod.name} ${t('game.mod.add.enableMultiFail')}`, 'error')
    }
  }

  if (allSuccess) {
    selectedMods.value = []
    showSnackbar(t('game.mod.add.enableMultiSuccess'))
  }

  multiEnableLoading.value = false
}

const preDownloadLoading = ref(false)
const preDownloadProgress = ref(0)

const preDownload = async () => {
  preDownloadLoading.value = true

  for (let i = 0; i < modList.value.length; i++) {
    const reqFrom = {
      roomID: globalStore.room.id,
      id: modList.value[i].id,
      // eslint-disable-next-line camelcase
      file_url: modList.value[i].file_url,
      update: false,
      name: modList.value[i].name,
      size: modList.value[i].size,
    }

    try {
      const res = await modApi.download.post(reqFrom)

      modList.value[i].color = 'success'
      preDownloadProgress.value = ((i+1) / modList.value.length) * 100
    } catch {
      showSnackbar(`${modList.value[i].name} ${t('game.mod.add.preDownloadFail')}`, 'error')
    }
  }

  preDownloadProgress.value = 100
  preDownloadLoading.value = false
}

const preDownloadDialog = ref(false)

const preDownloadFetchInfoLoading = ref(false)

const openPreDownloadDialog = () => {
  preDownloadDialog.value = true
  preDownloadFetchInfoLoading.value = true
  getEnabledMods().finally(() => {
    preDownloadFetchInfoLoading.value = false
  })
}

const modList = ref([])

const worlds = ref([])

const getWorlds = async () => {
  const reqForm = {
    roomID: globalStore.room.id,
  }

  const response = await roomApi.worlds.get(reqForm)

  worlds.value = response.data
}

const getEnabledMods = async () => {
  modList.value = []

  const reqForm = {
    roomID: globalStore.room.id,
    worldID: worlds.value[0]?.id,
  }

  const response = await modApi.setting.enabledMods.get(reqForm)
  const responseData = response.data || []
  for (let mod of responseData) {
    mod.color = 'default'

    const m = {
      id: mod.id,
      name: mod.name,
      // eslint-disable-next-line camelcase
      file_url: mod.file_url,
      size: mod.serverSize,
    }

    modList.value.push(m)
  }
}

const deleteModLoading = ref(false)

const handleDeleteMod = mod => {
  deleteModLoading.value = true

  const reqFrom = {
    roomID: globalStore.room.id,
    id: mod.id,
    // eslint-disable-next-line camelcase
    file_url: mod.file_url,
  }

  modApi.delete.post(reqFrom).then(response => {
    showSnackbar(response.message)
    getDownloadedMods()
  }).finally(() => {
    deleteModLoading.value = false
  })
}


onMounted(() => {
  getWorlds()
  getDownloadedMods()
})
</script>

