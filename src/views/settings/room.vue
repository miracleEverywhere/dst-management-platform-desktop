<template>
  <template v-if="!isMultiHost">
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-item :color="step > 0 ? 'success' : ''" :complete="step > 0" :value="0" title="房间设置">
          <template #icon>
            <v-icon icon="ri-number-1" size="12"></v-icon>
          </template>
        </v-stepper-item>
        <v-divider></v-divider>

        <v-stepper-item :color="step > 1 ? 'success' : ''" :complete="step > 1" :value="1" title="地面设置">
          <template #icon>
            <v-icon icon="ri-number-2" size="12"></v-icon>
          </template>
        </v-stepper-item>
        <v-divider></v-divider>

        <v-stepper-item :color="step > 2 ? 'success' : ''" :complete="step > 2" :value="2" title="洞穴设置">
          <template #icon>
            <v-icon icon="ri-number-3" size="12"></v-icon>
          </template>
        </v-stepper-item>
        <v-divider></v-divider>

        <v-stepper-item :color="step > 3 ? 'success' : ''" :complete="step > 3" :value="3" title="模组设置">
          <template #icon>
            <v-icon icon="ri-number-4" size="12"></v-icon>
          </template>
        </v-stepper-item>
        <v-divider></v-divider>

        <v-stepper-item :color="step > 4 ? 'success' : ''" :complete="step > 4" :value="4" title="设置完成">
          <template #icon>
            <v-icon icon="ri-number-5" size="12"></v-icon>
          </template>
        </v-stepper-item>
      </v-stepper-header>
      <v-stepper-window v-model="step">
        <v-stepper-window-item :value="0">
          <v-container height="700" style="overflow-y: auto">
            <v-form ref="roomBaseFormRef" class="mt-4" fast-fail>
              <v-container>
                <v-row>
                  <v-col cols="6">
                    <div style="display: flex; align-items: center">
                      <span>当前模式为：</span>
                      <v-chip prepend-icon="ri-map-pin-line">单机器模式</v-chip>
                      <v-btn class="ml-1" variant="text" @click="handleChangeMultiHost(true)">点击切换为多机器模式</v-btn>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="roomBaseForm.name" :rules="roomBaseFormRules.name" clearable
                                  label="房间名"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="roomBaseForm.description" clearable label="房间描述"></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-number-input v-model="roomBaseForm.masterPort" :rules="roomBaseFormRules.masterPort"
                                    control-variant="stacked" inset label="地面端口" variant="outlined"></v-number-input>
                  </v-col>
                  <v-col cols="6">
                    <v-number-input v-model="roomBaseForm.cavesPort" :rules="roomBaseFormRules.cavesPort"
                                    control-variant="stacked" inset label="洞穴端口" variant="outlined"></v-number-input>
                  </v-col>
                  <v-col class="mt-2" cols="6">
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
                  <v-col class="mt-2" cols="3">
                    <v-switch v-model="roomBaseForm.pvp" inset>
                      <template #prepend>
                        <span>玩家对战</span>
                      </template>
                    </v-switch>
                  </v-col>
                  <v-col class="mt-2" cols="3">
                    <v-switch v-model="roomBaseForm.vote" inset>
                      <template #prepend>
                        <span>玩家投票</span>
                      </template>
                    </v-switch>
                  </v-col>
                  <v-col cols="6">
                    <v-slider v-model="roomBaseForm.playerNum" :max="99" :min="2" class="align-center" hide-details
                              step="1" style="margin-left: -1px">
                      <template #label>
                        <span>玩家数量</span>
                      </template>
                      <template v-slot:append>
                        <v-chip>
                          {{ roomBaseForm.playerNum }}
                        </v-chip>
                      </template>
                    </v-slider>
                  </v-col>
                  <v-col cols="6">
                    <v-slider v-model="roomBaseForm.backDays" :max="50" :min="5" class="align-center" hide-details
                              step="1" style="margin-left: -1px">
                      <template #label>
                        <span>回档天数</span>
                      </template>
                      <template v-slot:append>
                        <v-chip>
                          {{ roomBaseForm.backDays }}
                        </v-chip>
                      </template>
                    </v-slider>
                  </v-col>
                  <v-col class="mt-8" cols="12">
                    <v-text-field v-model="roomBaseForm.password" clearable label="房间密码" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="roomBaseForm.token" :rules="roomBaseFormRules.token" clearable
                                  label="游戏令牌"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-container>
        </v-stepper-window-item>
        <v-stepper-window-item :value="1">
          <v-container height="700" style="overflow-y: auto">
            <v-tabs v-model="step2tab" align-tabs="start" class="v-tabs-pill" color="primary" show-arrows
                    @update:modelValue="handleStep2TabChange">
              <v-tab prepend-icon="ri-code-s-slash-line" value="Code">配置文件</v-tab>
              <v-tab v-if="
                (roomBaseForm.gameMode === 'endless' || roomBaseForm.gameMode === 'survival') &&
                roomGroundForm.groundSetting !== ''
              " prepend-icon="ri-image-ai-line" value="Visualization">可视化
              </v-tab>
            </v-tabs>
            <v-tabs-window v-model="step2tab">
              <v-tabs-window-item value="Code">
                <div class="d-flex flex-column gap-4 mt-2">
                  <div>
                    <v-btn :disabled="roomBaseForm.gameMode !== 'endless'" class="mr-2"
                           color="info" prepend-icon="ri-download-2-line"
                           @click="handleImportLeveldataLua('master', 'endless')">
                      导入标准无尽
                    </v-btn>
                    <v-btn :disabled="roomBaseForm.gameMode !== 'survival'" class="mr-2"
                           color="info" prepend-icon="ri-download-2-line"
                           @click="handleImportLeveldataLua('master', 'survival')">
                      导入标准生存
                    </v-btn>
                  </div>
                  <ScCodeEditor ref="editorGroundSettingRef" v-model="roomGroundForm.groundSetting" :height="550"
                                :theme="globalStore.theme === 'dark' ? 'darcula' : 'idea'" class="mt-4" mode="lua"
                                style="width: 100%"></ScCodeEditor>
                </div>
              </v-tabs-window-item>
              <v-tabs-window-item value="Visualization">
                <div class="d-flex flex-column gap-4 mt-2">
                  <v-alert><span style="font-weight: bolder">世界规则</span> - 全局</v-alert>
                  <div class="item-container">
                    <template v-for="(item, i) in groundWorldRule.global">
                      <div>
                        <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                          :configs="overrides[item].configs"
                                          :customConfigsValue="overrides[item].customConfigsValue"
                                          :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                          :image="overrides[item].image" :name="item"
                                          @changeModelValue="debouncedHandleModelValueChange"/>
                      </div>
                    </template>
                  </div>
                  <v-alert><span style="font-weight: bolder">世界规则</span> - 活动</v-alert>
                  <div class="item-container">
                    <template v-for="(item, i) in groundWorldRule.events">
                      <div>
                        <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                          :configs="overrides[item].configs"
                                          :customConfigsValue="overrides[item].customConfigsValue"
                                          :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                          :image="overrides[item].image" :name="item"
                                          @changeModelValue="debouncedHandleModelValueChange"/>
                      </div>
                    </template>
                  </div>
                  <v-alert><span style="font-weight: bolder">世界规则</span> - 冒险家</v-alert>
                  <div class="item-container">
                    <template v-for="(item, i) in groundWorldRule.survivors">
                      <div>
                        <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                          :configs="overrides[item].configs"
                                          :customConfigsValue="overrides[item].customConfigsValue"
                                          :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                          :image="overrides[item].image" :name="item"
                                          @changeModelValue="debouncedHandleModelValueChange"/>
                      </div>
                    </template>
                  </div>
                  <v-alert><span style="font-weight: bolder">世界规则</span> - 世界</v-alert>
                  <div class="item-container">
                    <template v-for="(item, i) in groundWorldRule.world">
                      <div>
                        <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                          :configs="overrides[item].configs"
                                          :customConfigsValue="overrides[item].customConfigsValue"
                                          :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                          :image="overrides[item].image" :name="item"
                                          @changeModelValue="debouncedHandleModelValueChange"/>
                      </div>
                    </template>
                  </div>
                  <v-alert><span style="font-weight: bolder">世界规则</span> - 资源再生</v-alert>
                  <div class="item-container">
                    <template v-for="(item, i) in groundWorldRule.resourceRegrowth">
                      <div>
                        <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                          :configs="overrides[item].configs"
                                          :customConfigsValue="overrides[item].customConfigsValue"
                                          :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                          :image="overrides[item].image" :name="item"
                                          @changeModelValue="debouncedHandleModelValueChange"/>
                      </div>
                    </template>
                  </div>
                  <v-alert><span style="font-weight: bolder">世界规则</span> - 非自然传送门资源</v-alert>
                  <div class="item-container">
                    <template v-for="(item, i) in groundWorldRule.unnaturalPortalResource">
                      <div>
                        <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                          :configs="overrides[item].configs"
                                          :customConfigsValue="overrides[item].customConfigsValue"
                                          :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                          :image="overrides[item].image" :name="item"
                                          @changeModelValue="debouncedHandleModelValueChange"/>
                      </div>
                    </template>
                  </div>
                  <v-alert><span style="font-weight: bolder">世界规则</span> - 生物</v-alert>
                  <div class="item-container">
                    <template v-for="(item, i) in groundWorldRule.creatures">
                      <div>
                        <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                          :configs="overrides[item].configs"
                                          :customConfigsValue="overrides[item].customConfigsValue"
                                          :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                          :image="overrides[item].image" :name="item"
                                          @changeModelValue="debouncedHandleModelValueChange"/>
                      </div>
                    </template>
                  </div>
                  <v-alert><span style="font-weight: bolder">世界规则</span> - 敌对生物</v-alert>
                  <div class="item-container">
                    <template v-for="(item, i) in groundWorldRule.hostileCreatures">
                      <div>
                        <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                          :configs="overrides[item].configs"
                                          :customConfigsValue="overrides[item].customConfigsValue"
                                          :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                          :image="overrides[item].image" :name="item"
                                          @changeModelValue="debouncedHandleModelValueChange"/>
                      </div>
                    </template>
                  </div>
                  <v-alert><span style="font-weight: bolder">世界规则</span> - 巨兽</v-alert>
                  <div class="item-container">
                    <template v-for="(item, i) in groundWorldRule.giants">
                      <div>
                        <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                          :configs="overrides[item].configs"
                                          :customConfigsValue="overrides[item].customConfigsValue"
                                          :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                          :image="overrides[item].image" :name="item"
                                          @changeModelValue="debouncedHandleModelValueChange"/>
                      </div>
                    </template>
                  </div>
                  <v-alert><span style="font-weight: bolder">世界生成</span> - 全局</v-alert>
                  <div class="item-container">
                    <template v-for="(item, i) in groundWorldGeneration.global">
                      <div>
                        <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                          :configs="overrides[item].configs"
                                          :customConfigsValue="overrides[item].customConfigsValue"
                                          :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                          :image="overrides[item].image" :name="item"
                                          @changeModelValue="debouncedHandleModelValueChange"/>
                      </div>
                    </template>
                  </div>
                  <v-alert><span style="font-weight: bolder">世界生成</span> - 世界</v-alert>
                  <div class="item-container">
                    <template v-for="(item, i) in groundWorldGeneration.world">
                      <div>
                        <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                          :configs="overrides[item].configs"
                                          :customConfigsValue="overrides[item].customConfigsValue"
                                          :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                          :image="overrides[item].image" :name="item"
                                          @changeModelValue="debouncedHandleModelValueChange"/>
                      </div>
                    </template>
                  </div>
                  <v-alert><span style="font-weight: bolder">世界生成</span> - 资源</v-alert>
                  <div class="item-container">
                    <template v-for="(item, i) in groundWorldGeneration.resources">
                      <div>
                        <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                          :configs="overrides[item].configs"
                                          :customConfigsValue="overrides[item].customConfigsValue"
                                          :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                          :image="overrides[item].image" :name="item"
                                          @changeModelValue="debouncedHandleModelValueChange"/>
                      </div>
                    </template>
                  </div>
                  <v-alert><span style="font-weight: bolder">世界生成</span> - 生物以及刷新点</v-alert>
                  <div class="item-container">
                    <template v-for="(item, i) in groundWorldGeneration.creaturesAndSpawners">
                      <div>
                        <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                          :configs="overrides[item].configs"
                                          :customConfigsValue="overrides[item].customConfigsValue"
                                          :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                          :image="overrides[item].image" :name="item"
                                          @changeModelValue="debouncedHandleModelValueChange"/>
                      </div>
                    </template>
                  </div>
                  <v-alert><span style="font-weight: bolder">世界生成</span> - 敌对生物以及刷新点</v-alert>
                  <div class="item-container">
                    <template v-for="(item, i) in groundWorldGeneration.hostileCreaturesAndSpawners">
                      <div>
                        <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                          :configs="overrides[item].configs"
                                          :customConfigsValue="overrides[item].customConfigsValue"
                                          :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                          :image="overrides[item].image" :name="item"
                                          @changeModelValue="debouncedHandleModelValueChange"/>
                      </div>
                    </template>
                  </div>
                </div>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-container>
        </v-stepper-window-item>
        <v-stepper-window-item :value="2">
          <v-container height="700" style="overflow-y: auto">
            <v-tabs v-model="step3tab" align-tabs="start" class="v-tabs-pill" color="primary" show-arrows
                    @update:modelValue="handleStep3TabChange">
              <v-tab prepend-icon="ri-code-s-slash-line" value="Code">配置文件</v-tab>
              <v-tab v-if="
                (roomBaseForm.gameMode === 'endless' || roomBaseForm.gameMode === 'survival') &&
                roomCaveForm.caveSetting !== ''
              " prepend-icon="ri-image-ai-line" value="Visualization">可视化
              </v-tab>
            </v-tabs>
            <v-tabs-window v-model="step3tab">
              <v-tabs-window-item value="Code">
                <div class="d-flex flex-column gap-4 mt-2">
                  <v-alert color="grey-lighten-3" density="compact">
                    提示：如果你不想创建洞穴，请保持下方输入框为空
                  </v-alert>
                  <div>
                    <v-btn :disabled="roomBaseForm.gameMode !== 'endless'" class="mr-2"
                           color="info" prepend-icon="ri-download-2-line"
                           @click="handleImportLeveldataLua('caves', 'endless')">
                      导入标准无尽
                    </v-btn>
                    <v-btn :disabled="roomBaseForm.gameMode !== 'survival'" class="mr-2"
                           color="info" prepend-icon="ri-download-2-line"
                           @click="handleImportLeveldataLua('caves', 'survival')">
                      导入标准生存
                    </v-btn>
                  </div>
                  <ScCodeEditor ref="editorCavesSettingRef" v-model="roomCaveForm.caveSetting" :height="490"
                                :theme="globalStore.theme === 'dark' ? 'darcula' : 'idea'" class="mt-4" mode="lua"
                                style="width: 100%"></ScCodeEditor>
                </div>
              </v-tabs-window-item>
              <v-tabs-window-item value="Visualization">
                <div class="d-flex flex-column gap-4 mt-2">
                  <v-alert><span style="font-weight: bolder">世界规则</span> - 世界</v-alert>
                  <div class="item-container">
                    <template v-for="(item, i) in cavesWorldRule.world">
                      <div>
                        <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                          :configs="overrides[item].configs"
                                          :customConfigsValue="overrides[item].customConfigsValue"
                                          :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                          :image="overrides[item].image" :name="item"
                                          @changeModelValue="debouncedHandleCavesModelValueChange"/>
                      </div>
                    </template>
                  </div>
                  <v-alert><span style="font-weight: bolder">世界规则</span> - 资源再生</v-alert>
                  <div class="item-container">
                    <template v-for="(item, i) in cavesWorldRule.resourceRegrowth">
                      <div>
                        <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                          :configs="overrides[item].configs"
                                          :customConfigsValue="overrides[item].customConfigsValue"
                                          :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                          :image="overrides[item].image" :name="item"
                                          @changeModelValue="debouncedHandleCavesModelValueChange"/>
                      </div>
                    </template>
                  </div>
                  <v-alert><span style="font-weight: bolder">世界规则</span> - 生物</v-alert>
                  <div class="item-container">
                    <template v-for="(item, i) in cavesWorldRule.creatures">
                      <div>
                        <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                          :configs="overrides[item].configs"
                                          :customConfigsValue="overrides[item].customConfigsValue"
                                          :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                          :image="overrides[item].image" :name="item"
                                          @changeModelValue="debouncedHandleCavesModelValueChange"/>
                      </div>
                    </template>
                  </div>
                  <v-alert><span style="font-weight: bolder">世界规则</span> - 敌对生物</v-alert>
                  <div class="item-container">
                    <template v-for="(item, i) in cavesWorldRule.hostileCreatures">
                      <div>
                        <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                          :configs="overrides[item].configs"
                                          :customConfigsValue="overrides[item].customConfigsValue"
                                          :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                          :image="overrides[item].image" :name="item"
                                          @changeModelValue="debouncedHandleCavesModelValueChange"/>
                      </div>
                    </template>
                  </div>
                  <v-alert><span style="font-weight: bolder">世界规则</span> - 巨兽</v-alert>
                  <div class="item-container">
                    <template v-for="(item, i) in cavesWorldRule.giants">
                      <div>
                        <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                          :configs="overrides[item].configs"
                                          :customConfigsValue="overrides[item].customConfigsValue"
                                          :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                          :image="overrides[item].image" :name="item"
                                          @changeModelValue="debouncedHandleCavesModelValueChange"/>
                      </div>
                    </template>
                  </div>
                  <v-alert><span style="font-weight: bolder">世界生成</span> - 世界</v-alert>
                  <div class="item-container">
                    <template v-for="(item, i) in cavesWorldGeneration.world">
                      <div>
                        <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                          :configs="overrides[item].configs"
                                          :customConfigsValue="overrides[item].customConfigsValue"
                                          :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                          :image="overrides[item].image" :name="item"
                                          @changeModelValue="debouncedHandleCavesModelValueChange"/>
                      </div>
                    </template>
                  </div>
                  <v-alert><span style="font-weight: bolder">世界生成</span> - 资源</v-alert>
                  <div class="item-container">
                    <template v-for="(item, i) in cavesWorldGeneration.resources">
                      <div>
                        <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                          :configs="overrides[item].configs"
                                          :customConfigsValue="overrides[item].customConfigsValue"
                                          :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                          :image="overrides[item].image" :name="item"
                                          @changeModelValue="debouncedHandleCavesModelValueChange"/>
                      </div>
                    </template>
                  </div>
                  <v-alert><span style="font-weight: bolder">世界生成</span> - 生物以及刷新点</v-alert>
                  <div class="item-container">
                    <template v-for="(item, i) in cavesWorldGeneration.creaturesAndSpawners">
                      <div>
                        <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                          :configs="overrides[item].configs"
                                          :customConfigsValue="overrides[item].customConfigsValue"
                                          :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                          :image="overrides[item].image" :name="item"
                                          @changeModelValue="debouncedHandleCavesModelValueChange"/>
                      </div>
                    </template>
                  </div>
                  <v-alert><span style="font-weight: bolder">世界生成</span> - 敌对生物以及刷新点</v-alert>
                  <div class="item-container">
                    <template v-for="(item, i) in cavesWorldGeneration.hostileCreaturesAndSpawners">
                      <div>
                        <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                          :configs="overrides[item].configs"
                                          :customConfigsValue="overrides[item].customConfigsValue"
                                          :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                          :image="overrides[item].image" :name="item"
                                          @changeModelValue="debouncedHandleCavesModelValueChange"/>
                      </div>
                    </template>
                  </div>
                </div>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-container>
        </v-stepper-window-item>
        <v-stepper-window-item :value="3">
          <v-container height="700" style="overflow-y: auto">
            <ScCodeEditor ref="roomModFormRef" v-model="roomModForm.modSetting" :height="650"
                          :theme="globalStore.theme === 'dark' ? 'darcula' : 'idea'" class="mt-4" mode="lua"
                          style="width: 100%"></ScCodeEditor>
          </v-container>
        </v-stepper-window-item>
        <v-stepper-window-item :value="4">
          <v-container height="700" style="overflow-y: auto">
            <div class="d-flex flex-column align-center justify-center" style="height: 600px">
              <v-icon color="success" size="128" icon="ri-checkbox-circle-fill"/>
              <div style="font-size: 3rem; font-weight: 300; line-height: 1; letter-spacing: -0.015625em">
                配置成功
              </div>
              <div style="font-size: 1.2rem; font-weight: 300; line-height: 1; letter-spacing: -0.015625em"
                   class="mt-4"
              >
                已完成所有配置，点击下方按钮执行不同操作
              </div>
            </div>
          </v-container>
        </v-stepper-window-item>
      </v-stepper-window>
      <v-stepper-actions>
        <template #prev>
          <v-btn color="grey-lighten-3" variant="tonal" @click="step--">上一步</v-btn>
        </template>
        <template #next>
          <v-btn v-if="step!==4" color="primary" variant="elevated" @click="handleNext">下一步</v-btn>
          <v-menu open-on-hover>
            <template v-slot:activator="{ props }">
              <v-btn v-if="step===4" :disabled="false" color="success" prepend-icon="ri-list-unordered"
                     variant="elevated" v-bind="props" :loading="loading">
                操作
              </v-btn>
            </template>
            <v-list>
              <v-list-item title="保存" @click="handleSave" />
              <v-list-item title="保存并重启" @click="handleSaveAndRestart" />
              <v-list-item title="生成新世界" @click="handleGenerateNewWorld" />
            </v-list>
          </v-menu>
        </template>
      </v-stepper-actions>
    </v-stepper>
  </template>
  <template v-if="isMultiHost">
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-item :color="step > 0 ? 'success' : ''" :complete="step > 0" :value="0" title="房间设置">
          <template #icon>
            <v-icon icon="ri-number-1" size="12"></v-icon>
          </template>
        </v-stepper-item>
        <v-divider></v-divider>

        <v-stepper-item :color="step > 1 ? 'success' : ''" :complete="step > 1" :value="1" title="世界设置">
          <template #icon>
            <v-icon icon="ri-number-2" size="12"></v-icon>
          </template>
        </v-stepper-item>
        <v-divider></v-divider>

        <v-stepper-item :color="step > 2 ? 'success' : ''" :complete="step > 3" :value="3" title="模组设置">
          <template #icon>
            <v-icon icon="ri-number-3" size="12"></v-icon>
          </template>
        </v-stepper-item>
        <v-divider></v-divider>

        <v-stepper-item :color="step > 3 ? 'success' : ''" :complete="step > 4" :value="4" title="设置完成">
          <template #icon>
            <v-icon icon="ri-number-4" size="12"></v-icon>
          </template>
        </v-stepper-item>
      </v-stepper-header>
      <v-stepper-window v-model="step">
        <v-stepper-window-item :value="0">
          <v-container height="700" style="overflow-y: auto">
            <v-form ref="roomBaseFormRef" class="mt-4" fast-fail>
              <v-container>
                <v-row>
                  <v-col cols="6">
                    <div style="display: flex; align-items: center">
                      <span>当前模式为：</span>
                      <v-chip prepend-icon="ri-pin-distance-line">多机器模式</v-chip>
                      <v-btn class="ml-1" variant="text" @click="handleChangeMultiHost(false)">点击切换为单机器模式</v-btn>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="roomBaseForm.name" :rules="roomBaseFormRules.name" clearable
                                  label="房间名"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="roomBaseForm.description" clearable label="房间描述"></v-text-field>
                  </v-col>
                  <v-col class="mt-10" cols="6">
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
                  <v-col class="mt-10" cols="3">
                    <v-switch v-model="roomBaseForm.pvp" inset>
                      <template #prepend>
                        <span>玩家对战</span>
                      </template>
                    </v-switch>
                  </v-col>
                  <v-col class="mt-10" cols="3">
                    <v-switch v-model="roomBaseForm.vote" inset>
                      <template #prepend>
                        <span>玩家投票</span>
                      </template>
                    </v-switch>
                  </v-col>
                  <v-col cols="6">
                    <v-slider v-model="roomBaseForm.playerNum" :max="99" :min="2" class="align-center" hide-details
                              step="1" style="margin-left: -1px">
                      <template #label>
                        <span>玩家数量</span>
                      </template>
                      <template v-slot:append>
                        <v-chip>
                          {{ roomBaseForm.playerNum }}
                        </v-chip>
                      </template>
                    </v-slider>
                  </v-col>
                  <v-col cols="6">
                    <v-slider v-model="roomBaseForm.backDays" :max="50" :min="5" class="align-center" hide-details
                              step="1" style="margin-left: -1px">
                      <template #label>
                        <span>回档天数</span>
                      </template>
                      <template v-slot:append>
                        <v-chip>
                          {{ roomBaseForm.backDays }}
                        </v-chip>
                      </template>
                    </v-slider>
                  </v-col>
                  <v-col class="mt-10" cols="12">
                    <v-text-field v-model="roomBaseForm.password" clearable label="房间密码" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="roomBaseForm.token" :rules="roomBaseFormRules.token" clearable
                                  label="游戏令牌"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-container>
        </v-stepper-window-item>
        <v-stepper-window-item :value="1">
          <v-container height="700" style="overflow-y: auto">
            <v-row>
              <v-col cols="12">
                <div>
                  <v-radio-group v-model="multiHostIsMaster" inline @update:modelValue="clearSetting">
                    <template #prepend>
                      <span>游戏模式</span>
                    </template>
                    <v-radio label="地面" :value="true"/>
                    <v-radio label="洞穴" :value="false"/>
                  </v-radio-group>
                </div>
              </v-col>
            </v-row>
            <template v-if="multiHostIsMaster">
              <v-tabs v-model="step2tab" align-tabs="start" class="v-tabs-pill" color="primary" show-arrows
                      @update:modelValue="handleStep2TabChange">
                <v-tab prepend-icon="ri-code-s-slash-line" value="Code">配置文件</v-tab>
                <v-tab v-if="
                (roomBaseForm.gameMode === 'endless' || roomBaseForm.gameMode === 'survival') &&
                roomGroundForm.groundSetting !== ''
              " prepend-icon="ri-image-ai-line" value="Visualization">可视化
                </v-tab>
              </v-tabs>
              <v-tabs-window v-model="step2tab">
                <v-tabs-window-item value="Code">
                  <div class="d-flex flex-column gap-4 mt-2">
                    <div>
                      <v-btn :disabled="roomBaseForm.gameMode !== 'endless'" class="mr-2"
                             color="info" prepend-icon="ri-download-2-line"
                             @click="handleImportLeveldataLua('master', 'endless')">
                        导入标准无尽
                      </v-btn>
                      <v-btn :disabled="roomBaseForm.gameMode !== 'survival'" class="mr-2"
                             color="info" prepend-icon="ri-download-2-line"
                             @click="handleImportLeveldataLua('master', 'survival')">
                        导入标准生存
                      </v-btn>
                    </div>
                    <div>
                      <v-form ref="roomBaseFormRef" class="mt-4" fast-fail>
                        <v-row>
                          <v-col cols="4">
                            <v-number-input v-model="roomBaseForm.masterPort" :rules="roomBaseFormRules.masterPort"
                                            control-variant="stacked" inset label="地面端口" variant="outlined">
                              <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                                server.ini - [NETWORK] - server_port
                              </v-tooltip>
                            </v-number-input>
                          </v-col>
                          <v-col cols="4">
                            <v-number-input v-model="roomBaseForm.shardMasterPort" :rules="roomBaseFormRules.shardMasterPort"
                                            control-variant="stacked" inset label="侦听端口" variant="outlined">
                              <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                                cluster.ini - [SHARD] - master_port
                              </v-tooltip>
                            </v-number-input>
                          </v-col>
                          <v-col cols="4">
                            <v-number-input v-model="roomBaseForm.steamMasterPort" :rules="roomBaseFormRules.steamMasterPort"
                                            control-variant="stacked" inset label="steam连接端口" variant="outlined">
                              <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                                server.ini - [STEAM] - server_master_port
                              </v-tooltip>
                            </v-number-input>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="4">
                            <v-number-input v-model="roomBaseForm.steamAuthenticationPort"
                                            :rules="roomBaseFormRules.steamAuthenticationPort"
                                            control-variant="stacked" inset label="steam认证端口" variant="outlined">
                              <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                                server.ini - [STEAM] - authentication_port
                              </v-tooltip>
                            </v-number-input>
                          </v-col>
                          <v-col cols="4">
                            <v-text-field v-model="roomBaseForm.shardMasterIp" :rules="roomBaseFormRules.shardMasterIp" clearable
                                          label="Master IP" disabled>
                              <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                                cluster.ini - [SHARD] - master_ip
                              </v-tooltip>
                            </v-text-field>
                          </v-col>
                          <v-col cols="4">
                            <v-text-field v-model="roomBaseForm.clusterKey" :rules="roomBaseFormRules.clusterKey" clearable
                                          label="认证密码">
                              <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                                cluster.ini - [SHARD] - cluster_key
                              </v-tooltip>
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </v-form>
                    </div>
                    <ScCodeEditor ref="editorGroundSettingRef" v-model="roomGroundForm.groundSetting" :height="550"
                                  :theme="globalStore.theme === 'dark' ? 'darcula' : 'idea'" class="mt-4" mode="lua"
                                  style="width: 100%"></ScCodeEditor>
                  </div>
                </v-tabs-window-item>
                <v-tabs-window-item value="Visualization">
                  <div class="d-flex flex-column gap-4 mt-2">
                    <v-alert><span style="font-weight: bolder">世界规则</span> - 全局</v-alert>
                    <div class="item-container">
                      <template v-for="(item, i) in groundWorldRule.global">
                        <div>
                          <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                            :configs="overrides[item].configs"
                                            :customConfigsValue="overrides[item].customConfigsValue"
                                            :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                            :image="overrides[item].image" :name="item"
                                            @changeModelValue="debouncedHandleModelValueChange"/>
                        </div>
                      </template>
                    </div>
                    <v-alert><span style="font-weight: bolder">世界规则</span> - 活动</v-alert>
                    <div class="item-container">
                      <template v-for="(item, i) in groundWorldRule.events">
                        <div>
                          <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                            :configs="overrides[item].configs"
                                            :customConfigsValue="overrides[item].customConfigsValue"
                                            :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                            :image="overrides[item].image" :name="item"
                                            @changeModelValue="debouncedHandleModelValueChange"/>
                        </div>
                      </template>
                    </div>
                    <v-alert><span style="font-weight: bolder">世界规则</span> - 冒险家</v-alert>
                    <div class="item-container">
                      <template v-for="(item, i) in groundWorldRule.survivors">
                        <div>
                          <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                            :configs="overrides[item].configs"
                                            :customConfigsValue="overrides[item].customConfigsValue"
                                            :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                            :image="overrides[item].image" :name="item"
                                            @changeModelValue="debouncedHandleModelValueChange"/>
                        </div>
                      </template>
                    </div>
                    <v-alert><span style="font-weight: bolder">世界规则</span> - 世界</v-alert>
                    <div class="item-container">
                      <template v-for="(item, i) in groundWorldRule.world">
                        <div>
                          <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                            :configs="overrides[item].configs"
                                            :customConfigsValue="overrides[item].customConfigsValue"
                                            :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                            :image="overrides[item].image" :name="item"
                                            @changeModelValue="debouncedHandleModelValueChange"/>
                        </div>
                      </template>
                    </div>
                    <v-alert><span style="font-weight: bolder">世界规则</span> - 资源再生</v-alert>
                    <div class="item-container">
                      <template v-for="(item, i) in groundWorldRule.resourceRegrowth">
                        <div>
                          <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                            :configs="overrides[item].configs"
                                            :customConfigsValue="overrides[item].customConfigsValue"
                                            :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                            :image="overrides[item].image" :name="item"
                                            @changeModelValue="debouncedHandleModelValueChange"/>
                        </div>
                      </template>
                    </div>
                    <v-alert><span style="font-weight: bolder">世界规则</span> - 非自然传送门资源</v-alert>
                    <div class="item-container">
                      <template v-for="(item, i) in groundWorldRule.unnaturalPortalResource">
                        <div>
                          <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                            :configs="overrides[item].configs"
                                            :customConfigsValue="overrides[item].customConfigsValue"
                                            :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                            :image="overrides[item].image" :name="item"
                                            @changeModelValue="debouncedHandleModelValueChange"/>
                        </div>
                      </template>
                    </div>
                    <v-alert><span style="font-weight: bolder">世界规则</span> - 生物</v-alert>
                    <div class="item-container">
                      <template v-for="(item, i) in groundWorldRule.creatures">
                        <div>
                          <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                            :configs="overrides[item].configs"
                                            :customConfigsValue="overrides[item].customConfigsValue"
                                            :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                            :image="overrides[item].image" :name="item"
                                            @changeModelValue="debouncedHandleModelValueChange"/>
                        </div>
                      </template>
                    </div>
                    <v-alert><span style="font-weight: bolder">世界规则</span> - 敌对生物</v-alert>
                    <div class="item-container">
                      <template v-for="(item, i) in groundWorldRule.hostileCreatures">
                        <div>
                          <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                            :configs="overrides[item].configs"
                                            :customConfigsValue="overrides[item].customConfigsValue"
                                            :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                            :image="overrides[item].image" :name="item"
                                            @changeModelValue="debouncedHandleModelValueChange"/>
                        </div>
                      </template>
                    </div>
                    <v-alert><span style="font-weight: bolder">世界规则</span> - 巨兽</v-alert>
                    <div class="item-container">
                      <template v-for="(item, i) in groundWorldRule.giants">
                        <div>
                          <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                            :configs="overrides[item].configs"
                                            :customConfigsValue="overrides[item].customConfigsValue"
                                            :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                            :image="overrides[item].image" :name="item"
                                            @changeModelValue="debouncedHandleModelValueChange"/>
                        </div>
                      </template>
                    </div>
                    <v-alert><span style="font-weight: bolder">世界生成</span> - 全局</v-alert>
                    <div class="item-container">
                      <template v-for="(item, i) in groundWorldGeneration.global">
                        <div>
                          <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                            :configs="overrides[item].configs"
                                            :customConfigsValue="overrides[item].customConfigsValue"
                                            :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                            :image="overrides[item].image" :name="item"
                                            @changeModelValue="debouncedHandleModelValueChange"/>
                        </div>
                      </template>
                    </div>
                    <v-alert><span style="font-weight: bolder">世界生成</span> - 世界</v-alert>
                    <div class="item-container">
                      <template v-for="(item, i) in groundWorldGeneration.world">
                        <div>
                          <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                            :configs="overrides[item].configs"
                                            :customConfigsValue="overrides[item].customConfigsValue"
                                            :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                            :image="overrides[item].image" :name="item"
                                            @changeModelValue="debouncedHandleModelValueChange"/>
                        </div>
                      </template>
                    </div>
                    <v-alert><span style="font-weight: bolder">世界生成</span> - 资源</v-alert>
                    <div class="item-container">
                      <template v-for="(item, i) in groundWorldGeneration.resources">
                        <div>
                          <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                            :configs="overrides[item].configs"
                                            :customConfigsValue="overrides[item].customConfigsValue"
                                            :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                            :image="overrides[item].image" :name="item"
                                            @changeModelValue="debouncedHandleModelValueChange"/>
                        </div>
                      </template>
                    </div>
                    <v-alert><span style="font-weight: bolder">世界生成</span> - 生物以及刷新点</v-alert>
                    <div class="item-container">
                      <template v-for="(item, i) in groundWorldGeneration.creaturesAndSpawners">
                        <div>
                          <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                            :configs="overrides[item].configs"
                                            :customConfigsValue="overrides[item].customConfigsValue"
                                            :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                            :image="overrides[item].image" :name="item"
                                            @changeModelValue="debouncedHandleModelValueChange"/>
                        </div>
                      </template>
                    </div>
                    <v-alert><span style="font-weight: bolder">世界生成</span> - 敌对生物以及刷新点</v-alert>
                    <div class="item-container">
                      <template v-for="(item, i) in groundWorldGeneration.hostileCreaturesAndSpawners">
                        <div>
                          <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                            :configs="overrides[item].configs"
                                            :customConfigsValue="overrides[item].customConfigsValue"
                                            :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                            :image="overrides[item].image" :name="item"
                                            @changeModelValue="debouncedHandleModelValueChange"/>
                        </div>
                      </template>
                    </div>
                  </div>
                </v-tabs-window-item>
              </v-tabs-window>
            </template>
            <template v-else>
              <v-tabs v-model="step3tab" align-tabs="start" class="v-tabs-pill" color="primary" show-arrows
                      @update:modelValue="handleStep3TabChange">
                <v-tab prepend-icon="ri-code-s-slash-line" value="Code">配置文件</v-tab>
                <v-tab v-if="(roomBaseForm.gameMode === 'endless' || roomBaseForm.gameMode === 'survival') && roomCaveForm.caveSetting !== ''"
                       prepend-icon="ri-image-ai-line" value="Visualization">
                  可视化
                </v-tab>
              </v-tabs>
              <v-tabs-window v-model="step3tab">
                <v-tabs-window-item value="Code">
                  <div class="d-flex flex-column gap-4 mt-2">
                    <div>
                      <v-btn :disabled="roomBaseForm.gameMode !== 'endless'" class="mr-2"
                             color="info" prepend-icon="ri-download-2-line"
                             @click="handleImportLeveldataLua('caves', 'endless')">
                        导入标准无尽
                      </v-btn>
                      <v-btn :disabled="roomBaseForm.gameMode !== 'survival'" class="mr-2"
                             color="info" prepend-icon="ri-download-2-line"
                             @click="handleImportLeveldataLua('caves', 'survival')">
                        导入标准生存
                      </v-btn>
                    </div>
                    <div>
                      <v-form ref="roomBaseFormRef" class="mt-4" fast-fail>
                        <v-row>
                          <v-col cols="4">
                            <v-number-input v-model="roomBaseForm.cavesPort" :rules="roomBaseFormRules.cavesPort"
                                            control-variant="stacked" inset label="洞穴端口" variant="outlined">
                              <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                                server.ini - [NETWORK] - server_port
                              </v-tooltip>
                            </v-number-input>
                          </v-col>
                          <v-col cols="4">
                            <v-number-input v-model="roomBaseForm.shardMasterPort" :rules="roomBaseFormRules.shardMasterPort"
                                            control-variant="stacked" inset label="侦听端口" variant="outlined">
                              <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                                cluster.ini - [SHARD] - master_port
                              </v-tooltip>
                            </v-number-input>
                          </v-col>
                          <v-col cols="4">
                            <v-number-input v-model="roomBaseForm.steamMasterPort" :rules="roomBaseFormRules.steamMasterPort"
                                            control-variant="stacked" inset label="steam连接端口" variant="outlined">
                              <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                                server.ini - [STEAM] - server_master_port
                              </v-tooltip>
                            </v-number-input>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="4">
                            <v-number-input v-model="roomBaseForm.steamAuthenticationPort"
                                            :rules="roomBaseFormRules.steamAuthenticationPort"
                                            control-variant="stacked" inset label="steam认证端口" variant="outlined">
                              <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                                server.ini - [STEAM] - authentication_port
                              </v-tooltip>
                            </v-number-input>
                          </v-col>
                          <v-col cols="4">
                            <v-text-field v-model="roomBaseForm.shardMasterIp" :rules="roomBaseFormRules.shardMasterIp" clearable
                                          label="Master IP">
                              <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                                cluster.ini - [SHARD] - master_ip
                              </v-tooltip>
                            </v-text-field>
                          </v-col>
                          <v-col cols="4">
                            <v-text-field v-model="roomBaseForm.clusterKey" :rules="roomBaseFormRules.clusterKey" clearable
                                          label="认证密码">
                              <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                                cluster.ini - [SHARD] - cluster_key
                              </v-tooltip>
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </v-form>
                    </div>
                    <ScCodeEditor ref="editorCavesSettingRef" v-model="roomCaveForm.caveSetting" :height="490"
                                  :theme="globalStore.theme === 'dark' ? 'darcula' : 'idea'" class="mt-4" mode="lua"
                                  style="width: 100%"></ScCodeEditor>
                  </div>
                </v-tabs-window-item>
                <v-tabs-window-item value="Visualization">
                  <div class="d-flex flex-column gap-4 mt-2">
                    <v-alert><span style="font-weight: bolder">世界规则</span> - 世界</v-alert>
                    <div class="item-container">
                      <template v-for="(item, i) in cavesWorldRule.world">
                        <div>
                          <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                            :configs="overrides[item].configs"
                                            :customConfigsValue="overrides[item].customConfigsValue"
                                            :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                            :image="overrides[item].image" :name="item"
                                            @changeModelValue="debouncedHandleCavesModelValueChange"/>
                        </div>
                      </template>
                    </div>
                    <v-alert><span style="font-weight: bolder">世界规则</span> - 资源再生</v-alert>
                    <div class="item-container">
                      <template v-for="(item, i) in cavesWorldRule.resourceRegrowth">
                        <div>
                          <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                            :configs="overrides[item].configs"
                                            :customConfigsValue="overrides[item].customConfigsValue"
                                            :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                            :image="overrides[item].image" :name="item"
                                            @changeModelValue="debouncedHandleCavesModelValueChange"/>
                        </div>
                      </template>
                    </div>
                    <v-alert><span style="font-weight: bolder">世界规则</span> - 生物</v-alert>
                    <div class="item-container">
                      <template v-for="(item, i) in cavesWorldRule.creatures">
                        <div>
                          <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                            :configs="overrides[item].configs"
                                            :customConfigsValue="overrides[item].customConfigsValue"
                                            :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                            :image="overrides[item].image" :name="item"
                                            @changeModelValue="debouncedHandleCavesModelValueChange"/>
                        </div>
                      </template>
                    </div>
                    <v-alert><span style="font-weight: bolder">世界规则</span> - 敌对生物</v-alert>
                    <div class="item-container">
                      <template v-for="(item, i) in cavesWorldRule.hostileCreatures">
                        <div>
                          <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                            :configs="overrides[item].configs"
                                            :customConfigsValue="overrides[item].customConfigsValue"
                                            :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                            :image="overrides[item].image" :name="item"
                                            @changeModelValue="debouncedHandleCavesModelValueChange"/>
                        </div>
                      </template>
                    </div>
                    <v-alert><span style="font-weight: bolder">世界规则</span> - 巨兽</v-alert>
                    <div class="item-container">
                      <template v-for="(item, i) in cavesWorldRule.giants">
                        <div>
                          <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                            :configs="overrides[item].configs"
                                            :customConfigsValue="overrides[item].customConfigsValue"
                                            :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                            :image="overrides[item].image" :name="item"
                                            @changeModelValue="debouncedHandleCavesModelValueChange"/>
                        </div>
                      </template>
                    </div>
                    <v-alert><span style="font-weight: bolder">世界生成</span> - 世界</v-alert>
                    <div class="item-container">
                      <template v-for="(item, i) in cavesWorldGeneration.world">
                        <div>
                          <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                            :configs="overrides[item].configs"
                                            :customConfigsValue="overrides[item].customConfigsValue"
                                            :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                            :image="overrides[item].image" :name="item"
                                            @changeModelValue="debouncedHandleCavesModelValueChange"/>
                        </div>
                      </template>
                    </div>
                    <v-alert><span style="font-weight: bolder">世界生成</span> - 资源</v-alert>
                    <div class="item-container">
                      <template v-for="(item, i) in cavesWorldGeneration.resources">
                        <div>
                          <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                            :configs="overrides[item].configs"
                                            :customConfigsValue="overrides[item].customConfigsValue"
                                            :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                            :image="overrides[item].image" :name="item"
                                            @changeModelValue="debouncedHandleCavesModelValueChange"/>
                        </div>
                      </template>
                    </div>
                    <v-alert><span style="font-weight: bolder">世界生成</span> - 生物以及刷新点</v-alert>
                    <div class="item-container">
                      <template v-for="(item, i) in cavesWorldGeneration.creaturesAndSpawners">
                        <div>
                          <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                            :configs="overrides[item].configs"
                                            :customConfigsValue="overrides[item].customConfigsValue"
                                            :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                            :image="overrides[item].image" :name="item"
                                            @changeModelValue="debouncedHandleCavesModelValueChange"/>
                        </div>
                      </template>
                    </div>
                    <v-alert><span style="font-weight: bolder">世界生成</span> - 敌对生物以及刷新点</v-alert>
                    <div class="item-container">
                      <template v-for="(item, i) in cavesWorldGeneration.hostileCreaturesAndSpawners">
                        <div>
                          <LevelDataSetting :key="i" v-model="overridesObj[item]"
                                            :configs="overrides[item].configs"
                                            :customConfigsValue="overrides[item].customConfigsValue"
                                            :defaultModelValue="overrides[item].modelValue" :i18n="overrides[item].i18n"
                                            :image="overrides[item].image" :name="item"
                                            @changeModelValue="debouncedHandleCavesModelValueChange"/>
                        </div>
                      </template>
                    </div>
                  </div>
                </v-tabs-window-item>
              </v-tabs-window>
            </template>
          </v-container>
        </v-stepper-window-item>
        <v-stepper-window-item :value="2">
          <v-container height="700" style="overflow-y: auto">
            <ScCodeEditor ref="roomModFormRef" v-model="roomModForm.modSetting" :height="650"
                          :theme="globalStore.theme === 'dark' ? 'darcula' : 'idea'" class="mt-4" mode="lua"
                          style="width: 100%"></ScCodeEditor>
          </v-container>
        </v-stepper-window-item>
        <v-stepper-window-item :value="3">
          <v-container height="700" style="overflow-y: auto">
            <div class="d-flex flex-column align-center justify-center" style="height: 600px">
              <v-icon color="success" size="128" icon="ri-checkbox-circle-fill"/>
              <div style="font-size: 3rem; font-weight: 300; line-height: 1; letter-spacing: -0.015625em">
                配置成功
              </div>
              <div style="font-size: 1.2rem; font-weight: 300; line-height: 1; letter-spacing: -0.015625em"
                   class="mt-4"
              >
                已完成所有配置，点击下方按钮执行不同操作
              </div>
            </div>
          </v-container>
        </v-stepper-window-item>
      </v-stepper-window>
      <v-stepper-actions>
        <template #prev>
          <v-btn color="grey-lighten-3" variant="tonal" @click="step--">上一步</v-btn>
        </template>
        <template #next>
          <v-btn v-if="step!==3" color="primary" variant="elevated" @click="handleNext">下一步</v-btn>
          <v-menu open-on-hover>
            <template v-slot:activator="{ props }">
              <v-btn v-if="step===3" :disabled="false" color="success" prepend-icon="ri-list-unordered"
                     variant="elevated" v-bind="props">
                操作
              </v-btn>
            </template>
            <v-list>
              <v-list-item title="保存" @click="handleSave" />
              <v-list-item title="保存并重启" @click="handleSaveAndRestart" />
              <v-list-item title="生成新世界" @click="handleGenerateNewWorld" />
            </v-list>
          </v-menu>
        </template>
      </v-stepper-actions>
    </v-stepper>
  </template>
