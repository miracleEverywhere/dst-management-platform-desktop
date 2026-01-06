<template>
  <!-- 游戏是否安装 -->
  <template v-if="globalStore.gameVersion.local!==0">
    <!-- 房间是否选择 -->
    <template v-if="globalStore.room.id!==0">
      <v-card :height="calculateHeight()">
        <v-card-text>
          <result
            :height="calculateHeight()"
            type="info"
            :title="t('logs.download.title')"
            :sub-title="t('logs.download.subTitle')"
          >
            <v-btn
              :loading="downloadLoading"
              class="mt-4"
              @click="downloadLog"
            >
              {{ t('logs.download.button') }}
            </v-btn>
          </result>
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
import logsApi from "@/api/logs"
import useGlobalStore from "@store/global.js"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import { debounce } from "@/utils/tools"
import useUserStore from "@store/user"


const globalStore = useGlobalStore()
const userStore = useUserStore()
const { mobile } = useDisplay()
const { t } = useI18n()

const downloadLoading = ref(false)

const downloadLog = () => {
  downloadLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
  }

  logsApi.download.download(reqForm, "logs.zip").finally(() => {
    downloadLoading.value = false
  })
}

const calculateHeight = () => {
  return Math.max(2, Math.floor(windowHeight.value - 160))
}

const windowHeight = ref(window.innerHeight)

const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
}, 200)

onMounted(async () => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>


