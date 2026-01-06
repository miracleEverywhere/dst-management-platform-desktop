<template>
  <!-- 游戏是否安装 -->
  <template v-if="globalStore.gameVersion.local!==0">
    <!-- 房间是否选择 -->
    <template v-if="globalStore.room.id!==0">
      <v-card :height="calculateHeight()">
        <v-card-title>
          <div class="card-header">
            <span>
              {{ t('logs.clean.title') }}
            </span>
            <div>
              <v-btn
                v-if="!mobile"
                color="info"
                class="mr-2"
                @click="selectedLog=[0, 1, 2, 3, 4]"
              >
                {{ t('logs.clean.selectAll') }}
              </v-btn>
              <v-btn
                color="error"
                class="mr-2"
                @click="handleClean"
              >
                {{ t('logs.clean.delete') }}
              </v-btn>
              <v-btn
                color="default"
                :loading="getCleanInfoLoading"
                @click="getCleanInfo"
              >
                {{ t('logs.clean.refresh') }}
              </v-btn>
            </div>
          </div>
        </v-card-title>
        <v-card-text>
          <v-item-group
            v-model="selectedLog"
            multiple
          >
            <v-container
              :height="calculateHeight()-70"
              style="overflow-y: auto"
            >
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-item v-slot="{ isSelected, toggle }">
                    <v-card @click="toggle">
                      <div class="card-header mr-4 my-4">
                        <div class="ma-4 d-flex align-center">
                          <v-chip
                            label
                            class="mr-4"
                          >
                            {{ t('logs.clean.game') }}
                          </v-chip>
                          <span>
                            {{ formatBytes(cleanInfo.game) }}
                          </span>
                        </div>
                        <v-chip
                          v-if="!isSelected"
                          color="info"
                        >
                          {{ t('logs.clean.select') }}
                        </v-chip>
                        <v-chip
                          v-if="isSelected"
                          color="success"
                        >
                          {{ t('logs.clean.selected') }}
                        </v-chip>
                      </div>
                    </v-card>
                  </v-item>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-item v-slot="{ isSelected, toggle }">
                    <v-card @click="toggle">
                      <div class="card-header mr-4 my-4">
                        <div class="ma-4 d-flex align-center">
                          <v-chip
                            label
                            class="mr-4"
                          >
                            {{ t('logs.clean.chat') }}
                          </v-chip>
                          <span>
                            {{ formatBytes(cleanInfo.chat) }}
                          </span>
                        </div>
                        <v-chip
                          v-if="!isSelected"
                          color="info"
                        >
                          {{ t('logs.clean.select') }}
                        </v-chip>
                        <v-chip
                          v-if="isSelected"
                          color="success"
                        >
                          {{ t('logs.clean.selected') }}
                        </v-chip>
                      </div>
                    </v-card>
                  </v-item>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-item v-slot="{ isSelected, toggle }">
                    <v-card @click="toggle">
                      <div class="card-header mr-4 my-4">
                        <div class="ma-4 d-flex align-center">
                          <v-chip
                            label
                            class="mr-4"
                          >
                            {{ t('logs.clean.steam') }}
                          </v-chip>
                          <span>
                            {{ formatBytes(cleanInfo.steam) }}
                          </span>
                        </div>
                        <v-chip
                          v-if="!isSelected"
                          color="info"
                        >
                          {{ t('logs.clean.select') }}
                        </v-chip>
                        <v-chip
                          v-if="isSelected"
                          color="success"
                        >
                          {{ t('logs.clean.selected') }}
                        </v-chip>
                      </div>
                    </v-card>
                  </v-item>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-item v-slot="{ isSelected, toggle }">
                    <v-card @click="toggle">
                      <div class="card-header mr-4 my-4">
                        <div class="ma-4 d-flex align-center">
                          <v-chip
                            label
                            class="mr-4"
                          >
                            {{ t('logs.clean.access') }}
                          </v-chip>
                          <span>
                            {{ formatBytes(cleanInfo.access) }}
                          </span>
                        </div>
                        <v-chip
                          v-if="!isSelected"
                          color="info"
                        >
                          {{ t('logs.clean.select') }}
                        </v-chip>
                        <v-chip
                          v-if="isSelected"
                          color="success"
                        >
                          {{ t('logs.clean.selected') }}
                        </v-chip>
                      </div>
                    </v-card>
                  </v-item>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-item v-slot="{ isSelected, toggle }">
                    <v-card @click="toggle">
                      <div class="card-header mr-4 my-4">
                        <div class="ma-4 d-flex align-center">
                          <v-chip
                            label
                            class="mr-4"
                          >
                            {{ t('logs.clean.runtime') }}
                          </v-chip>
                          <span>
                            {{ formatBytes(cleanInfo.runtime) }}
                          </span>
                        </div>
                        <v-chip
                          v-if="!isSelected"
                          color="info"
                        >
                          {{ t('logs.clean.select') }}
                        </v-chip>
                        <v-chip
                          v-if="isSelected"
                          color="success"
                        >
                          {{ t('logs.clean.selected') }}
                        </v-chip>
                      </div>
                    </v-card>
                  </v-item>
                </v-col>
              </v-row>
            </v-container>
          </v-item-group>
        </v-card-text>
      </v-card>
    </template>
    <template v-else>
      <result
        :title="t('global.noRoomSelected.title')"
        :sub-title="t('global.noRoomSelected.subTitle')"
        type="error"
        :height="calculateHeight()"
      >
        <v-btn
          to="/rooms"
          class="mt-4"
        >
          {{ t('global.noRoomSelected.button') }}
        </v-btn>
      </result>
    </template>
  </template>
  <template v-else>
    <result
      v-if="userStore.userInfo.role==='admin'"
      :title="t('global.noGame.title')"
      :sub-title="t('global.noGame.subTitle')"
      :height="calculateHeight()"
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
      :height="calculateHeight()"
      type="error"
    />
  </template>