</template>

<script setup>
import {VNumberInput} from "vuetify/labs/VNumberInput";
import settingApi from "@/api/setting.js";
import {endless, survival} from "@/views/settings/components/leveldataoverride.js";
import useGlobalStore from "@/plugins/pinia/global";
import ScCodeEditor from "@/components/ScCodeEditor.vue";
import luaparse from "luaparse";
import luamin from "lua-format";
import LevelDataSetting from "@/views/settings/components/levelDataSetting.vue";
import {
  cavesWorldGeneration,
  cavesWorldRule,
  groundWorldGeneration,
  groundWorldRule,
  overrides,
} from "@/views/settings/components/levelDataMap.js";
import { showSnackbar } from "@/utils/snackbar";
import {sleep} from "@antfu/utils";
import {validateIpv4} from "@/utils/tools";

// 添加防抖函数
const debounce = (fn, delay) => {
  let timer = null;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const debouncedRefresh = debounce((editor) => {
  requestAnimationFrame(() => {
    if (editor) {
      editor.refresh();
    }
  });
}, 100);

const debouncedHandleModelValueChange = debounce((data) => {
  const key = data.name;
  const value = data.value;
  const ast = luaparse.parse(roomGroundForm.value.groundSetting);
  // 提取 overrides 字段
  const overridesTable = extractOverrides(ast);
  // console.log(overridesTable)
  for (let field of overridesTable.fields) {
    if (field.key.name === key) {
      field.value.raw = `"${value}"`;
    }
  }
  roomGroundForm.value.groundSetting = astToLua(ast)
  debouncedRefresh(editorGroundSettingRef.value);
}, 100);
const debouncedHandleCavesModelValueChange = debounce((data) => {
  const key = data.name;
  const value = data.value;
  const ast = luaparse.parse(roomCaveForm.value.caveSetting);
  // 提取 overrides 字段
  const overridesTable = extractOverrides(ast);
  // console.log(overridesTable)
  for (let field of overridesTable.fields) {
    if (field.key.name === key) {
      field.value.raw = `"${value}"`;
    }
  }
  roomCaveForm.value.caveSetting = astToLua(ast);
  debouncedRefresh(editorCavesSettingRef.value);
}, 100);

onMounted(async () => {
  await getMultiHost();
  await handleGetCurrentRoomSetting();
});

const globalStore = useGlobalStore();
const router = useRouter();

const loading = ref(false)

const isMultiHost = ref(false);
const getMultiHost = async () => {
  await settingApi.multihost.get().then((response) => {
    isMultiHost.value = response.data;
  });
};

const step = ref(0);
const handleNext = async () => {
  if (isMultiHost.value) {
    if (step.value === 0) {
      const {valid} = await roomBaseFormRef.value.validate();
      if (valid) {
        step.value++;
      }
      return;
    }
    if (step.value === 1) {
      const {valid} = await roomBaseFormRef.value.validate();
      if (valid) {
        if (multiHostIsMaster.value) {
          if (roomGroundForm.value.groundSetting === '') {
            showSnackbar("请输入地面设置", "error");
            return
          }
          try {
            luaparse.parse(roomGroundForm.value.groundSetting)
            step.value++
          } catch (e) {
            showSnackbar("lua文件格式校验失败，请检查", "error");
          }
        } else {
          if (roomCaveForm.value.caveSetting === '') {
            showSnackbar("请输入洞穴设置", "error");
            return
          }
          try {
            luaparse.parse(roomCaveForm.value.caveSetting)
            step.value++
          } catch (e) {
            showSnackbar("lua文件格式校验失败，请检查", "error");
          }
        }
      }
      return;
    }
    if (step.value === 2) {
      try {
        luaparse.parse(roomModForm.value.modSetting);
        step.value++;
      } catch (e) {
        showSnackbar("lua文件格式校验失败，请检查", "error");
      }
    }
  } else {
    if (step.value === 0) {
      const {valid} = await roomBaseFormRef.value.validate();
      if (valid) {
        step.value++;
      }
      return;
    }
    if (step.value === 1) {
      if (!roomGroundForm.value.groundSetting) {
        showSnackbar("地面设置不能为空", "error");
        return;
      }
      try {
        luaparse.parse(roomGroundForm.value.groundSetting);
        step.value++;
        return
      } catch (e) {
        showSnackbar("lua文件格式校验失败，请检查", "error");
      }
    }
    if (step.value === 2) {
      try {
        luaparse.parse(roomCaveForm.value.caveSetting);
        step.value++;
        return
      } catch (e) {
        showSnackbar("lua文件格式校验失败，请检查", "error");
      }
    }
    if (step.value === 3) {
      try {
        luaparse.parse(roomModForm.value.modSetting);
        step.value++;
      } catch (e) {
        showSnackbar("lua文件格式校验失败，请检查", "error");
      }
    }
  }
};

const roomBaseFormRef = ref();
const roomBaseForm = ref({
  name: "",
  description: "",
  gameMode: "",
  pvp: false,
  playerNum: 6,
  backDays: 10,
  vote: true,
  password: "",
  token: "",
  masterPort: 0,
  cavesPort: 0,
  shardMasterPort: undefined,
  steamMasterPort: undefined,
  steamAuthenticationPort: undefined,
  shardMasterIp: undefined,
  clusterKey: undefined,
});
const roomBaseFormRules = {
  name: [
    (value) => {
      if (value) {
        return true;
      }
      return "请输入房间名";
    },
  ],
  masterPort: [
    (value) => {
      if (value) {
        if (value >= 0 && value <= 65535) {
          if (value === roomBaseForm.value.cavesPort) {
            return "地面洞穴端口不能相同";
          } else {
            return true;
          }
        } else {
          return "端口范围：1-65535";
        }
      }
      return "请输入地面端口";
    },
  ],
  cavesPort: [
    (value) => {
      if (value) {
        if (value >= 0 && value <= 65535) {
          if (value === roomBaseForm.value.masterPort) {
            return "地面洞穴端口不能相同";
          } else {
            return true;
          }
        } else {
          return "端口范围：1-65535";
        }
      }
      return "请输入地面端口";
    },
  ],
  token: [
    (value) => {
      if (value) {
        return true;
      }
      return "请输入游戏令牌";
    },
  ],
  shardMasterPort: [
    (value) => {
      if (value) {
        if (value >= 0 && value <= 65535) {
          return true;
        } else {
          return "端口范围：1-65535";
        }
      }
      return "请输入侦听端口";
    },
  ],
  steamMasterPort: [
    (value) => {
      if (value) {
        if (value >= 0 && value <= 65535) {
          return true;
        } else {
          return "端口范围：1-65535";
        }
      }
      return "请输入steam连接端口";
    },
  ],
  shardMasterIp: [
    (value) => {
      if (value) {
        return validateIpv4(value)
      }
      return "请输入Master IP";
    },
  ],
  steamAuthenticationPort: [
    (value) => {
      if (value) {
        if (value >= 0 && value <= 65535) {
          return true;
        } else {
          return "端口范围：1-65535";
        }
      }
      return "请输入steam认证端口";
    },
  ],
  clusterKey: [
    (value) => {
      if (value) {
        return true;
      }
      return "请输入认证密码";
    },
  ],
};

const roomGroundFormRef = ref();
const roomGroundForm = ref({
  groundSetting: "",
});

const roomCaveFormRef = ref();
const roomCaveForm = ref({
  caveSetting: "",
});

const roomModFormRef = ref();
const roomModForm = ref({
  modSetting: "",
});

const multiHostIsMaster = ref(true);

const handleGetCurrentRoomSetting = () => {
  settingApi.room.get().then((response) => {
    roomBaseForm.value = response.data.base;
    roomGroundForm.value.groundSetting = response.data.ground;
    roomCaveForm.value.caveSetting = response.data.cave;
    roomModForm.value.modSetting = response.data.mod;
    if (roomGroundForm.value.groundSetting === "") {
      multiHostIsMaster.value = false;
    } else {
      if (roomCaveForm.value.caveSetting === "") {
        multiHostIsMaster.value = true;
      } else {
        multiHostIsMaster.value = true;
      }
    }
    if (roomBaseForm.value.masterPort === 0) {
      roomBaseForm.value.masterPort = 11000;
    }
    if (roomBaseForm.value.cavesPort === 0) {
      roomBaseForm.value.cavesPort = 11001;
    }
  });
};

const step2tab = ref("Code");
const handleStep2TabChange = async (tab) => {
  if (tab === "Visualization") {
    try {
      generateGroundOverridesObj();
    } catch {
      showSnackbar("生成可视化配置失败", "error")
    }
  }
  if (tab === "Code") {
    roomGroundForm.value.groundSetting = beautifyLua(roomGroundForm.value.groundSetting);
    requestAnimationFrame(() => {
      if (editorGroundSettingRef.value) {
        editorGroundSettingRef.value.refresh();
      }
    });
  }
};
const step3tab = ref("Code");
const handleStep3TabChange = async (tab) => {
  if (tab === "Visualization") {
    try {
      generateCavesOverridesObj();
    } catch {
      showSnackbar("生成可视化配置失败", "error")
    }
  }
  if (tab === "Code") {
    roomCaveForm.value.caveSetting = beautifyLua(roomCaveForm.value.caveSetting);
    requestAnimationFrame(() => {
      if (editorCavesSettingRef.value) {
        editorCavesSettingRef.value.refresh();
      }
    });
  }
};

const handleImportLeveldataLua = (world, mode) => {
  if (world === "master") {
    if (mode === "endless") {
      roomGroundForm.value.groundSetting = endless.master;
    }
    if (mode === "survival") {
      roomGroundForm.value.groundSetting = survival.master;
    }
    if (isMultiHost.value) {
      roomBaseForm.value.masterPort = 11000;
      roomBaseForm.value.cavesPort = 0;
      roomBaseForm.value.shardMasterPort = 10888;
      roomBaseForm.value.steamMasterPort = 27018;
      roomBaseForm.value.steamAuthenticationPort = 8768;
      roomBaseForm.value.shardMasterIp = "127.0.0.1";
      roomBaseForm.value.clusterKey = undefined;
    }
  }
  if (world === "caves") {
    if (mode === "endless") {
      roomCaveForm.value.caveSetting = endless.caves;
    }
    if (mode === "survival") {
      roomCaveForm.value.caveSetting = survival.caves;
    }
    if (isMultiHost.value) {
      roomBaseForm.value.masterPort = 0;
      roomBaseForm.value.cavesPort = 11001;
      roomBaseForm.value.shardMasterPort = 10888;
      roomBaseForm.value.steamMasterPort = 27019;
      roomBaseForm.value.steamAuthenticationPort = 8769;
      roomBaseForm.value.shardMasterIp = undefined;
      roomBaseForm.value.clusterKey = undefined;
    }
  }
};

const editorGroundSettingRef = ref();
const editorCavesSettingRef = ref()

const overridesObj = ref({});
const generateGroundOverridesObj = () => {
  if (roomGroundForm.value.groundSetting === "") {
    return;
  }
  const ast = luaparse.parse(roomGroundForm.value.groundSetting);
  // 提取 overrides 字段
  const overridesTable = extractOverrides(ast);
  // 将 Lua 表转换为 JavaScript 对象
  overridesObj.value = convertLuaTableToObject(overridesTable);
};
const generateCavesOverridesObj = () => {
  if (roomCaveForm.value.caveSetting === '') {
    return
  }
  const ast = luaparse.parse(roomCaveForm.value.caveSetting)
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
    if (field.key.type === "Identifier" && field.key.name === "overrides") {
      return field.value;
    }
  }

  return null;
}

