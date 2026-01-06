<template>
  <v-row>
    <v-col
      cols="12"
      md="6"
    >
      <v-card>
        <template #prepend>
          <v-icon
            color="primary"
            class="me-8"
            icon="ri-ram-2-line"
            size="48"
          />
          <span>
            {{ t('platform.overview.memory') }}
          </span>
        </template>
        <v-card-text class="d-flex justify-end">
          {{ formatBytes(overviewData.memory) }}
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-card>
        <template #prepend>
          <v-icon
            color="primary"
            class="me-8"
            icon="ri-time-line"
            size="48"
          />
          <span>
            {{ t('platform.overview.runningTime') }}
          </span>
        </template>
        <v-card-text class="d-flex justify-end">
          <time-running :seconds="overviewData.runningTime" />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-card>
        <template #prepend>
          <v-icon
            color="primary"
            class="me-8"
            icon="ri-instance-line"
            size="48"
          />
          <span>
            {{ t('platform.overview.roomCount') }}
          </span>
        </template>
        <v-card-text class="d-flex justify-end">
          <count-to
            :duration="4000"
            :end-val="overviewData.roomCount"
            :start-val="0"
          />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-card>
        <template #prepend>
          <v-icon
            color="primary"
            class="me-8"
            icon="ri-gamepad-line"
            size="48"
          />
          <span>
            {{ t('platform.overview.worldCount') }}
          </span>
        </template>
        <v-card-text class="d-flex justify-end">
          <count-to
            :duration="4000"
            :end-val="overviewData.worldCount"
            :start-val="0"
          />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-card>
        <template #prepend>
          <v-icon
            color="primary"
            class="me-8"
            icon="ri-group-line"
            size="48"
          />
          <span>
            {{ t('platform.overview.userCount') }}
          </span>
        </template>
        <v-card-text class="d-flex justify-end">
          <count-to
            :duration="4000"
            :end-val="overviewData.userCount"
            :start-val="0"
          />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-card>
        <template #prepend>
          <v-icon
            color="primary"
            class="me-8"
            icon="ri-id-card-line"
            size="48"
          />
          <span>
            {{ t('platform.overview.uidCount') }}
          </span>
        </template>
        <v-card-text class="d-flex justify-end">
          <count-to
            :duration="4000"
            :end-val="overviewData.uidCount"
            :start-val="0"
          />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-card>
        <template #prepend>
          <v-icon
            color="primary"
            class="me-8"
            icon="ri-cpu-line"
            size="48"
          />
          <span>
            {{ t('platform.overview.maxCpu') }}
          </span>
        </template>
        <v-card-text class="d-flex justify-end">
          {{ overviewData.maxCpu?overviewData.maxCpu.toFixed(2):overviewData.maxCpu }} %
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-card>
        <template #prepend>
          <v-icon
            color="primary"
            class="me-8"
            icon="ri-ram-line"
            size="48"
          />
          <span>
            {{ t('platform.overview.maxMemory') }}
          </span>
        </template>
        <v-card-text class="d-flex justify-end">
          {{ overviewData.maxMemory?overviewData.maxMemory.toFixed(2):overviewData.maxMemory }} %
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-card>
        <template #prepend>
          <v-icon
            color="primary"
            class="me-8"
            icon="ri-upload-line"
            size="48"
          />
          <span>
            {{ t('platform.overview.maxNetUp') }}
          </span>
        </template>
        <v-card-text class="d-flex justify-end">
          {{ overviewData.maxNetUp?overviewData.maxNetUp.toFixed(2):overviewData.maxNetUp }} KB/s
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-card>
        <template #prepend>
          <v-icon
            color="primary"
            class="me-8"
            icon="ri-download-line"
            size="48"
          />
          <span>
            {{ t('platform.overview.maxNetDown') }}
          </span>
        </template>
        <v-card-text class="d-flex justify-end">
          {{ overviewData.maxNetDown?overviewData.maxNetDown.toFixed(2):overviewData.maxNetDown }} KB/s
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import platformApi from "@/api/platform"
import { formatBytes } from "@/utils/tools"
import { CountTo } from "vue3-count-to"
import { useI18n } from "vue-i18n"


const { t } = useI18n()

const overviewData = ref({
  runningTime: undefined,
  memory: undefined,
  roomCount: undefined,
  worldCount: undefined,
  userCount: undefined,
  uidCount: undefined,
  maxCpu: undefined,
  maxMemory: undefined,
  maxNetUp: undefined,
  maxNetDown: undefined,
})

const overviewDataLoading = ref(false)

const getOverviewData = () => {
  overviewDataLoading.value = true
  platformApi.overview.get().then(response => {
    overviewData.value = response.data
  }).finally(() => {
    overviewDataLoading.value = false
  })
}

onMounted(() => {
  getOverviewData()
})
</script>

