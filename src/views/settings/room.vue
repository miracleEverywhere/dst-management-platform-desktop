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
          <v-container height="700" style="overflow-y: auto">
            <v-form ref="roomBaseFormRef" fast-fail class="mt-4">
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
                    <v-text-field v-model="roomBaseForm.name" :rules="roomBaseFormRules.name"
                                  clearable label="房间名"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="roomBaseForm.description"
                                  clearable label="房间描述"></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-number-input v-model="roomBaseForm.masterPort"
                                    :rules="roomBaseFormRules.masterPort"
                                    control-variant="stacked" inset
                                    label="地面端口" variant="outlined"
                    ></v-number-input>
                  </v-col>
                  <v-col cols="6">
                    <v-number-input v-model="roomBaseForm.cavesPort"
                                    :rules="roomBaseFormRules.cavesPort"
                                    control-variant="stacked" inset
                                    label="洞穴端口" variant="outlined"
                    ></v-number-input>
                  </v-col>
                  <v-col cols="6" class="mt-2">
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
                  <v-col cols="3" class="mt-2">
                    <v-switch v-model="roomBaseForm.pvp" inset>
                      <template #prepend>
                        <span>玩家对战</span>
                      </template>
                    </v-switch>
                  </v-col>
                  <v-col cols="3" class="mt-2">
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
                        <v-chip>
                          {{roomBaseForm.playerNum}}
                        </v-chip>
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
                        <v-chip>
                          {{roomBaseForm.backDays}}
                        </v-chip>
                      </template>
                    </v-slider>
                  </v-col>
                  <v-col cols="12" class="mt-8">
                    <v-text-field v-model="roomBaseForm.password"
                                  clearable label="房间密码" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="roomBaseForm.token" :rules="roomBaseFormRules.token"
                                  clearable label="游戏令牌"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-container>
        </v-stepper-window-item>
        <v-stepper-window-item :value="1">
          <v-container height="700" style="overflow-y: auto">
            <v-tabs v-model="step2tab" align-tabs="start"
                    class="v-tabs-pill" color="primary" show-arrows @update:modelValue="handleStep2TabChange">
              <v-tab value="Code" prepend-icon="ri-code-s-slash-line">配置文件</v-tab>
              <v-tab v-if="(roomBaseForm.gameMode==='endless'||roomBaseForm.gameMode==='survival') && roomGroundForm.groundSetting!==''" value="Visualization" prepend-icon="ri-image-ai-line">可视化</v-tab>
            </v-tabs>
            <v-tabs-window v-model="step2tab">
              <v-tabs-window-item value="Code">
                <v-btn :disabled="roomBaseForm.gameMode!=='endless'" color="info"
                       @click="handleImportLeveldataLua('master', 'endless')"
                       class="mt-2 mr-2" prepend-icon="ri-download-2-line"
                >
                  导入标准无尽
                </v-btn>
                <v-btn :disabled="roomBaseForm.gameMode!=='survival'" color="info"
                       @click="handleImportLeveldataLua('master', 'survival')"
                       class="mt-2 mr-2" prepend-icon="ri-download-2-line"
                >
                  导入标准生存
                </v-btn>
                <sc-code-editor ref="editorGroundSettingRef" v-model="roomGroundForm.groundSetting"
                                :height="300" class="mt-4"
                                :theme="globalStore.theme==='dark'?'darcula':'idea'"
                                mode="lua" style="width: 100%"></sc-code-editor>
              </v-tabs-window-item>
            </v-tabs-window>
            <v-tabs-window v-model="step2tab">
              <v-tabs-window-item value="Visualization" class="mt-2">
                <v-alert><span
                  style="font-weight: bolder">世界规则</span> -
                  全局
                </v-alert>
                <div class="item-container">
                  <template v-for="i in groundWorldRule.global">
                    <div>
                      <LevelDataSetting :key="new Date().getTime()"
                                        v-model="overridesObj[i]"
                                        :configs="overrides[i].configs"
                                        :customConfigsValue="overrides[i].customConfigsValue"
                                        :defaultModelValue="overrides[i].modelValue"
                                        :i18n="overrides[i].i18n"
                                        :image="overrides[i].image"
                                        :name="i"
                                        @changeModelValue="handleModelValueChange"
                      />
                    </div>
                  </template>
                </div>
                <v-alert><span
                  style="font-weight: bolder">世界规则</span> -
                  活动
                </v-alert>
                <div class="item-container">
                  <template v-for="i in groundWorldRule.events">
                    <div>
                      <LevelDataSetting :key="new Date().getTime()"
                                        v-model="overridesObj[i]"
                                        :configs="overrides[i].configs"
                                        :customConfigsValue="overrides[i].customConfigsValue"
                                        :defaultModelValue="overrides[i].modelValue"
                                        :i18n="overrides[i].i18n"
                                        :image="overrides[i].image"
                                        :name="i"
                                        @changeModelValue="handleModelValueChange"
                      />
                    </div>
                  </template>
                </div>
                <v-alert><span
                  style="font-weight: bolder">世界规则</span> -
                  冒险家
                </v-alert>
                <div class="item-container">
                  <template v-for="i in groundWorldRule.survivors">
                    <div>
                      <LevelDataSetting :key="new Date().getTime()"
                                        v-model="overridesObj[i]"
                                        :configs="overrides[i].configs"
                                        :customConfigsValue="overrides[i].customConfigsValue"
                                        :defaultModelValue="overrides[i].modelValue"
                                        :i18n="overrides[i].i18n"
                                        :image="overrides[i].image"
                                        :name="i"
                                        @changeModelValue="handleModelValueChange"
                      />
                    </div>
                  </template>
                </div>
                <v-alert><span
                  style="font-weight: bolder">世界规则</span> -
                  世界
                </v-alert>
                <div class="item-container">
                  <template v-for="i in groundWorldRule.world">
                    <div>
                      <LevelDataSetting :key="new Date().getTime()"
                                        v-model="overridesObj[i]"
                                        :configs="overrides[i].configs"
                                        :customConfigsValue="overrides[i].customConfigsValue"
                                        :defaultModelValue="overrides[i].modelValue"
                                        :i18n="overrides[i].i18n"
                                        :image="overrides[i].image"
                                        :name="i"
                                        @changeModelValue="handleModelValueChange"
                      />
                    </div>
                  </template>
                </div>
                <v-alert><span
                  style="font-weight: bolder">世界规则</span> -
                  资源再生
                </v-alert>
                <div class="item-container">
                  <template v-for="i in groundWorldRule.resourceRegrowth">
                    <div>
                      <LevelDataSetting :key="new Date().getTime()"
                                        v-model="overridesObj[i]"
                                        :configs="overrides[i].configs"
                                        :customConfigsValue="overrides[i].customConfigsValue"
                                        :defaultModelValue="overrides[i].modelValue"
                                        :i18n="overrides[i].i18n"
                                        :image="overrides[i].image"
                                        :name="i"
                                        @changeModelValue="handleModelValueChange"
                      />
                    </div>
                  </template>
                </div>
                <v-alert><span
                  style="font-weight: bolder">世界规则</span> -
                  非自然传送门资源
                </v-alert>
                <div class="item-container">
                  <template v-for="i in groundWorldRule.unnaturalPortalResource">
                    <div>
                      <LevelDataSetting :key="new Date().getTime()"
                                        v-model="overridesObj[i]"
                                        :configs="overrides[i].configs"
                                        :customConfigsValue="overrides[i].customConfigsValue"
                                        :defaultModelValue="overrides[i].modelValue"
                                        :i18n="overrides[i].i18n"
                                        :image="overrides[i].image"
                                        :name="i"
                                        @changeModelValue="handleModelValueChange"
                      />
                    </div>
                  </template>
                </div>
                <v-alert><span
                  style="font-weight: bolder">世界规则</span> -
                  生物
                </v-alert>
                <div class="item-container">
                  <template v-for="i in groundWorldRule.creatures">
                    <div>
                      <LevelDataSetting :key="new Date().getTime()"
                                        v-model="overridesObj[i]"
                                        :configs="overrides[i].configs"
                                        :customConfigsValue="overrides[i].customConfigsValue"
                                        :defaultModelValue="overrides[i].modelValue"
                                        :i18n="overrides[i].i18n"
                                        :image="overrides[i].image"
                                        :name="i"
                                        @changeModelValue="handleModelValueChange"
                      />
                    </div>
                  </template>
                </div>
                <v-alert><span
                  style="font-weight: bolder">世界规则</span> -
                  敌对生物
                </v-alert>
                <div class="item-container">
                  <template v-for="i in groundWorldRule.hostileCreatures">
                    <div>
                      <LevelDataSetting :key="new Date().getTime()"
                                        v-model="overridesObj[i]"
                                        :configs="overrides[i].configs"
                                        :customConfigsValue="overrides[i].customConfigsValue"
                                        :defaultModelValue="overrides[i].modelValue"
                                        :i18n="overrides[i].i18n"
                                        :image="overrides[i].image"
                                        :name="i"
                                        @changeModelValue="handleModelValueChange"
                      />
                    </div>
                  </template>
                </div>
                <v-alert><span
                  style="font-weight: bolder">世界规则</span> -
                  巨兽
                </v-alert>
                <div class="item-container">
                  <template v-for="i in groundWorldRule.giants">
                    <div>
                      <LevelDataSetting :key="new Date().getTime()"
                                        v-model="overridesObj[i]"
                                        :configs="overrides[i].configs"
                                        :customConfigsValue="overrides[i].customConfigsValue"
                                        :defaultModelValue="overrides[i].modelValue"
                                        :i18n="overrides[i].i18n"
                                        :image="overrides[i].image"
                                        :name="i"
                                        @changeModelValue="handleModelValueChange"
                      />
                    </div>
                  </template>
                </div>
                <v-alert><span
                  style="font-weight: bolder">世界生成</span> -
                  全局
                </v-alert>
                <div class="item-container">
                  <template v-for="i in groundWorldGeneration.global">
                    <div>
                      <LevelDataSetting :key="new Date().getTime()"
                                        v-model="overridesObj[i]"
                                        :configs="overrides[i].configs"
                                        :customConfigsValue="overrides[i].customConfigsValue"
                                        :defaultModelValue="overrides[i].modelValue"
                                        :i18n="overrides[i].i18n"
                                        :image="overrides[i].image"
                                        :name="i"
                                        @changeModelValue="handleModelValueChange"
                      />
                    </div>
                  </template>
                </div>
                <v-alert><span
                  style="font-weight: bolder">世界生成</span> -
                  世界
                </v-alert>
                <div class="item-container">
                  <template v-for="i in groundWorldGeneration.world">
                    <div>
                      <LevelDataSetting :key="new Date().getTime()"
                                        v-model="overridesObj[i]"
                                        :configs="overrides[i].configs"
                                        :customConfigsValue="overrides[i].customConfigsValue"
                                        :defaultModelValue="overrides[i].modelValue"
                                        :i18n="overrides[i].i18n"
                                        :image="overrides[i].image"
                                        :name="i"
                                        @changeModelValue="handleModelValueChange"
                      />
                    </div>
                  </template>
                </div>
                <v-alert><span
                  style="font-weight: bolder">世界生成</span> -
                  资源
                </v-alert>
                <div class="item-container">
                  <template v-for="i in groundWorldGeneration.resources">
                    <div>
                      <LevelDataSetting :key="new Date().getTime()"
                                        v-model="overridesObj[i]"
                                        :configs="overrides[i].configs"
                                        :customConfigsValue="overrides[i].customConfigsValue"
                                        :defaultModelValue="overrides[i].modelValue"
                                        :i18n="overrides[i].i18n"
                                        :image="overrides[i].image"
                                        :name="i"
                                        @changeModelValue="handleModelValueChange"
                      />
                    </div>
                  </template>
                </div>
                <v-alert><span
                  style="font-weight: bolder">世界生成</span> -
                  生物以及刷新点
                </v-alert>
                <div class="item-container">
                  <template v-for="i in groundWorldGeneration.creaturesAndSpawners">
                    <div>
                      <LevelDataSetting :key="new Date().getTime()"
                                        v-model="overridesObj[i]"
                                        :configs="overrides[i].configs"
                                        :customConfigsValue="overrides[i].customConfigsValue"
                                        :defaultModelValue="overrides[i].modelValue"
                                        :i18n="overrides[i].i18n"
                                        :image="overrides[i].image"
                                        :name="i"
                                        @changeModelValue="handleModelValueChange"
                      />
                    </div>
                  </template>
                </div>
                <v-alert><span
                  style="font-weight: bolder">世界生成</span> -
                  敌对生物以及刷新点
                </v-alert>
                <div class="item-container">
                  <template v-for="i in groundWorldGeneration.hostileCreaturesAndSpawners">
                    <div>
                      <LevelDataSetting :key="new Date().getTime()"
                                        v-model="overridesObj[i]"
                                        :configs="overrides[i].configs"
                                        :customConfigsValue="overrides[i].customConfigsValue"
                                        :defaultModelValue="overrides[i].modelValue"
                                        :i18n="overrides[i].i18n"
                                        :image="overrides[i].image"
                                        :name="i"
                                        @changeModelValue="handleModelValueChange"
                      />
                    </div>
                  </template>
                </div>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-container>
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
          <v-btn color="primary" variant="elevated" @click="handleNext">下一步</v-btn>
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
import {endless, survival} from "@/views/settings/components/leveldataoverride.js"
import useGlobalStore from "@/plugins/pinia/global";
import ScCodeEditor from "@/components/ScCodeEditor.vue";
import luaparse from 'luaparse'
import luamin from 'lua-format'
import LevelDataSetting from "@/views/settings/components/levelDataSetting.vue";
import {
  caveOverrideWorldGenerationWorld,
  cavesWorldGeneration,
  cavesWorldRule,
  groundWorldGeneration,
  groundWorldRule,
  overrides
} from "@/views/settings/components/levelDataMap.js"
import {showSnackbar} from "@/utils/snackbar";

