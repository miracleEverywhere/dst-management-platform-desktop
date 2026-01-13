<template>
  <v-btn
    v-tooltip="t('global.refresh')"
    icon="ri-refresh-line"
    color="default"
    variant="text"
    @click="ElectronApi.window.reload()"
  />
</template>

<script setup>
import ElectronApi from "@/utils/electronApi"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
</script>
