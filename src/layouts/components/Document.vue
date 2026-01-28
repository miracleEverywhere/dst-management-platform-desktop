<template>
  <v-btn
    v-tooltip="t('global.document')"
    icon="ri-book-marked-line"
    color="default"
    variant="text"
    rel="noopener noreferrer"
    @click="openDocument"
  />
</template>

<script setup>
import { useI18n } from "vue-i18n"
import ElectronApi from "@/utils/electronApi"

const { t } = useI18n()

const openDocument = () => {
  ElectronApi.browser.open("https://miraclesses.top/")
}
</script>

