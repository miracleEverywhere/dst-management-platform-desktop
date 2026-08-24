<template>
  <check
    :category="['game', 'room']"
    :other-height="otherHeight"
  >
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
  </check>
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
const otherHeight = 160

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
  return Math.max(2, Math.floor(windowHeight.value - otherHeight))
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


