<template>
  <template v-if="globalStore.gameVersion.local!==0">
    <template v-if="globalStore.room.name===''">
      <result
        type="error"
        :title="t('global.noRoomSelected.title')"
        :sub-title="t('global.noRoomSelected.subTitle')"
        :height="calculateContainerSize()"
      />
    </template>
    <template v-else>
      <v-stepper v-model="step">
        <v-stepper-header>
          <v-stepper-item
            :color="step > 0 ? 'success' : ''"
            :complete="step > 0"
            :value="0"
            :title="t('game.header.step1')"
          >
            <template #icon>
              <v-icon
                icon="ri-number-1"
                size="12"
              />
            </template>
          </v-stepper-item>
          <v-divider />

          <v-stepper-item
            :color="step > 1 ? 'success' : ''"
            :complete="step > 1"
            :value="1"
            :title="t('game.header.step2')"
          >
            <template #icon>
              <v-icon
                icon="ri-number-2"
                size="12"
              />
            </template>
          </v-stepper-item>
          <v-divider />

          <v-stepper-item
            :color="step > 2 ? 'success' : ''"
            :complete="step > 2"
            :value="2"
            :title="t('game.header.step3')"
          >
            <template #icon>
              <v-icon
                icon="ri-number-3"
                size="12"
              />
            </template>
          </v-stepper-item>
          <v-divider />

          <v-stepper-item
            :color="step > 3 ? 'success' : ''"
            :complete="step > 3"
            :value="3"
            :title="t('game.header.step4')"
          >
            <template #icon>
              <v-icon
                icon="ri-number-4"
                size="12"
              />
            </template>
          </v-stepper-item>
          <v-divider />

          <v-stepper-item
            :color="step > 4 ? 'success' : ''"
            :complete="step > 4"
            :value="4"
            :title="t('game.header.step5')"
          >
            <template #icon>
              <v-icon
                icon="ri-number-5"
                size="12"
              />
            </template>
          </v-stepper-item>
        </v-stepper-header>

        <v-stepper-window
          v-model="step"
          class="mt-4"
        >
          <v-stepper-window-item :value="0">
            <v-container
              v-if="dataGot&&step===0"
              :height="calculateContainerSize()"
              style="overflow-y: auto"
            >
              <room
                ref="roomRef"
                :room-count="roomCount"
                :max-players="userStore.userInfo.role==='admin'?0:userStore.userInfo.maxPlayers"
                :form-data="roomData"
              />
            </v-container>
            <result
              v-else
              type="info"
              :title="t('game.base.loading')"
              :height="calculateContainerSize()"
            />
          </v-stepper-window-item>
          <v-stepper-window-item :value="1">
            <v-container
              v-if="dataGot&&step===1"
              :height="calculateContainerSize()"
              style="overflow-y: auto"
            >
              <world
                ref="worldRef"
                :world-count="worldCount"
                :form-data="worldData"
                :game-mode="roomData.gameMode"
                :max-worlds="userStore.userInfo.role==='admin'?0:userStore.userInfo.maxWorlds"
                :theme="globalStore.theme"
                :tab-window-height="calculateContainerSize()-300"
              />
            </v-container>
            <result
              v-else
              type="info"
              :title="t('game.base.loading')"
              :height="calculateContainerSize()"
            />
          </v-stepper-window-item>
          <v-stepper-window-item :value="2">
            <v-container
              v-if="dataGot&&step===2"
              :height="calculateContainerSize()"
              style="overflow-y: auto"
            >
              <mod
                ref="modRef"
                :worlds="worldData"
                :mod="roomData.modData"
                :mod-in-one="roomData.modInOne"
                :theme="globalStore.theme"
                :tab-window-height="calculateContainerSize()-110"
              />
            </v-container>
            <result
              v-else
              type="info"
              :title="t('game.base.loading')"
              :height="calculateContainerSize()"
            />
          </v-stepper-window-item>
          <v-stepper-window-item :value="3">
            <v-container
              v-if="dataGot&&step===3"
              :height="calculateContainerSize()"
              style="overflow-y: auto"
            >
              <room-setting
                ref="roomSettingRef"
                :room-setting="roomSettingData"
              />
            </v-container>
            <result
              v-else
              type="info"
              :title="t('game.base.loading')"
              :height="calculateContainerSize()"
            />
          </v-stepper-window-item>
          <v-stepper-window-item :value="4">
            <result
              v-if="step===4"
              type="success"
              :height="calculateContainerSize()"
              :title="t('game.base.step5.title')"
              :sub-title="t('game.base.step5.subTitle')"
            />
          </v-stepper-window-item>
        </v-stepper-window>

        <v-stepper-actions class="mx-8">
          <template #prev>
            <v-btn
              :disabled="step===0"
              color="grey-lighten-3"
              variant="elevated"
              @click="handlePrev"
            >
              {{ t('game.prev') }}
            </v-btn>
          </template>
          <template #next>
            <v-btn
              v-if="step!==4"
              color="primary"
              variant="elevated"
              @click="handleNext"
            >
              {{ t('game.next.button') }}
            </v-btn>
            <v-btn
              v-if="step===4"
              color="success"
              :disabled="false"
              :loading="saveButtonLoading"
              variant="elevated"
              @click="handleSave"
            >
              {{ t('game.next.save') }}
            </v-btn>
          </template>
        </v-stepper-actions>
      </v-stepper>
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
import { debounce } from "@/utils/tools.js"
import useUserStore from "@store/user.js"
import useGlobalStore from "@store/global.js"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import room from "@/views/game/components/base/room.vue"
import world from "@/views/game/components/base/world.vue"
import mod from "@/views/game/components/base/mod.vue"
import roomSetting from "@/views/game/components/base/roomSetting.vue"
import roomApi from "@/api/room.js"
import { showSnackbar } from "@/utils/snackbar.js"
import { useRouter } from "vue-router"

