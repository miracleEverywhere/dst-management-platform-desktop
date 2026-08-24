<template>
  <v-text-field
    v-model="search"
    class="mt-4"
    :label="t('game.player.history.search.label')"
    :placeholder="t('game.player.history.search.placeholder')"
    persistent-placeholder
    clearable
    @keyup.enter="searchUidmap"
    @click:clear="searchUidmap"
  />
  <v-sheet
    border
    rounded
    class="mt-4"
  >
    <v-data-table-server
      v-model:page="uidmapData.page"
      v-model:items-per-page="uidmapData.pageSize"
      :headers="headers"
      :items="uidmapData.rows"
      :items-length="uidmapData.total"
      :loading="getUidmapLoading"
      @update:options="getUidmap"
    >
      <template #loading>
        <v-skeleton-loader type="table-row@10" />
      </template>
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon
              icon="ri-contacts-line"
              start
            />
            <span v-if="!mobile">{{ t('game.player.history.tabName') }}</span>
          </v-toolbar-title>
        </v-toolbar>
      </template>
      <template #item.uid="{value}">
        <v-chip label>
          {{ value }}
        </v-chip>
      </template>
      <template #item.nickname="{value}">
        <v-chip
          label
          color="primary"
        >
          {{ value }}
        </v-chip>
      </template>
      <template #item.actions="{ item }">
        <v-btn
          color="info"
          append-icon="ri-arrow-drop-down-line"
          variant="text"
          :loading="actionsLoading"
        >
          {{ t('platform.user.table.actions') }}
          <v-menu activator="parent">
            <v-list>
              <v-list-item
                class="text-info"
                @click="handleList(item.uid, 'adminlist', 'add')"
              >
                <template #prepend>
                  <v-icon
                    icon="ri-user-star-line"
                    size="22"
                  />
                </template>
                <v-list-item-title>
                  {{ t('game.player.online.actions.admin') }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item
                class="text-error"
                @click="handleList(item.uid, 'blocklist', 'add')"
              >
                <template #prepend>
                  <v-icon
                    icon="ri-user-forbid-line"
                    size="22"
                  />
                </template>
                <v-list-item-title>
                  {{ t('game.player.online.actions.block') }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item
                class="text-success"
                @click="handleList(item.uid, 'whitelist', 'add')"
              >
                <template #prepend>
                  <v-icon
                    icon="ri-user-heart-line"
                    size="22"
                  />
                </template>
                <v-list-item-title>
                  {{ t('game.player.online.actions.white') }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </template>
    </v-data-table-server>
  </v-sheet>
</template>

<script setup>
import useGlobalStore from "@store/global.js"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import playerApi from "@/api/player.js"
import { showSnackbar } from "@/utils/snackbar.js"

const globalStore = useGlobalStore()
const { mobile } = useDisplay()
const { t } = useI18n()

const search = ref('')

const uidmapData = ref({
  rows: [],
  page: 1,
  pageSize: 10,
  total: 0,
})

const getUidmapLoading = ref(false)

const getUidmap = ({ page, itemsPerPage }) => {
  const reqForm = {
    roomID: globalStore.room.id,
    q: search.value || '',
    page,
    pageSize: itemsPerPage,
  }

  getUidmapLoading.value = true
  playerApi.uidmap.get(reqForm).then(response => {
    uidmapData.value = response.data
  }).finally(() => {
    getUidmapLoading.value = false
  })
}

const searchUidmap = () => {
  getUidmap({
    page: 1,
    itemsPerPage: uidmapData.value.pageSize,
  })
}

const headers = [
  { key: 'uid', title: t('game.player.online.header.uid') },
  { key: 'nickname', title: t('game.player.online.header.nickname') },
  { key: 'actions', title: t('game.player.online.header.actions') },
]

const actionsLoading = ref(false)

const handleList = (uid, listType, actionType) => {
  actionsLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
    uids: [uid],
    listType: listType,
    actionType: actionType,
  }

  playerApi.list.post(reqForm).then(response => {
    showSnackbar(response.message)
  }).finally(() => {
    actionsLoading.value = false
  })
}
</script>
