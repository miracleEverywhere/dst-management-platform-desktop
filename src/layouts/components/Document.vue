<template>
  <v-btn
    v-tooltip="t('global.document')"
    icon="ri-book-marked-line"
    color="default"
    variant="text"
    href="https://miraclesses.top/"
    target="_blank"
    rel="noopener noreferrer"
  />
</template>

<script setup>
import { useI18n } from "vue-i18n"

const { t } = useI18n()
</script>

