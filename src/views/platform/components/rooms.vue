<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="search"
            :label="t('platform.user.search.label')"
            :placeholder="t('platform.user.search.placeholder')"
            clearable
            @keyup.enter="getRoomsData({page: roomsData.page,
                                        itemsPerPage: roomsData.pageSize,
                                        sortBy: undefined,
            })"
            @click:clear="getRoomsData({page: roomsData.page,
                                        itemsPerPage: roomsData.pageSize,
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
              v-model:items-per-page="roomsData.pageSize"
              :items="roomsData.rows"
              :items-length="roomsData.total"
              :page="roomsData.page"
              :loading="getRoomsDataLoading"
              :headers="headers"
              @update:options="getRoomsData"
            >
              <template #top>
                <v-toolbar flat>
                  <v-toolbar-title>
                    <v-icon
                      icon="ri-instance-line"
                      start
                    />
                    <span v-if="!mobile">{{ t('platform.rooms.title') }}</span>
                  </v-toolbar-title>
                  <v-btn
                    prepend-icon="ri-refresh-line"
                    :loading="getRoomsDataLoading"
                    color="default"
                    @click="getRoomsData({page: roomsData.page,
                                          itemsPerPage: roomsData.pageSize,
                                          sortBy: undefined,
                    })"
                  >
                    {{ t('platform.user.table.refresh') }}
                  </v-btn>
                </v-toolbar>
              </template>
              <template #item.id="{value}">
                <v-chip
                  label
                  color="primary"
                >
                  {{ value }}
                </v-chip>
              </template>
              <template #item.status="{value}">
                <v-chip
                  v-if="value"
                  color="success"
                  label
                >
                  {{ t('platform.rooms.activate') }}
                </v-chip>
                <v-chip
                  v-else
                  color="warning"
                  label
                >
                  {{ t('platform.rooms.deactivate') }}
                </v-chip>
              </template>
              <template #item.maxPlayer="{value}">
                <v-chip label>
                  {{ value }}
                </v-chip>
              </template>
              <template #item.worldNum="{item}">
                <v-chip
                  label
                  color="info"
                >
                  {{ item.worlds.length }}
                </v-chip>
              </template>
              <template #item.modNum="{item}">
                <v-chip
                  label
                  color="info"
                >
                  {{ item.modInOne?parseModLua(item.modData).length:parseModLua(item.worlds[0].modData).length }}
                </v-chip>
              </template>
              <template #item.serverPort="{item}">
                <v-chip
                  label
                  color="info"
                >
                  {{ item.worlds.map(item => item.serverPort).join(',') }}
                </v-chip>
              </template>
              <template #item.actions="{ item }">
                <v-btn
                  color="info"
                  append-icon="ri-arrow-drop-down-line"
                  variant="text"
                  :loading="activateLoading||deactivateLoading||deleteRoomLoading"
                >
                  {{ t('platform.user.table.actions') }}
                  <v-menu activator="parent">
                    <v-list>
                      <v-list-item
                        class="text-info"
                        @click="handleAction('details', item)"
                      >
                        <template #prepend>
                          <v-icon
                            icon="ri-information-2-line"
                            size="22"
                          />
                        </template>
                        <v-list-item-title>
                          {{ t('platform.rooms.actions.details') }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        class="text-success"
                        :disabled="item.status"
                        @click="handleAction('activate', item)"
                      >
                        <template #prepend>
                          <v-icon
                            icon="ri-play-large-line"
                            size="22"
                          />
                        </template>
                        <v-list-item-title>
                          {{ t('platform.rooms.actions.activate') }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        class="text-warning"
                        :disabled="!item.status"
                        @click="handleAction('deactivate', item)"
                      >
                        <template #prepend>
                          <v-icon
                            icon="ri-stop-large-line"
                            size="22"
                          />
                        </template>
                        <v-list-item-title>
                          {{ t('platform.rooms.actions.deactivate') }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        class="text-error"
                        @click="handleAction('delete', item)"
                      >
                        <template #prepend>
                          <v-icon
                            icon="ri-delete-bin-line"
                            size="22"
                          />
                        </template>
                        <v-list-item-title>
                          {{ t('platform.rooms.actions.delete') }}
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
    v-model="detailDialog"
    :width="mobile?'90%':'60%'"
  >
    <v-card>
      <v-card-title>
        {{ t('platform.rooms.dialog.title') }}
      </v-card-title>
      <v-card-text class="ma-4">
        <v-row class="d-flex align-center">
          <v-col>
            <v-chip
              label
              color="info"
              class="mr-4"
            >
              ID
            </v-chip>
            <span>
              {{ detailForm.id }}
            </span>
          </v-col>
        </v-row>
        <v-row class="d-flex align-center">
          <v-col>
            <v-chip
              label
              color="info"
              class="mr-4"
            >
              {{ t('platform.rooms.dialog.data.gameName') }}
            </v-chip>
            <span>
              {{ detailForm.gameName }}
            </span>
          </v-col>
        </v-row>
        <v-row class="d-flex align-center">
          <v-col>
            <v-chip
              label
              color="info"
              class="mr-4"
            >
              {{ t('platform.rooms.dialog.data.gameMode') }}
            </v-chip>
            <span>
              {{ t(`game.base.step1.gameMode.modes.${detailForm.gameMode}`) }}
            </span>
          </v-col>
        </v-row>
        <v-row class="d-flex align-center">
          <v-col>
            <v-chip
              label
              color="info"
              class="mr-4"
            >
              {{ t('platform.rooms.dialog.data.ports') }}
            </v-chip>
            <span>
              {{ detailForm.ports.join(",") }}
            </span>
          </v-col>
        </v-row>
        <v-alert
          v-if="detailForm.screens.length!==0"
          color="primary"
          density="compact"
          class="mt-8 mb-4"
        >
          {{ t('platform.rooms.dialog.data.screenTip') }}
        </v-alert>
        <v-alert
          v-if="detailForm.screens.length===0"
          color="warning"
          density="compact"
          class="mt-8 mb-4"
        >
          {{ t('platform.rooms.dialog.data.noScreenTip') }}
        </v-alert>
        <v-row
          v-for="screenName in detailForm.screens"
          v-if="detailForm.screens.length!==0"
        >
          <v-col cols="6">
            <v-chip label>
              {{ screenName }}
            </v-chip>
          </v-col>
          <v-col cols="6">
            <v-btn
              density="compact"
              :loading="killLoading"
              @click="killScreen(screenName)"
            >
              {{ t('platform.rooms.dialog.data.kill') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
  <confirm-box
    v-model="confirmVisible"
    type="warning"
    :title="t('global.confirm.title')"
    :content="t('global.confirm.content')"
    :confirm-text="t('global.confirm.confirm')"
    :cancel-text="t('global.confirm.cancel')"
    :confirm-loading="deleteRoomLoading"
    @confirm="deleteRoom"
    @cancel="confirmVisible=false"
  />
</template>

<script setup>
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import roomApi from "@/api/room.js"
import platformApi from "@/api/platform.js"
import { parseModLua } from "@/utils/tools.js"
import useGlobalStore from "@store/global.js"
import { showSnackbar } from "@/utils/snackbar.js"

const { mobile } = useDisplay()
const { t } = useI18n()
const globalStore = useGlobalStore()

const search = ref('')

const roomsData = ref({
  rows: [],
  page: 1,
  pageSize: 10,
  total: 0,
})

const getRoomsDataLoading = ref(false)

const getRoomsData = ({ page, itemsPerPage, sortBy }) => {
  const reqFrom = {
    gameName: search.value,
    page: page,
    pageSize: itemsPerPage,
  }

  getRoomsDataLoading.value = true
  roomApi.list.get(reqFrom).then(response => {
    roomsData.value = response.data
    roomsData.value.rows = response.data.rows || []
  }).finally(() => {
    getRoomsDataLoading.value = false
  })
}

const headers = [
  { title: 'ID', value: 'id' },
  { title: t('platform.rooms.headers.gameName'), value: 'gameName', minWidth: 150 },
  { title: t('platform.rooms.headers.status'), value: 'status' },
  { title: t('platform.rooms.headers.maxPlayer'), value: 'maxPlayer', minWidth: 120 },
  { title: t('platform.rooms.headers.worldNum'), value: 'worldNum' },
  { title: t('platform.rooms.headers.modNum'), value: 'modNum' },
  { title: t('platform.rooms.headers.serverPort'), value: 'serverPort' },
  { title: t('platform.rooms.headers.actions'), value: 'actions' },
]

const detailDialog = ref(false)

const detailForm = ref({
  id: undefined,
  gameName: '',
  gameMode: '',
  ports: [],
  screens: [],
})

const detailDialogLoading = ref(false)

const openDetailDialog = async row => {
  detailDialog.value = true
  detailDialogLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
  }

  const screens = []
  const response = await platformApi.screen.running.get(reqForm)
  for (let n of response.data) {
    if (n !== "") {
      screens.push(n)
    }
  }

  const ports = []

  ports.push(row.masterPort)
  for (let world of row.worlds) {
    ports.push(world.serverPort)
    ports.push(world.masterServerPort)
    ports.push(world.authenticationPort)
  }

  detailForm.value = {
    id: row.id,
    gameName: row.gameName,
    gameMode: row.gameMode,
    ports: ports,
    screens: screens,
  }
  detailDialogLoading.value = false
}

const killLoading = ref(false)

const killScreen = screenName => {
  killLoading.value = true

  const reqForm = {
    screenName: screenName,
  }

  platformApi.screen.kill.post(reqForm).then(response => {
    showSnackbar(response.message)
  }).finally(() => {
    killLoading.value = false
  })
}

const handleAction = (actionType, row) => {
  switch (actionType) {
  case 'details':
    openDetailDialog(row)
    break
  case 'activate':
    activate(row)
    break
  case 'deactivate':
    deactivate(row)
    break
  case 'delete':
    currentRoomID.value = row.id
    confirmVisible.value = true
    break
  }
}

const activateLoading = ref(false)

const activate = row => {
  activateLoading.value = true

  const reqForm = {
    roomID: row.id,
  }

  roomApi.activate.post(reqForm).then(response => {
    showSnackbar(response.message)
    getRoomsData({
      page: roomsData.value.page,
      itemsPerPage: roomsData.value.pageSize,
      sortBy: undefined,
    })
  }).finally(() => {
    activateLoading.value = false
  })
}

const deactivateLoading = ref(false)

const deactivate = row => {
  deactivateLoading.value = true

  const reqForm = {
    roomID: row.id,
  }

  roomApi.deactivate.post(reqForm).then(response => {
    showSnackbar(response.message)
    getRoomsData({
      page: roomsData.value.page,
      itemsPerPage: roomsData.value.pageSize,
      sortBy: undefined,
    })
  }).finally(() => {
    deactivateLoading.value = false
  })
}

const confirmVisible = ref(false)
const currentRoomID = ref(0)
const deleteRoomLoading = ref(false)

const deleteRoom = () => {
  deleteRoomLoading.value = true

  const reqForm = {
    roomID: currentRoomID.value,
  }

  roomApi.base.delete(reqForm).then(response => {
    confirmVisible.value = false
    showSnackbar(response.message)
    getRoomsData({
      page: roomsData.value.page,
      itemsPerPage: roomsData.value.pageSize,
      sortBy: undefined,
    })
    if (globalStore.room.id === currentRoomID.value) {
      globalStore.room.id = 0
    }
  }).finally(() => {
    deleteRoomLoading.value = false
  })
}
</script>

