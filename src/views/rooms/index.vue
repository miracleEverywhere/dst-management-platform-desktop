<template>
  <template v-if="globalStore.gameVersion.local!==0">
    <div class="fcc">
      <v-text-field
        v-model="reqForm.gameName"
        :label="t('rooms.header.input.label')"
        append-inner-icon="ri-search-line"
        class="mr-4"
        :loading="getRoomsLoading"
        @click:append-inner="getRooms"
        @keyup.enter="getRooms"
      />
      <v-btn
        v-if="!mobile"
        :disabled="!userStore.userInfo.roomCreation&&userStore.userInfo.role!=='admin'"
        prepend-icon="ri-add-line"
        variant="elevated"
        size="large"
        class="mr-4"
        @click="gotoGameBase"
      >
        {{ t('rooms.header.button.create') }}
      </v-btn>
      <v-btn
        v-if="!mobile"
        prepend-icon="ri-refresh-line"
        color="default"
        variant="elevated"
        size="large"
        @click="getRooms"
      >
        {{ t('rooms.header.button.refresh') }}
      </v-btn>
      <v-btn
        v-if="mobile"
        :disabled="!userStore.userInfo.roomCreation&&userStore.userInfo.role!=='admin'"
        icon="ri-add-line"
        class="mr-4"
        @click="gotoGameBase"
      />
      <v-btn
        v-if="mobile"
        icon="ri-refresh-line"
        color="default"
        @click="getRooms"
      />
    </div>
    <v-row class="mt-8">
      <v-row class="mx-1">
        <v-col
          v-for="(room, index) in rooms"
          :key="index"
          :cols="mobile?12:6"
        >
          <v-card
            :ref="el => { if (index === 0) cardRef = el }"
            hover
            variant="flat"
            height="300px"
          >
            <v-card-title>
              <div class="fcb">
                <div class="fcc">
                  <v-chip color="primary">
                    {{ truncateString(room.gameName, mobile?8:15) }}
                  </v-chip>
                  <v-chip
                    :color="room.status?'success':'warning'"
                    class="ml-4"
                  >
                    {{ room.status?t('rooms.card.success.header.title.activated'):t('rooms.card.success.header.title.deactivated') }}
                  </v-chip>
                  <v-icon
                    v-if="globalStore.room.id===room.id"
                    icon="ri-crosshair-2-line"
                    color="info"
                    class="ml-4"
                  />
                </div>
                <v-menu>
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      :disabled="getRoomsLoading"
                      :loading="activateLoading||deactivateLoading"
                      color="primary"
                      icon="ri-more-2-line"
                    />
                  </template>
                  <v-list>
                    <v-list-item
                      class="text-success"
                      @click="gotoDashboard(room)"
                    >
                      <template #prepend>
                        <v-icon
                          icon="ri-checkbox-circle-line"
                          size="22"
                        />
                      </template>
                      <v-list-item-title>
                        {{ t('rooms.card.success.header.menu.select') }}
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      class="text-success"
                      :disabled="room.status"
                      @click="handleAction('activate', room)"
                    >
                      <template #prepend>
                        <v-icon
                          icon="ri-play-large-line"
                          size="22"
                        />
                      </template>
                      <v-list-item-title>
                        {{ t('rooms.card.success.header.menu.activate') }}
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      class="text-warning"
                      :disabled="!room.status"
                      @click="handleAction('deactivate', room)"
                    >
                      <template #prepend>
                        <v-icon
                          icon="ri-stop-large-line"
                          color="warning"
                          size="22"
                        />
                      </template>
                      <v-list-item-title>
                        {{ t('rooms.card.success.header.menu.deactivate') }}
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      class="text-error"
                      :disabled="userStore.userInfo.role!=='admin'"
                      @click="handleAction('delete', room)"
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
              </div>
            </v-card-title>
            <v-card-text v-ripple>
              <div
                v-if="room.gameName!==''"
                class="mt-4"
                @click="selectRoom(room)"
              >
                <v-row>
                  <v-col :cols="mobile?12:6">
                    <v-row>
                      <v-col cols="6">
                        <span>
                          {{ t('rooms.card.success.text.left.gameMode') }}
                        </span>
                      </v-col>
                      <v-col cols="6">
                        <v-chip
                          color="info"
                          label
                        >
                          {{ t(`game.base.step1.gameMode.modes.${room.gameMode}`) }}
                        </v-chip>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="6">
                        <span>
                          {{ t('rooms.card.success.text.left.worldNum') }}
                        </span>
                      </v-col>
                      <v-col cols="6">
                        <v-chip
                          color="info"
                          label
                        >
                          {{ room.worlds.length }}
                        </v-chip>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="6">
                        <span>
                          {{ t('rooms.card.success.text.left.modNum') }}
                        </span>
                      </v-col>
                      <v-col cols="6">
                        <v-chip
                          color="info"
                          label
                        >
                          {{ room.modInOne?parseModLua(room.modData).length:parseModLua(room.worlds[0].modData).length }}
                        </v-chip>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="6">
                        <span>
                          {{ t('rooms.card.success.text.left.playerNum') }}
                        </span>
                      </v-col>
                      <v-col cols="6">
                        <v-chip
                          color="info"
                          label
                        >
                          {{ room.maxPlayer }}
                        </v-chip>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col
                    v-if="!mobile"
                    :cols="mobile?12:6"
                  >
                    <v-card
                      :height="240"
                      variant="flat"
                    >
                      <template #prepend>
                        <v-icon
                          color="primary"
                          class="me-8"
                          icon="ri-line-chart-line"
                          size="48"
                        />
                      </template>
                      <template #title>
                        <div class="text-caption text-grey">
                          {{ t('rooms.card.success.text.right.chartTitle') }}
                        </div>
                        <span class="text-h3 font-weight-black">
                          <count-to
                            :duration="4000"
                            :end-val="Math.max(...generatePlayerList(room.players))"
                            :start-val="0"
                          />
                        </span>
                        <strong>{{ t('rooms.card.success.text.right.unit') }}</strong>
                      </template>
                      <v-sheet color="transparent">
                        <v-sparkline
                          :width="mobile?cardWidth:(cardWidth/2)"
                          :gradient="['#1feaea']"
                          :line-width="3"
                          :model-value="generatePlayerList(room.players)"
                          smooth
                          padding="8"
                          stroke-linecap="round"
                          auto-draw
                        />
                      </v-sheet>
                    </v-card>
                  </v-col>
                </v-row>
              </div>

              <div v-else>
                <result
                  type="warning"
                  :height="mobile?600:300"
                  :title="t('rooms.card.warning.title')"
                  :sub-title="t('rooms.card.warning.subTitle')"
                />
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-row>
    <v-pagination
      v-if="total > reqForm.pageSize"
      v-model="reqForm.page"
      :length="Math.max(1, Math.ceil(total/reqForm.pageSize))"
      class="mt-8"
      @update:model-value="getRooms"
    />
    <div v-if="rooms.length===0&&reqForm.gameName!==''">
      <result
        type="warning"
        :height="calculateContainerSize() - 72"
        :title="t('rooms.result.noResult.title')"
        :sub-title="t('rooms.result.noResult.subTitle')"
      />
    </div>
    <div v-if="rooms.length===0&&reqForm.gameName===''">
      <result
        type="warning"
        :height="calculateContainerSize() - 72"
        :title="t('rooms.result.noRoom.title')"
        :sub-title="t('rooms.result.noRoom.subTitle')"
      />
    </div>
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
import roomApi from "@/api/room"
import { useDisplay } from "vuetify"
import { CountTo } from "vue3-count-to"
import useUserStore from "@store/user"
import useGlobalStore from "@store/global"
import { useI18n } from "vue-i18n"
import { debounce, parseModLua, truncateString } from "@/utils/tools"
import { showSnackbar } from "@/utils/snackbar"
import { useRouter } from "vue-router"
import eventBus from '@/utils/eventBus'