const windowHeight = ref(window.innerHeight)
const userStore = useUserStore()
const globalStore = useGlobalStore()
const { mobile } = useDisplay()
const router = useRouter()
const { t } = useI18n()


// 判断是否获取到接口数据，为了component回显
const dataGot = ref(false)

// 不重复的生成相关端口
const roomCount = ref(0)
const worldCount = ref(0)

const getRoomTotalInfo = async () => {
  if (globalStore.room.id !== 0) {
    const response = await roomApi.base.get({ id: globalStore.room.id })

    roomData.value = response.data.roomData
    worldData.value = response.data.worldData
    DBToRoomSetting(response.data.roomSettingData)
  }
}

const getCount = async () => {
  const response = await roomApi.factor.get()

  roomCount.value = response.data.roomCount
  worldCount.value = response.data.worldCount
}


const step = ref(0)

const calculateContainerSize = () => {
  // 64(navbar) + 72(step header) + 54(step action) + 24(card margins) = 304
  const other = 304

  return Math.max(2, Math.floor(windowHeight.value - other))
}

const handlePrev = () => {
  step.value--
}

const handleNext = async () => {
  if (step.value === 0) {
    if (roomRef.value) {
      const result = await roomRef.value.validate()
      if (result.validate) {
        roomData.value = result.formData
        step.value++
        
        return
      }
    }
  }
  if (step.value === 1) {
    if (worldRef.value) {
      const result = await worldRef.value.validate()
      if (result.validate) {
        worldData.value = result.formData
        step.value++
        
        return
      }
    }
  }
  if (step.value === 2) {
    if (modRef.value) {
      const result = await modRef.value.validate()
      if (result.validate) {
        modData.value = result.formData
        step.value++
        
        return
      }
    }
  }
  if (step.value === 3) {
    if (roomSettingRef.value) {
      const result = await roomSettingRef.value.validate()
      if (result.validate) {
        roomSettingData.value = result.formData
        step.value++
        
        return
      }
    }
  }
}

const roomRef = ref()

const roomData = ref({})

const worldRef = ref()
const worldData = ref([])

const modRef = ref()
const modData = ref()

const roomSettingRef = ref()
const roomSettingData = ref({})