onMounted(async () => {
  await getMultiHost()
  await handleGetCurrentRoomSetting()
})

const globalStore = useGlobalStore()

const isMultiHost = ref(false)
const getMultiHost = async () => {
  await settingApi.multihost.get().then(response => {
    isMultiHost.value = response.data
  })
}

const step = ref(0)
const handleNext = async () => {
  if (isMultiHost.value) {

  } else {
    if (step.value === 0) {
      const {valid} = await roomBaseFormRef.value.validate();
      if (valid) {
        step.value++
      }
      return
    }
    if (step.value === 1) {
      if (!roomGroundForm.value.groundSetting) {
        showSnackbar('地面设置不能为空', 'error')
        return
      }
      try {
        luaparse.parse(roomGroundForm.value.groundSetting)
        step.value++
      } catch (e) {
        showSnackbar('lua文件格式校验失败，请检查', 'error')
      }
    }
  }
}

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
const roomBaseFormRules = {
  name: [
    value => {
      if (value) {
        return true
      }
      return '请输入房间名'
    },
  ],
  masterPort: [
    value => {
      if (value) {
        if (value >= 0 && value <= 65535) {
          if (value === roomBaseForm.value.cavesPort) {
            return '地面洞穴端口不能相同'
          } else {
            return true
          }
        } else {
          return '端口范围：1-65535'
        }
      }
      return '请输入地面端口'
    }
  ],
  cavesPort: [
    value => {
      if (value) {
        if (value >= 0 && value <= 65535) {
          if (value === roomBaseForm.value.masterPort) {
            return '地面洞穴端口不能相同'
          } else {
            return true
          }
        } else {
          return '端口范围：1-65535'
        }
      }
      return '请输入地面端口'
    }
  ],
  token: [
    value => {
      if (value) {
        return true
      }
      return '请输入游戏令牌'
    }
  ]
}

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