const { mobile } = useDisplay()
const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const globalStore = useGlobalStore()

const windowHeight = ref(window.innerHeight)

const calculateCardSize = () => {
  // 64(navbar) + 48(margin) + 44(pagination) + 24 * 2(card margins) = 204
  const usedHeight = 204
  const cardHeight = 300
  
  return Math.max(2, Math.floor((windowHeight.value - usedHeight) / cardHeight) * 2)
}

const reqForm = ref({
  gameName: '',
  page: 1,
  pageSize: 0,
})

const rooms = ref([])
const total = ref(0)
const getRoomsLoading = ref(false)

const getRooms = async () => {
  getRoomsLoading.value = true

  const response = await roomApi.list.get(reqForm.value)

  rooms.value = response.data.rows || []
  total.value = response.data.total
  getRoomsLoading.value = false
}

const handleCreate = async event => {
  createLoading.value = true

  const results = await event
  if (!results.valid) {
    createLoading.value = false
    
    return
  }
  roomApi.base.post(createForm.value).then(response => {
    createDialog.value = false
    getRooms()
    showSnackbar(response.message)
  }).finally(() => {
    createLoading.value = false
  })
}

const gotoGameBase = async () => {
  globalStore.room = {
    id: 0,
    gameName: '',
  }
  toggleMenu()
  await router.push('/game/base')
}

const toggleMenu = () => {
  eventBus.emit('toggleMenu', 3)
}

const selectRoom = room => {
  globalStore.room.id = room.id
  globalStore.room.gameName = room.gameName
}

const gotoDashboard = async room => {
  globalStore.room.id = room.id
  globalStore.room.gameName = room.gameName
  await router.push('/dashboard')
}

const generatePlayerList = players => {
  if (players.length === 0) {
    return [0, 0]
  }
  const pc = []
  for (let p of players) {
    pc.push(p.playerInfo?.length || 0)
  }

  return pc
}

const handleAction = (actionType, row) => {
  switch (actionType) {
  case 'activate':
    activate(row)
    break
  case 'deactivate':
    deactivate(row)
    break
  case 'delete':
    deleteRoomID.value = row.id
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
    getRooms()
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
    getRooms()
  }).finally(() => {
    deactivateLoading.value = false
  })
}

const deleteRoomLoading = ref(false)
const deleteRoomID = ref(0)
const confirmVisible = ref(false)

const deleteRoom = () => {
  deleteRoomLoading.value = true

  const reqForm = {
    roomID: deleteRoomID.value,
  }

  roomApi.base.delete(reqForm).then(response => {
    confirmVisible.value = false
    showSnackbar(response.message)
    getRooms()
    if (globalStore.room.id === deleteRoomID.value) {
      globalStore.room.id = 0
    }
  }).finally(() => {
    deleteRoomLoading.value = false
  })
}

const cardRef = ref()
const cardWidth = ref(0)

const calculateContainerSize = () => {
  // 64(navbar) + 72(step header) + 54(step action) + 24(card margins) = 304
  const other = 120

  return Math.max(2, Math.floor(windowHeight.value - other))
}

watch(windowHeight, () => {
  getRooms()
}, { immediate: false })

const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
  reqForm.value.pageSize = calculateCardSize()
  if (cardRef.value) {
    cardWidth.value = cardRef.value.$el.offsetWidth
  }
}, 200)

onMounted(async () => {
  reqForm.value.pageSize = calculateCardSize()
  await getRooms()
  if (cardRef.value) {
    cardWidth.value = cardRef.value.$el.offsetWidth
  }
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

