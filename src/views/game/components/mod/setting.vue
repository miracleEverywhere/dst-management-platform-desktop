<template>
  <v-radio-group
    v-if="!modInOne"
    v-model="selectedWorldId"
    inline
    class="mb-2"
    @update:model-value="getEnabledMods"
  >
    <v-radio
      v-for="world in worldData"
      :label="world.worldName"
      :value="world.id"
      class="mr-4"
    />
  </v-radio-group>
  <v-row>
    <v-col
      cols="12"
      md="4"
    >
      <v-card
        :disabled="leftLoading"
        :loading="leftLoading"
      >
        <v-card-title>
          <div class="card-header">
            <span>{{ t('game.mod.setting.enabledMods') }}</span>
            <div>
              <v-btn
                v-if="!mobile"
                prepend-icon="ri-prohibited-2-line"
                color="error"
                variant="text"
                :loading="multiDisableLoading"
                @click="handleMultiDisable"
              >
                {{ t('game.mod.setting.multiDisable') }}
              </v-btn>
              <v-btn
                prepend-icon="ri-refresh-line"
                color="default"
                variant="text"
                :loading="leftLoading"
                @click="getEnabledMods"
              >
                {{ t('game.mod.setting.refresh') }}
              </v-btn>
            </div>
          </div>
        </v-card-title>
        <v-card-text>
          <v-container
            v-if="enabledMods.length!==0"
            :height="modInOne?props.height:props.height-48"
            style="overflow-y: auto"
          >
            <div
              v-for="(mod, idx) in enabledMods"
              style="height: 120px;"
            >
              <v-divider v-if="idx!==0" />
              <div class="fcc">
                <div
                  v-ripple
                  class="w-33 cursor-pointer"
                  @click="getModConfig(mod.id, selectedWorldId, mod.file_url, mod.name)"
                >
                  <v-img
                    v-if="mod.id!==0"
                    cover
                    rounded
                    :width="100"
                    :height="100"
                    aspect-ratio="1/1"
                    :src="mod.preview_url"
                    class="ma-2"
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
                  <v-img
                    v-else
                    :width="100"
                    :height="100"
                    aspect-ratio="1/1"
                    :src="`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(forbidLocalIcon)}`"
                    class="ma-2"
                  />
                </div>
                <div class="w-66 d-flex justify-start align-center ml-4">
                  <v-checkbox
                    v-if="!mobile"
                    v-model="selectedMod"
                    :value="mod.id"
                    class="mr-2"
                  />
                  <v-chip
                    v-if="mod.id!==0"
                    v-ripple
                    color="info"
                    label
                    @click="getModConfig(mod.id, selectedWorldId, mod.file_url, mod.name)"
                  >
                    {{ mod.name }}
                  </v-chip>
                  <v-chip
                    v-else
                    v-ripple
                    color="info"
                    label
                    @click="getModConfig(mod.id, selectedWorldId, mod.file_url, mod.name)"
                  >
                    {{ t('game.mod.setting.clientModsDisabled') }}
                  </v-chip>
                </div>
              </div>
            </div>
          </v-container>
          <v-container
            v-if="enabledMods.length===0&&!modInOne"
            :height="props.height-48"
            style="overflow-y: auto"
          >
            <result
              type="info"
              :title="t('game.mod.setting.tip.noEnabledMods')"
              :height="props.height-48-38"
            />
          </v-container>
          <v-container
            v-if="enabledMods.length===0&&modInOne"
            :height="props.height"
            style="overflow-y: auto"
          >
            <result
              type="info"
              :title="t('game.mod.setting.tip.noEnabledMods')"
              :height="props.height-48"
            />
          </v-container>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="8"
    >
      <div>
        <setting-form
          v-if="dataGot&&!rightLoading"
          :fields="modStruct"
          :initial-data="modValue"
          :height="modInOne?props.height:props.height-48"
          :title="modName"
          :room-i-d="globalStore.room.id"
          :world-i-d="currentWorldID"
          :mod-i-d="currentModID"
          @change="handleFormChange"
          @disable-refresh="getEnabledMods"
        />
        <v-card v-if="dataGot&&rightLoading">
          <v-card-text>
            <result
              v-if="modInOne"
              type="info"
              :title="t('game.mod.setting.tip.fetching')"
              :height="props.height+34"
            />
            <result
              v-else
              type="info"
              :title="t('game.mod.setting.tip.fetching')"
              :height="props.height-12"
            />
          </v-card-text>
        </v-card>
        <v-card v-if="!dataGot&&!rightLoading">
          <v-card-text>
            <result
              v-if="modInOne"
              type="info"
              :title="t('game.mod.setting.tip.selectMod')"
              :height="props.height+34"
            />
            <result
              v-else
              type="info"
              :title="t('game.mod.setting.tip.selectMod')"
              :height="props.height-12"
            />
          </v-card-text>
        </v-card>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue'