const step2tab = ref('Code')
const handleStep2TabChange = async (tab) => {
  if (tab === 'Visualization') {
    generateGroundOverridesObj()
  }
  if (tab === 'Code') {
    roomGroundForm.value.groundSetting = beautifyLua(roomGroundForm.value.groundSetting)
    await nextTick(() => {
      if (editorGroundSettingRef.value) {
        editorGroundSettingRef.value.refresh()
      }
    })

  }
}
const handleImportLeveldataLua = (world, mode) => {
  if (world === 'master') {
    if (mode === 'endless') {
      roomGroundForm.value.groundSetting = endless.master
    }
    if (mode === 'survival') {
      roomGroundForm.value.groundSetting = survival.master
    }
    if (isMultiHost.value) {
      roomBaseForm.value.masterPort = 11000
      roomBaseForm.value.cavesPort = 0
      roomBaseForm.value.shardMasterPort = 10888
      roomBaseForm.value.steamMasterPort = 27018
      roomBaseForm.value.steamAuthenticationPort = 8768
      roomBaseForm.value.shardMasterIp = '127.0.0.1'
      roomBaseForm.value.clusterKey = undefined
    }
  }
  if (world === 'caves') {
    if (mode === 'endless') {
      roomCaveForm.value.caveSetting = endless.caves
    }
    if (mode === 'survival') {
      roomCaveForm.value.caveSetting = survival.caves
    }
    if (isMultiHost.value) {
      roomBaseForm.value.masterPort = 0
      roomBaseForm.value.cavesPort = 11001
      roomBaseForm.value.shardMasterPort = 10888
      roomBaseForm.value.steamMasterPort = 27019
      roomBaseForm.value.steamAuthenticationPort = 8769
      roomBaseForm.value.shardMasterIp = undefined
      roomBaseForm.value.clusterKey = undefined
    }
  }
}
const editorGroundSettingRef = ref()

