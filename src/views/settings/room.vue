<template>
  <template v-if="!isMultiHost">
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-item title="房间设置" :value="0" :color="step>0?'success':''"
                        :complete="step>0" icon="ri-number-1">
        </v-stepper-item>
        <v-divider></v-divider>

        <v-stepper-item title="地面设置" :value="1" :color="step>1?'success':''"
                        :complete="step>1" icon="ri-number-2"></v-stepper-item>
        <v-divider></v-divider>

        <v-stepper-item title="洞穴设置" :value="2" :color="step>2?'success':''"
                        :complete="step>2" icon="ri-number-3"></v-stepper-item>
        <v-divider></v-divider>

        <v-stepper-item title="模组设置" :value="3" :color="step>3?'success':''"
                        :complete="step>3" icon="ri-number-4"></v-stepper-item>
        <v-divider></v-divider>

        <v-stepper-item title="设置完成" :value="4" :color="step>4?'success':''"
                        :complete="step>4" icon="ri-number-5"></v-stepper-item>
      </v-stepper-header>

      <v-stepper-window v-model="step">
        <v-stepper-window-item :value="0">
          0
        </v-stepper-window-item>
        <v-stepper-window-item :value="1">
          1
        </v-stepper-window-item>
        <v-stepper-window-item :value="2">
          2
        </v-stepper-window-item>
        <v-stepper-window-item :value="3">
          3
        </v-stepper-window-item>
        <v-stepper-window-item :value="4">
          4
        </v-stepper-window-item>
      </v-stepper-window>

      <v-stepper-actions>
        <template #prev>
          <v-btn @click="step--" variant="tonal" color="grey-lighten-3">上一步</v-btn>
        </template>
        <template #next>
          <v-btn @click="step++" variant="tonal" color="primary">下一步</v-btn>
        </template>
      </v-stepper-actions>
    </v-stepper>
  </template>
  <template v-if="isMultiHost">
    <v-stepper>
      <v-stepper-header>
        <v-stepper-item title="Select campaign settings" value="1"></v-stepper-item>
        <v-divider></v-divider>

        <v-stepper-item title="Create an ad group" value="2"></v-stepper-item>
        <v-divider></v-divider>

        <v-stepper-item title="Create an ad" value="3"></v-stepper-item>
      </v-stepper-header>
    </v-stepper>
  </template>
</template>

<script setup>
import settingApi from "@/api/setting.js"

onMounted(async () => {
  await getMultiHost()
  await handleGetCurrentRoomSetting()
})

const isMultiHost = ref(false)
const getMultiHost = async () => {
  await settingApi.multihost.get().then(response => {
    isMultiHost.value = response.data
  })
}

const step = ref(0)

const handleGetCurrentRoomSetting = () => {
  settingApi.room.get().then(response => {
    roomBaseForm.value = response.data.base
    roomGroundForm.value.groundSetting = response.data.ground
    roomCaveForm.value.caveSetting = response.data.cave
    roomModForm.value.modSetting = response.data.mod
    if (roomGroundForm.value.groundSetting === "") {
      multiHostIsMaster.value = false
    } else {
      if (roomCaveForm.value.caveSetting === "") {
        multiHostIsMaster.value = true
      } else {
        multiHostIsMaster.value = true
      }
    }
    if (roomBaseForm.value.masterPort === 0) {
      roomBaseForm.value.masterPort = 11000
    }
    if (roomBaseForm.value.cavesPort === 0) {
      roomBaseForm.value.cavesPort = 11001
    }
  })
}
</script>

<style scoped>
</style>