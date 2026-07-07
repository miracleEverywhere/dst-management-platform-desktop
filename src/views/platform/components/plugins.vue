<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="search"
            :label="t('platform.plugin.search.label')"
            :placeholder="t('platform.plugin.search.placeholder')"
            persistent-placeholder
            clearable
            @keyup.enter="getPluginListData({page: pluginListData.page,
                                             itemsPerPage: pluginListData.pageSize,
                                             sortBy: undefined,
            })"
            @click:clear="getPluginListData({page: pluginListData.page,
                                             itemsPerPage: pluginListData.pageSize,
                                             sortBy: undefined,
            })"
          />
        </v-col>
        <v-col cols="12">
          <v-sheet
            rounded
            border
          >
            <v-data-table-server
              v-model:items-per-page="pluginListData.pageSize"
              :items="pluginListData.rows"
              :items-length="pluginListData.total"
              :page="pluginListData.page"
              :loading="getPluginListDataLoading"
              :headers="headers"
              @update:options="getPluginListData"
            >
              <template #top>
                <v-toolbar flat>
                  <v-toolbar-title>
                    <v-icon
                      icon="ri-plug-3-line"
                      start
                    />
                    <span v-if="!mobile">{{ t('platform.plugin.table.title') }}</span>
                  </v-toolbar-title>
                </v-toolbar>
              </template>
              <template #item.name="{ value }">
                <v-chip label>
                  {{ value }}
                </v-chip>
              </template>
              <template #item.status="{ value }">
                <v-chip
                  :color="value?'success':'error'"
                  label
                >
                  {{ value?t('platform.plugin.table.status.enable'):t('platform.plugin.table.status.disable') }}
                </v-chip>
              </template>
              <template #item.step="{ value }">
                <v-chip
                  :color="value===100?'success':'warning'"
                  label
                >
                  {{ t(`platform.plugin.table.step.${value}`) }}
                </v-chip>
              </template>
              <template #item.actions="{ item }">
                <v-btn
                  color="info"
                  append-icon="ri-arrow-drop-down-line"
                  variant="text"
                >
                  {{ t('platform.plugin.table.actions.action') }}
                  <v-menu activator="parent">
                    <v-list>
                      <v-list-item
                        class="text-info"
                        @click="handleAction('introduce', item)"
                      >
                        <template #prepend>
                          <v-icon
                            icon="ri-information-2-line"
                            size="22"
                          />
                        </template>
                        <v-list-item-title>
                          {{ t('platform.plugin.table.actions.introduce') }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        class="text-primary"
                        @click="handleAction('install', item)"
                      >
                        <template #prepend>
                          <v-icon
                            icon="ri-install-line"
                            size="22"
                          />
                        </template>
                        <v-list-item-title>
                          {{ t('platform.plugin.table.actions.install') }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        :disabled="item.step!==100||item.status"
                        class="text-success"
                        @click="handleAction('enable', item)"
                      >
                        <template #prepend>
                          <v-icon
                            icon="ri-checkbox-circle-line"
                            size="22"
                          />
                        </template>
                        <v-list-item-title>
                          {{ t('platform.plugin.table.actions.enable') }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        :disabled="item.step!==100||!item.status"
                        class="text-warning"
                        @click="handleAction('disable', item)"
                      >
                        <template #prepend>
                          <v-icon
                            icon="ri-close-circle-line"
                            size="22"
                          />
                        </template>
                        <v-list-item-title>
                          {{ t('platform.plugin.table.actions.disable') }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        :disabled="item.step!==100"
                        class="text-info"
                        @click="handleAction('update', item)"
                      >
                        <template #prepend>
                          <v-icon
                            icon="ri-loop-left-line"
                            size="22"
                          />
                        </template>
                        <v-list-item-title>
                          {{ t('platform.plugin.table.actions.update') }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        class="text-error"
                        @click="handleAction('uninstall', item)"
                      >
                        <template #prepend>
                          <v-icon
                            icon="ri-uninstall-line"
                            size="22"
                          />
                        </template>
                        <v-list-item-title>
                          {{ t('platform.plugin.table.actions.uninstall') }}
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-btn>
              </template>
            </v-data-table-server>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-dialog
    v-model="introduceDialogVisible"
    :width="mobile?'90%':'50%'"
  >
    <v-card>
      <v-card-title>
        {{ currentPlugin }}
      </v-card-title>
      <v-card-text>
        <v-alert
          border="start"
          color="info"
          variant="tonal"
          class="mb-4"
        >
          {{ t(`platform.plugin.introduce.${currentPlugin}.desc`) }}
          <br>
          {{ t(`platform.plugin.introduce.info`) }}
        </v-alert>
        <v-alert
          border="start"
          color="error"
          variant="tonal"
          class="mb-4"
        >
          {{ t(`platform.plugin.introduce.${currentPlugin}.warning`) }}
        </v-alert>
        <v-alert
          border="start"
          color="warning"
          variant="tonal"
          class="mb-4"
        >
          {{ t(`platform.plugin.introduce.${currentPlugin}.os`) }}
          {{ osPlatform }} {{ osPlatformVersion }}
        </v-alert>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="installTmiDialogVisible"
    :width="mobile?'90%':'50%'"
    :persistent="installTmiLoading"
  >
    <v-card>
      <v-card-title>
        {{ currentPlugin }}
        {{ t('platform.plugin.install.install') }}
      </v-card-title>
      <v-card-text class="my-4">
        <v-alert
          border="start"
          color="info"
          variant="tonal"
          class="mb-4"
        >
          {{ t(`platform.plugin.introduce.info`) }}
        </v-alert>
        <v-alert
          border="start"
          color="x"
          variant="tonal"
          class="mb-4"
        >
          {{ t(`platform.plugin.introduce.${currentPlugin}.os`) }}
          {{ osPlatform }} {{ osPlatformVersion }}
        </v-alert>
        <v-text-field
          v-model="installTmiForm.proxy"
          v-tooltip="t('platform.plugin.install.tmi.proxy.tip')"
          :label="t('platform.plugin.install.tmi.proxy.name')"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="x"
          @click="installTmiDialogVisible=false"
        >
          {{ t('platform.plugin.install.cancel') }}
        </v-btn>
        <v-btn
          :loading="installTmiLoading"
          @click="installTmi"
        >
          {{ t('platform.plugin.install.install') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <confirm-box
    v-model="confirmSettings.visible"
    type="warning"
    :title="t('global.confirm.title')"
    :content="confirmSettings.content"
    :confirm-text="t('global.confirm.confirm')"
    :cancel-text="t('global.confirm.cancel')"
    :confirm-loading="confirmSettings.loading"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup>
import platformApi from "@/api/platform.js"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import { showSnackbar } from "@/utils/snackbar.js"


const { mobile } = useDisplay()
const { t } = useI18n()

const osPlatform = ref('')
const osPlatformVersion = ref('')

const getOSInfo = () => {
  platformApi.osInfo.get().then(response => {
    osPlatform.value = response.data?.Platform || ''
    osPlatformVersion.value = response.data?.PlatformVersion || ''
  })
}

const search = ref('')

const pluginListData = ref({
  rows: [],
  page: 1,
  pageSize: 10,
  total: 0,
})

const getPluginListDataLoading = ref(false)

const getPluginListData = ({ page, itemsPerPage, sortBy }) => {
  const reqFrom = {
    q: search.value,
    page: page,
    pageSize: itemsPerPage,
  }

  getPluginListDataLoading.value = true
  platformApi.plugin.list.get(reqFrom).then(response => {
    pluginListData.value = response.data
  }).finally(() => {
    getPluginListDataLoading.value = false
  })
}

const headers = [
  { title: t('platform.plugin.table.name'), value: 'name' },
  { title: t('platform.plugin.table.status.name'), value: 'status' },
  { title: t('platform.plugin.table.step.name'), value: 'step' },
  { title: t('platform.plugin.table.actions.action'), value: 'actions' },
]

const handleAction = (action, item) => {
  currentPlugin.value = item.name

  if (action === 'introduce') {
    introduceDialogVisible.value = true

    return
  }
  if (action === 'install') {
    installTmiDialogVisible.value = true

    return
  }

  confirmSettings.value = {
    visible: true,
    content: t(`platform.plugin.confirm.${action}`),
    loading: false,
    action: action,
  }
}

const currentPlugin = ref('')
const introduceDialogVisible = ref(false)
const installTmiDialogVisible = ref(false)
const installTmiLoading = ref(false)

const installTmiForm = ref({
  name: 'tmi',
  proxy: 'https://gh-proxy.com/',
})

const installTmi = () => {
  installTmiLoading.value = true
  platformApi.plugin.install.post(installTmiForm.value).then(response => {
    installTmiDialogVisible.value = false
    showSnackbar(response.message)
    // eslint-disable-next-line sonarjs/no-extra-arguments
    getPluginListData(pluginListData.value.page, pluginListData.value.pageSize, undefined)
  }).finally(() => {
    installTmiLoading.value = false
  })
}

const confirmSettings = ref({
  visible: false,
  content: '',
  loading: false,
  action: '',
})

const handleConfirm = () => {
  confirmSettings.value.loading = true

  const reqForm = {
    name: currentPlugin.value,
    type: confirmSettings.value.action,
  }

  platformApi.plugin.action.post(reqForm).then(response => {
    showSnackbar(response.message)
    // eslint-disable-next-line sonarjs/no-extra-arguments
    getPluginListData(pluginListData.value.page, pluginListData.value.pageSize, undefined)
  }).finally(() => {
    handleCancel()
  })
}

const handleCancel = () => {
  confirmSettings.value = {
    visible: false,
    content: '',
    loading: false,
    action: '',
  }
}

onMounted(() => {
  getOSInfo()
})
</script>