const overridesObj = ref({})
const generateGroundOverridesObj = () => {
  if (roomGroundForm.value.groundSetting === '') {
    return
  }
  const ast = luaparse.parse(roomGroundForm.value.groundSetting)
  // 提取 overrides 字段
  const overridesTable = extractOverrides(ast);
  // 将 Lua 表转换为 JavaScript 对象
  overridesObj.value = convertLuaTableToObject(overridesTable);
}
function extractOverrides(ast) {
  // 找到 return 语句中的 overrides 字段
  const returnStatement = ast.body[0]; // 假设只有一个 return 语句
  const returnTable = returnStatement.arguments[0]; // return 语句的参数是一个表

  // 遍历表中的字段，找到 overrides 字段
  for (const field of returnTable.fields) {
    // console.log(field)
    if (field.key.type === 'Identifier' && field.key.name === 'overrides') {
      return field.value;
    }
  }

  return null;
}
function convertLuaTableToObject(luaTable) {
  const obj = {};
  for (const field of luaTable.fields) {
    const key = field.key.name;
    obj[key] = field.value.raw.replace(/"/g, '')
  }

  return obj;
}

const beautifyLua = (luaScript) => {
  let removedWatermark = luamin.Beautify(luaScript, {
    RenameVariables: false,
    RenameGlobals: false,
    SolveMath: false
  })
  removedWatermark = removedWatermark.replace(/--\[\[\n\t.+\n\t.+\n--]]\n\n\n\n\n/g, '')
  removedWatermark = removedWatermark.replace(/ = /g, '=')
  removedWatermark = removedWatermark.replace(/\t/g, '  ')

  removedWatermark = removedWatermark.replace(/overrides=\{ +(.+)\n/g, 'overrides={\n    $1\n')
  removedWatermark = removedWatermark.replace(/^(\w+)=(.+)\n/gm, '    $1=$2\n')
  removedWatermark = removedWatermark.replace(/(.+)},\n/g, '$1\n  },\n')
  removedWatermark = removedWatermark.replace(/^ +?\n/gm, '')

  return removedWatermark
}

const handleModelValueChange = (data) => {
  const key = data.name
  const value = data.value
  const ast = luaparse.parse(roomGroundForm.value.groundSetting)
  // 提取 overrides 字段
  const overridesTable = extractOverrides(ast);
  // console.log(overridesTable)
  for (let field of overridesTable.fields) {
    if (field.key.name === key) {
      field.value.raw = `"${value}"`
    }
  }
  const luaScript = astToLua(ast)
  roomGroundForm.value.groundSetting = beautifyLua(luaScript)
  if (editorGroundSettingRef.value) {
    editorGroundSettingRef.value.refresh()
  }
}

const astToLua = (astNode, indentLevel = 0) => {
  const indent = '    '.repeat(indentLevel);
  switch (astNode.type) {
    case 'Chunk':
      return astNode.body.map(node => astToLua(node, indentLevel)).join('\n');
    case 'LocalStatement':
      return `${indent}local ${astNode.variables.map(astToLua).join(', ')} = ${astNode.init.map(astToLua).join(', ')}`;
    case 'FunctionDeclaration':
      return `${indent}function ${astToLua(astNode.identifier)}(${astNode.parameters.map(astToLua).join(', ')}) \n${astToLua(astNode.body, indentLevel + 1)}\n${indent}end`;
    case 'ReturnStatement':
      return `${indent}return ${astNode.arguments.map(astToLua).join(', ')}`;
    case 'BinaryExpression':
      return `${astToLua(astNode.left)} ${astNode.operator} ${astToLua(astNode.right)}`;
    case 'CallStatement':
      return `${indent}${astToLua(astNode.expression)}`;
    case 'Identifier':
      return astNode.name;
    case 'StringLiteral':
      return `${astNode.raw}`;
    case 'NumericLiteral':
      return astNode.raw;
    case 'VarargLiteral':
      return '...';
    case 'TableConstructorExpression':
      return `${indent}{ ${astNode.fields.map(field => astToLua(field, indentLevel + 1)).join(',\n' + indent)} }`;
    case 'Field':
      return astNode.key ? `${astToLua(astNode.key)} = ${astToLua(astNode.value)}` : astToLua(astNode.value);
    case 'AssignmentStatement':
      return `${indent}${astNode.variables.map(astToLua).join(', ')} = ${astNode.init.map(astToLua).join(', ')}`;
    case 'CallExpression':
      return `${astToLua(astNode.base)}(${astNode.arguments.map(astToLua).join(', ')})`;
    case 'TableKeyString':
      return `${astToLua(astNode.key)} = ${astToLua(astNode.value)}`;
    case 'BooleanLiteral':
      return astNode.raw;
    case 'TableValue':
      return astToLua(astNode.value);
    default:
      throw new Error(`Unsupported node type: ${astNode.type}`);
  }
}
</script>

<style scoped>
.item-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240.5px, 1fr));
  gap: 10px;
}
</style>