<template>
  <v-card variant="outlined" height="135" class="fcc">
    <div style="display: flex; align-items: center; margin: 5px; width:320px">
      <v-img :src="props.mod.preview_url" aspect-ratio="1" style="width: 80px; height: 80px"/>
      <div style="width: 200px">
        <div class="fcc">
            <v-chip label size="small" color="primary">
              {{computedName}}
              <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                {{props.mod.name}}
              </v-tooltip>
            </v-chip>
        </div>
        <div style="margin: 5px 0" class="fcc">
          <v-rating v-model="computedRate" size="28" readonly half-increments/>
          <span class="ml-2">{{computedRate}}</span>
        </div>
        <div class="fcc">
          <v-btn color="info" density="compact" size="small" @click="dialogVisible=true" class="mr-1">详情</v-btn>
          <v-btn color="success" density="compact" size="small" @click="handleDownload">下载</v-btn>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import {formatBytes} from "@/utils/tools.js"
import settingsApi from "@/api/setting"
import {showSnackbar} from "@/utils/snackbar";


const props = defineProps({
  mod: {
    type: Object,
    default: {}
  },
})

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

const handleDownload = () => {
  const reqFrom = {
    id: props.mod.id,
    file_url: props.mod.file_url
  }
  settingsApi.mod.download.post(reqFrom).then(response => {
    showSnackbar(response.message)
  })
}
</script>

<style scoped>
.custom-rating {
  position: relative;
  display: inline-flex;
}
.partial-star {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  white-space: nowrap;
}
.partial-star:nth-child(5) {
  left: calc(4 * 24px); /* 假设每颗星宽 24px */
}
</style>
