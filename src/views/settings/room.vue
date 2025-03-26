<template>
  <template v-if="!isMultiHost">
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-item :color="step>0?'success':''" :complete="step>0" :value="0"
                        title="房间设置">
          <template #icon>
            <v-icon icon="ri-number-1" size="12"></v-icon>
          </template>
        </v-stepper-item>
        <v-divider></v-divider>

        <v-stepper-item :color="step>1?'success':''" :complete="step>1" :value="1"
                        title="地面设置">
          <template #icon>
            <v-icon icon="ri-number-2" size="12"></v-icon>
          </template>
        </v-stepper-item>
        <v-divider></v-divider>

        <v-stepper-item :color="step>2?'success':''" :complete="step>2" :value="2"
                        title="洞穴设置">
          <template #icon>
            <v-icon icon="ri-number-3" size="12"></v-icon>
          </template>
        </v-stepper-item>
        <v-divider></v-divider>

        <v-stepper-item :color="step>3?'success':''" :complete="step>3" :value="3"
                        title="模组设置">
          <template #icon>
            <v-icon icon="ri-number-4" size="12"></v-icon>
          </template>
        </v-stepper-item>
        <v-divider></v-divider>

        <v-stepper-item :color="step>4?'success':''" :complete="step>4" :value="4"
                        title="设置完成">
          <template #icon>
            <v-icon icon="ri-number-5" size="12"></v-icon>
          </template>
        </v-stepper-item>
      </v-stepper-header>

      <v-stepper-window v-model="step">
        <v-stepper-window-item :value="0">
          <v-form fast-fail>
            <v-container>
              <v-row>
                <v-col cols="6">
                  <div style="display: flex; align-items: center">
                    <span>当前模式为：</span>
                    <v-chip>
                      单机器模式
                    </v-chip>
                    <v-btn class="ml-1" variant="text">点击切换为多机器模式</v-btn>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="roomBaseForm.name"
                                clearable label="房间名" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="roomBaseForm.description"
                                clearable label="房间描述" required></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-number-input v-model="roomBaseForm.masterPort" clearable
                                  control-variant="stacked" inset label="地面端口"
                                  required variant="outlined"
                  ></v-number-input>
                </v-col>
                <v-col cols="6">
                  <v-number-input v-model="roomBaseForm.cavesPort" clearable
                                  control-variant="stacked" inset label="洞穴端口"
                                  required variant="outlined"
                  ></v-number-input>
                </v-col>
                <v-col cols="6" style="margin-top: -20px">
                  <v-radio-group v-model="roomBaseForm.gameMode" inline>
                    <template #prepend>
                      <span>游戏模式</span>
                    </template>
                    <v-radio label="无尽" value="endless"/>
                    <v-radio label="生存" value="survival"/>
                    <v-radio label="熔炉" value="lavaarena"/>
                    <v-radio label="暴食" value="quagmire"/>
                  </v-radio-group>
                </v-col>
                <v-col cols="3" style="margin-top: -20px">
                  <v-switch v-model="roomBaseForm.pvp" inset>
                    <template #prepend>
                      <span>玩家对战</span>
                    </template>
                  </v-switch>
                </v-col>
                <v-col cols="3" style="margin-top: -20px">
                  <v-switch v-model="roomBaseForm.vote" inset>
                    <template #prepend>
                      <span>玩家投票</span>
                    </template>
                  </v-switch>
                </v-col>
                <v-col cols="6">
                  <v-slider v-model="roomBaseForm.playerNum" :max="99" :min="2"
                      class="align-center" hide-details step="1"
                  >
                    <template #label>
                      <span>玩家数量</span>
                    </template>
                    <template v-slot:append>
                      <v-text-field v-model="roomBaseForm.playerNum" density="compact"
                          style="width: 70px" type="number" hide-details single-line
                      ></v-text-field>
                    </template>
                  </v-slider>
                </v-col>
                <v-col cols="6">
                  <v-slider v-model="roomBaseForm.backDays" :max="50" :min="5"
                            class="align-center" hide-details step="1"
                  >
                    <template #label>
                      <span>回档天数</span>
                    </template>
                    <template v-slot:append>
                      <v-text-field v-model="roomBaseForm.backDays" density="compact"
                                    style="width: 70px" type="number" hide-details single-line
                      ></v-text-field>
                    </template>
                  </v-slider>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="roomBaseForm.password"
                                label="房间密码" required clearable></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="roomBaseForm.token"
                                label="游戏令牌" required clearable></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
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
          <v-btn color="grey-lighten-3" variant="tonal" @click="step--">上一步</v-btn>
        </template>
        <template #next>
          <v-btn color="primary" variant="elevated" @click="step++">下一步</v-btn>
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
import {VNumberInput} from 'vuetify/labs/VNumberInput'
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

const roomBaseFormRef = ref()
const roomBaseForm = ref({
  name: '',
  description: '',
  gameMode: '',
  pvp: false,
  playerNum: 6,
  backDays: 10,
  vote: true,
  password: '',
  token: '',
  masterPort: 0,
  cavesPort: 0,
  shardMasterPort: undefined,
  steamMasterPort: undefined,
  steamAuthenticationPort: undefined,
  shardMasterIp: undefined,
  clusterKey: undefined,
})

const roomGroundFormRef = ref()
const roomGroundForm = ref({
  groundSetting: '',
})

const roomCaveFormRef = ref()
const roomCaveForm = ref({
  caveSetting: '',
})

const roomModFormRef = ref()
const roomModForm = ref({
  modSetting: '',
})

const multiHostIsMaster = ref(true)

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