<template>
  <v-btn
    v-tooltip="t('global.github')"
    icon="ri-github-line"
    color="default"
    variant="text"
    rel="noopener noreferrer"
    @click="openGithub"
  />
</template>

<script setup>
import { useI18n } from "vue-i18n"
import ElectronApi from "@/utils/electronApi"

const { t } = useI18n()

const openGithub = () => {
  ElectronApi.browser.open("https://github.com/miracleEverywhere/dst-management-platform-desktop")
}
</script>

