<template>
  <v-sheet
    border
    rounded
    class="mt-4"
  >
    <v-data-table
      :headers="headers"
      :items="onlinePlayers"
      :loading="getOnlinePlayersLoading"
    >
      <template #loading>
        <v-skeleton-loader type="table-row@10" />
      </template>
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon
              icon="ri-user-location-line"
              start
            />
            <span v-if="!mobile">{{ t('game.player.online.tabName') }}</span>
          </v-toolbar-title>
          <v-btn
            prepend-icon="ri-refresh-line"
            :loading="getOnlinePlayersLoading"
            color="default"
            @click="getOnlinePlayers"
          >
            {{ t('platform.user.table.refresh') }}
          </v-btn>
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
      <template #item.prefab="{value}">
        <v-chip
          label
          color="success"
        >
          {{ getDstRoleName(value, globalStore.language) }}
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
    </v-data-table>
  </v-sheet>
</template>

<script setup>
import useGlobalStore from "@store/global.js"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import playerApi from "@/api/player.js"
import { getDstRoleName } from "@/utils/tools.js"
import { showSnackbar } from "@/utils/snackbar.js"

const props = defineProps({
  height: {
    type: Number,
    default: 0,
  },
})

const globalStore = useGlobalStore()
const { mobile } = useDisplay()
const { t } = useI18n()

const onlinePlayers = ref([])
const getOnlinePlayersLoading = ref(false)

const getOnlinePlayers = () => {
  getOnlinePlayersLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
  }

  playerApi.online.get(reqForm).then(response => {
    onlinePlayers.value = response.data || []
  }).finally(() => {
    getOnlinePlayersLoading.value = false
  })
}

const headers = [
  { key: 'uid', title: t('game.player.online.header.uid') },
  { key: 'nickname', title: t('game.player.online.header.nickname') },
  { key: 'prefab', title: t('game.player.online.header.prefab') },
  { key: 'actions', title: t('game.player.online.header.actions') },
]

const actionsLoading = ref(false)

const handleList = (uid, listType, actionType) => {
  actionsLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
    uid: uid,
    listType: listType,
    actionType: actionType,
  }

  playerApi.list.post(reqForm).then(response => {
    showSnackbar(response.message)
  }).finally(() => {
    actionsLoading.value = false
  })
}

onMounted(() => {
  getOnlinePlayers()
})
</script>