function convertLuaTableToObject(luaTable) {
  const obj = {};
  for (const field of luaTable.fields) {
    const key = field.key.name;
    obj[key] = field.value.raw.replace(/"/g, "");
  }

  return obj;
}

const beautifyLua = (luaScript) => {
  let removedWatermark = luamin.Beautify(luaScript, {
    RenameVariables: false,
    RenameGlobals: false,
    SolveMath: false,
  });
  removedWatermark = removedWatermark.replace(/--\[\[\n\t.+\n\t.+\n--]]\n\n\n\n\n/g, "");
  removedWatermark = removedWatermark.replace(/ = /g, "=");
  removedWatermark = removedWatermark.replace(/\t/g, "  ");

  removedWatermark = removedWatermark.replace(/overrides=\{ +(.+)\n/g, "overrides={\n    $1\n");
  removedWatermark = removedWatermark.replace(/^(\w+)=(.+)\n/gm, "    $1=$2\n");
  removedWatermark = removedWatermark.replace(/(.+)},\n/g, "$1\n  },\n");
  removedWatermark = removedWatermark.replace(/^ +?\n/gm, "");

  return removedWatermark;
};

const astToLua = (astNode, indentLevel = 0) => {
  const indent = "    ".repeat(indentLevel);
  switch (astNode.type) {
    case "Chunk":
      return astNode.body.map((node) => astToLua(node, indentLevel)).join("\n");
    case "LocalStatement":
      return `${indent}local ${astNode.variables.map(astToLua).join(", ")} = ${astNode.init.map(astToLua).join(", ")}`;
    case "FunctionDeclaration":
      return `${indent}function ${astToLua(astNode.identifier)}(${astNode.parameters.map(astToLua).join(", ")}) \n${astToLua(
        astNode.body,
        indentLevel + 1
      )}\n${indent}end`;
    case "ReturnStatement":
      return `${indent}return ${astNode.arguments.map(astToLua).join(", ")}`;
    case "BinaryExpression":
      return `${astToLua(astNode.left)} ${astNode.operator} ${astToLua(astNode.right)}`;
    case "CallStatement":
      return `${indent}${astToLua(astNode.expression)}`;
    case "Identifier":
      return astNode.name;
    case "StringLiteral":
      return `${astNode.raw}`;
    case "NumericLiteral":
      return astNode.raw;
    case "VarargLiteral":
      return "...";
    case "TableConstructorExpression":
      return `${indent}{ ${astNode.fields.map((field) => astToLua(field, indentLevel + 1)).join(",\n" + indent)} }`;
    case "Field":
      return astNode.key ? `${astToLua(astNode.key)} = ${astToLua(astNode.value)}` : astToLua(astNode.value);
    case "AssignmentStatement":
      return `${indent}${astNode.variables.map(astToLua).join(", ")} = ${astNode.init.map(astToLua).join(", ")}`;
    case "CallExpression":
      return `${astToLua(astNode.base)}(${astNode.arguments.map(astToLua).join(", ")})`;
    case "TableKeyString":
      return `${astToLua(astNode.key)} = ${astToLua(astNode.value)}`;
    case "BooleanLiteral":
      return astNode.raw;
    case "TableValue":
      return astToLua(astNode.value);
    default:
      throw new Error(`Unsupported node type: ${astNode.type}`);
  }
};

const handleChangeMultiHost = (v) => {
  settingApi.multihost.post({multiHost: !isMultiHost.value}).then(response => {
    isMultiHost.value = !isMultiHost.value
    if (v) {
      clearSetting()
    }
  })
}

const clearSetting = () => {
  roomGroundForm.value.groundSetting = ""
  roomCaveForm.value.caveSetting = ""

  roomBaseForm.value.masterPort = undefined
  roomBaseForm.value.cavesPort = undefined
  roomBaseForm.value.shardMasterPort = undefined
  roomBaseForm.value.steamMasterPort = undefined
  roomBaseForm.value.steamAuthenticationPort = undefined
  if (multiHostIsMaster.value) {
    roomBaseForm.value.shardMasterIp = '127.0.0.1'
  } else {
    roomBaseForm.value.shardMasterIp = undefined
  }

  roomBaseForm.value.clusterKey = undefined
}

const handleSave = () => {
  const reqForm = {
    base: roomBaseForm.value,
    ground: roomGroundForm.value.groundSetting,
    cave: roomCaveForm.value.caveSetting,
    mod: roomModForm.value.modSetting
  }
  loading.value = true
  settingApi.save.post(reqForm).then(response => {
    showSnackbar(response.message)
    loading.value = false
  }).finally(() => {
    loading.value = false
    nextTick(() => {
      handleRefresh()
    })
  })
}
const handleSaveAndRestart = () => {
  const reqForm = {
    base: roomBaseForm.value,
    ground: roomGroundForm.value.groundSetting,
    cave: roomCaveForm.value.caveSetting,
    mod: roomModForm.value.modSetting
  }
  loading.value = true
  settingApi.saveAndRestart.post(reqForm).then(response => {
    showSnackbar(response.message)
    loading.value = false
  }).finally(() => {
    loading.value = false
    nextTick(() => {
      handleRefresh()
    })
  })
}
const handleGenerateNewWorld = () => {
  const reqForm = {
    base: roomBaseForm.value,
    ground: roomGroundForm.value.groundSetting,
    cave: roomCaveForm.value.caveSetting,
    mod: roomModForm.value.modSetting
  }
  loading.value = true
  settingApi.saveAndGenerate.post(reqForm).then(response => {
    loading.value = false
    showSnackbar(response.message)
  }).finally(() => {
    loading.value = false
    nextTick(() => {
      handleRefresh()
    })
  })
}

const handleRefresh = async () => {
  await sleep(1000)
  router.go(0)
};
</script>

<style scoped>
.item-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240.5px, 1fr));
  gap: 10px;
}
</style>
