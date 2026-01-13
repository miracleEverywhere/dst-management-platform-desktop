<template>
  <v-btn
    v-tooltip="t('global.backEntry')"
    icon="ri-logout-box-r-line"
    color="default"
    variant="text"
    @click="handleOut"
  />
</template>

<script setup>
import ElectronApi from "@/utils/electronApi"
import useUserStore from '@store/user'
import { useI18n } from "vue-i18n"
import useGlobalStore from "@store/global"


const { t } = useI18n()
const userStore = useUserStore()
const globalStore = useGlobalStore()

const handleOut = () => {
  globalStore.entry = {
    ip: '',
    port: '',
    token: '',
    inEntry: true,
  }
  userStore.clearStore()
  ElectronApi.window.entry()
}
</script>
