<template>
  <v-card
    hover
    variant="flat"
    height="135"
    class="cursor-auto"
  >
    <div
      class="fcc"
      style="height: 135px"
    >
      <div style="width: 80px; height: 80px">
        <v-img
          :src="props.mod.preview_url"
          cover
          rounded
          aspect-ratio="1"
        >
          <template #placeholder>
            <div class="fcc fill-height">
              <v-progress-circular
                color="grey-lighten-4"
                indeterminate
              />
            </div>
          </template>
        </v-img>
      </div>
      <div style="width: 200px">
        <div class="fcc">
          <v-chip
            label
            size="small"
            color="primary"
          >
            {{ computedName }}
            <v-tooltip
              activator="parent"
              open-delay="300"
              scroll-strategy="close"
            >
              {{ props.mod.name }}
            </v-tooltip>
          </v-chip>
        </div>
        <div
          style="margin: 5px 0"
          class="fcc"
        >
          <precise-rating
            :value="computedRate"
            :length="5"
            show-actual-value
            size="24"
          />
        </div>
        <div class="fcc">
          <v-dialog
            v-model="dialogVisible"
            class="flex-wrap"
            max-width="60%"
          >
            <template #activator="{ props: activatorProps }">
              <v-btn
                color="info"
                density="compact"
                size="small"
                v-bind="activatorProps"
                class="mr-4"
                @click="dialogVisible=true"
              >
                {{ t('game.mod.download.modInfo.detail') }}
              </v-btn>
            </template>
            <template #default="{ isActive }">
              <v-card :title="props.mod.name">
                <v-card-text>
                  <v-table class="custom-table">
                    <tbody>
                      <tr>
                        <td
                          rowspan="2"
                          class="text-center"
                        >
                          <v-icon
                            icon="ri-image-line"
                            color="info"
                          />
                        </td>
                        <td
                          rowspan="2"
                          class="text-center"
                        >
                          <div
                            class="fcc my-2"
                            style="width: 100%; height: 150px"
                          >
                            <div style="width: 150px; height: 150px">
                              <v-img
                                :src="props.mod.preview_url"
                                cover
                                rounded
                                aspect-ratio="1"
                              >
                                <template #placeholder>
                                  <div class="d-flex align-center justify-center fill-height">
                                    <v-progress-circular
                                      color="grey-lighten-4"
                                      indeterminate
                                    />
                                  </div>
                                </template>
                              </v-img>
                            </div>
                          </div>
                        </td>
                        <td class="text-center">
                          ID
                        </td>
                        <td class="text-center">
                          <v-chip
                            color="info"
                            label
                          >
                            {{ props.mod.id }}
                          </v-chip>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-center">
                          {{ t('game.mod.download.modInfo.size') }}
                        </td>
                        <td class="text-center">
                          <v-chip
                            color="info"
                            label
                          >
                            {{ formatBytes(props.mod.size) }}
                          </v-chip>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-center">
                          <v-icon
                            icon="ri-thumb-up-fill"
                            color="success"
                          />
                        </td>
                        <td class="text-center">
                          <v-chip
                            color="success"
                            label
                          >
                            {{ props.mod.vote_data.votes_up }}
                          </v-chip>
                        </td>
                        <td class="text-center">
                          <v-icon
                            icon="ri-thumb-down-fill"
                            color="error"
                          />
                        </td>
                        <td class="text-center">
                          <v-chip
                            color="error"
                            label
                          >
                            {{ props.mod.vote_data.votes_down }}
                          </v-chip>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-center">
                          {{ t('game.mod.download.modInfo.createTime') }}
                        </td>
                        <td class="text-center">
                          <v-chip
                            color="success"
                            label
                          >
                            {{ timestamp2time(props.mod.time_created * 1000) }}
                          </v-chip>
                        </td>
                        <td class="text-center">
                          {{ t('game.mod.download.modInfo.updateTime') }}
                        </td>
                        <td class="text-center">
                          <v-chip
                            color="info"
                            label
                          >
                            {{ timestamp2time(props.mod.time_updated * 1000) }}
                          </v-chip>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-center">
                          {{ t('game.mod.download.modInfo.subscriptions') }}
                        </td>
                        <td
                          colspan="3"
                          class="text-center"
                        >
                          <v-chip
                            color="default"
                            label
                          >
                            {{ props.mod.subscriptions }}
                          </v-chip>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-center">
                          <v-icon
                            icon="ri-star-fill"
                            color="warning"
                          />
                        </td>
                        <td
                          colspan="3"
                          class="text-center"
                        >
                          <precise-rating
                            :value="computedRate"
                            :length="5"
                            :show-actual-value="true"
                            size="24"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                  <v-container height="30vh">
                    <div v-html="bbCodeParser.parse(props.mod.file_description)" />
                  </v-container>
                </v-card-text>
              </v-card>
            </template>
          </v-dialog>
          <v-btn
            color="success"
            density="compact"
            size="small"
            :loading="downloadLoading"
            @click="handleDownload"
          >
            {{ t('game.mod.download.modInfo.download') }}
          </v-btn>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { formatBytes, timestamp2time } from "@/utils/tools"

import modApi from "@/api/mod"
import { showSnackbar } from "@/utils/snackbar"
import PreciseRating from "@/components/PreciseRating.vue"
import bbCodeParser from 'js-bbcode-parser'
import { useI18n } from "vue-i18n"


const props = defineProps({
  mod: {
    type: Object,
    default: () => ({}),
  },
  roomID: {
    type: Number,
    default: 0,
  },
})

const { t } = useI18n()

const computedRate = computed(() => {
  return parseFloat((props.mod.vote_data.score * 5).toFixed(2))
})

const computedName = computed(() => {
  const maxStr = 20
  if (props.mod.name.length > maxStr) {
    return props.mod.name.slice(0, maxStr) + '...'
  }
  
  return props.mod.name
})

const dialogVisible = ref(false)
const downloadLoading = ref(false)

const handleDownload = () => {
  downloadLoading.value = true

  const reqFrom = {
    roomID: props.roomID,
    id: props.mod.id,
    // eslint-disable-next-line camelcase
    file_url: props.mod.file_url,
    update: false,
    size: props.mod.size,
    name: props.mod.name,
  }

  modApi.download.post(reqFrom).then(response => {
    showSnackbar(response.message)
  }).finally(() => {
    downloadLoading.value = false
  })
}
</script>

<style scoped>
.custom-table {
  border-collapse: collapse;
  width: 100%;
}

.custom-table th,
.custom-table td {
  border: 1px solid #e0e0e0;
  padding: 12px;
  text-align: left;
}

.custom-table th {
  background-color: #f5f5f5;
  font-weight: 500;
}

.custom-table tr:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>