</template>

<script setup>
import useGlobalStore from "@store/global"
import useUserStore from "@store/user"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import { debounce, formatBytes } from "@/utils/tools"
import logsApi from "@/api/logs"
import { showSnackbar } from "@/utils/snackbar"

const globalStore = useGlobalStore()
const userStore = useUserStore()
const { mobile } = useDisplay()
const { t } = useI18n()

const cleanInfo = ref({
  game: 0,
  chat: 0,
  steam: 0,
  access: 0,
  runtime: 0,
})

const getCleanInfoLoading = ref(false)

const getCleanInfo = () => {
  const reqForm = {
    roomID: globalStore.room.id,
  }

  getCleanInfoLoading.value = true
  logsApi.clean.info.get(reqForm).then(response => {
    selectedLog.value = []
    cleanInfo.value = response.data
  }).finally(() => {
    getCleanInfoLoading.value = false
  })
}

const selectedLog = ref([])

const cleanLoading = ref(false)

const handleClean = () => {
  if (selectedLog.value.length === 0) {
    showSnackbar(t('logs.clean.noSelected'), "error")
    
    return
  }
  cleanLoading.value = true

  const reqFrom = {
    roomID: globalStore.room.id,
    game: selectedLog.value.includes(0),
    chat: selectedLog.value.includes(1),
    steam: selectedLog.value.includes(2),
    access: selectedLog.value.includes(3),
    runtime: selectedLog.value.includes(4),
  }

  logsApi.clean.delete(reqFrom).then(response => {
    showSnackbar(response.message)
    selectedLog.value = []
    getCleanInfo()
  }).finally(() => {
    cleanLoading.value = false
  })
}

const calculateHeight = () => {
  return Math.max(2, Math.floor(windowHeight.value - 120))
}

const windowHeight = ref(window.innerHeight)

const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
}, 200)

onMounted(async () => {
  if (globalStore.room.id === 0) {
    return
  }
  getCleanInfo()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