const roomSettingToDB = () => {
  return {
    roomID: 0,
    backupEnable: roomSettingData.value.backup.enable,
    backupSetting: JSON.stringify(roomSettingData.value.backup.setting),
    backupCleanEnable: roomSettingData.value.backupClean.enable,
    backupCleanSetting: roomSettingData.value.backupClean.setting,
    restartEnable: roomSettingData.value.restart.enable,
    restartSetting: roomSettingData.value.restart.setting,
    keepaliveEnable: roomSettingData.value.keepalive.enable,
    keepaliveSetting: roomSettingData.value.keepalive.setting,
    scheduledStartStopEnable: roomSettingData.value.scheduledStartStop.enable,
    scheduledStartStopSetting: JSON.stringify(roomSettingData.value.scheduledStartStop.setting),
    tickRate: roomSettingData.value.tickRate,
    startType: roomSettingData.value.startType,
    announceSetting: roomSettingData.value.announceSetting,
  }
}

const DBToRoomSetting = data => {
  roomSettingData.value = {
    backup: {
      enable: data.backupEnable,
      setting: JSON.parse(data.backupSetting),
    },
    backupClean: {
      enable: data.backupCleanEnable,
      setting: data.backupCleanSetting,
    },
    restart: {
      enable: data.restartEnable,
      setting: data.restartSetting,
    },
    keepalive: {
      enable: data.keepaliveEnable,
      setting: data.keepaliveSetting,
    },
    scheduledStartStop: {
      enable: data.scheduledStartStopEnable,
      setting: JSON.parse(data.scheduledStartStopSetting),
    },
    tickRate: data.tickRate,
    startType: data.startType,
    announceSetting: data.announceSetting,
  }
}

const saveButtonLoading = ref(false)

const refreshCurrentPage = inject("refresh")

const reloadPage = () => {
  setTimeout(() => {
    refreshCurrentPage(false)
    nextTick(() => {
      refreshCurrentPage(true)
    })
  }, 0)
}

const handleSave = () => {
  const reqForm = {
    roomData: roomData.value,
    worldData: worldData.value,
    roomSettingData: roomSettingToDB(),
  }

  if (globalStore.room.id) {
    // 修改
    for (let i = 0; i < reqForm.worldData.length; i++) {
      if (modData.value.modInOne) {
        reqForm.roomData.modInOne = true
        reqForm.roomData.modData = modData.value.modData
      } else {
        reqForm.roomData.modInOne = false
        reqForm.worldData[i].modData = modData.value.worlds[i].modData
      }
      reqForm.worldData[i].roomID = globalStore.room.id
      delete reqForm.worldData[i].name
      delete reqForm.worldData[i].id
    }
    reqForm.roomSettingData.roomID = globalStore.room.id
    saveButtonLoading.value = true
    roomApi.base.put(reqForm).then(response => {
      showSnackbar(response.message)
      globalStore.room = {
        id: response.data.id,
        gameName: response.data.gameName,
      }
      reloadPage()
    }).finally(() => {
      saveButtonLoading.value = false
    })
  } else {
    // 创建
    for (let i = 0; i < reqForm.worldData.length; i++) {
      if (modData.value.modInOne) {
        reqForm.roomData.modInOne = true
        reqForm.roomData.modData = modData.value.modData
      } else {
        reqForm.roomData.modInOne = false
        reqForm.worldData[i].modData = modData.value.worlds[i].modData
      }
      reqForm.worldData[i]['id'] = 0
      delete reqForm.worldData[i].name
    }
    saveButtonLoading.value = true
    roomApi.base.post(reqForm).then(response => {
      showSnackbar(response.message)
      globalStore.room = {
        id: response.data.id,
        gameName: response.data.gameName,
      }
      reloadPage()
    }).finally(() => {
      saveButtonLoading.value = false
    })
  }
}

// 防抖处理resize事件
const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
}, 200)

onMounted(async () => {
  await Promise.all([getCount(), getRoomTotalInfo()])
  dataGot.value = true

  // 添加事件监听
  window.addEventListener('resize', handleResize)
})

// 在组件卸载时移除监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

