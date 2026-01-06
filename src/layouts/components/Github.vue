<template>
  <v-btn
    v-tooltip="t('global.github')"
    icon="ri-github-line"
    color="default"
    variant="text"
    href="https://github.com/miracleEverywhere/dst-management-platform-api"
    target="_blank"
    rel="noopener noreferrer"
  />
</template>

<script setup>
import { useI18n } from "vue-i18n"

const { t } = useI18n()
</script>