import SettingForm from '@/views/game/components/mod/settingForm.vue'
import modApi from "@/api/mod"
import { showSnackbar } from "@/utils/snackbar"
import useGlobalStore from "@store/global.js"
import { useI18n } from "vue-i18n"
import roomApi from "@/api/room"
import { useDisplay } from "vuetify/framework"


const props = defineProps({
  height: {
    type: Number,
    default: 0,
  },
})

const globalStore = useGlobalStore()
const { t } = useI18n()
const { mobile } = useDisplay()

const dataGot = ref(false)
const leftLoading = ref(false)
const rightLoading = ref(false)

const selectedWorldId = ref(0)
const modInOne = ref(true)
const roomData = ref({})
const worldData = ref([])

const getRoomTotalInfo = async () => {
  if (globalStore.room.id !== 0) {
    const response = await roomApi.base.get({ id: globalStore.room.id })

    roomData.value = response.data.roomData
    worldData.value = response.data.worldData
    if (!roomData.value.modInOne) {
      selectedWorldId.value = worldData.value[0].id
      modInOne.value = false
    }
  }
}

const getEnabledMods = async () => {
  leftLoading.value = true
  selectedMod.value = []
  modStruct.value = []
  modValue.value = []
  modName.value = ""

  const reqForm = {
    roomID: globalStore.room.id,
    worldID: selectedWorldId.value,
  }

  const response = await modApi.setting.enabledMods.get(reqForm)

  enabledMods.value = response.data || []
  leftLoading.value = false
  dataGot.value = false
}

const getModConfig = async (id, worldID, file_url, name) => {
  dataGot.value = true
  rightLoading.value = true
  currentWorldID.value = worldID
  currentModID.value = id
  modName.value = ""
  if (id === 0) {
    modName.value = t('game.mod.setting.clientModsDisabled')
    modStruct.value = []
    modValue.value = []
  } else {
    await Promise.all([
      getModStruct(id, worldID, file_url),
      getModValue(id, worldID, file_url),
    ])
    modName.value = name
  }

  rightLoading.value = false
}

const getModStruct = async (id, worldID, file_url) => {
  const reqForm = {
    roomID: globalStore.room.id,
    worldID: worldID,
    id: id,
    file_url: file_url,
  }

  const response = await modApi.setting.modConfigStruct.get(reqForm)

  modStruct.value = response.data || []
}

const getModValue = async (id, worldID, file_url) => {
  const reqForm = {
    roomID: globalStore.room.id,
    worldID: worldID,
    id: id,
    file_url: file_url,
  }

  const response = await modApi.setting.modConfigValue.get(reqForm)

  modValue.value = response.data?.configuration_options || {}
}

const enabledMods = ref([])
const modStruct = ref([])
const modValue = ref([])
const modName = ref("")
const currentWorldID = ref(0)
const currentModID = ref(0)

const handleFormChange = event => {
  const reqForm = {
    roomID: globalStore.room.id,
    worldID: selectedWorldId.value,
    id: currentModID.value,
    modORConfig: {
      configuration_options: event.formData,
      enabled: true,
    },
  }

  modApi.setting.modConfigValue.put(reqForm).then(response => {
    showSnackbar(response.message)
  })
}

const forbidLocalIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9FCFF8"><path d="M21 11.6736C20.0907 11.2417 19.0736 11 18 11C14.134 11 11 14.134 11 18C11 19.4872 11.4638 20.8662 12.2547 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918C3 2.44405 3.44495 2 3.9934 2H16L21 7V11.6736ZM18 23C15.2386 23 13 20.7614 13 18C13 15.2386 15.2386 13 18 13C20.7614 13 23 15.2386 23 18C23 20.7614 20.7614 23 18 23ZM16.7066 20.7076C17.0982 20.895 17.5369 21 18 21C19.6569 21 21 19.6569 21 18C21 17.5369 20.895 17.0982 20.7076 16.7066L16.7066 20.7076ZM15.2924 19.2934L19.2934 15.2924C18.9018 15.105 18.4631 15 18 15C16.3431 15 15 16.3431 15 18C15 18.4631 15.105 18.9018 15.2924 19.2934Z"></path></svg>`

const selectedMod = ref([])
const multiDisableLoading = ref(false)

const handleMultiDisable = async () => {
  if (!selectedMod.value.length) {
    showSnackbar(t('game.mod.setting.tip.selectModToDisable'), 'error')
    
    return
  }
  multiDisableLoading.value = true
  for (let modID of selectedMod.value) {
    const reqForm = {
      roomID: globalStore.room.id,
      id: modID,
    }

    await modApi.setting.disableMod.post(reqForm)
  }
  selectedMod.value = []
  multiDisableLoading.value = false
  await getEnabledMods()
}

onMounted(async () => {
  await getRoomTotalInfo()
  await getEnabledMods()
})
</script>
