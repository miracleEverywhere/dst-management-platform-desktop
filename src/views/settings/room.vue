<template>
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

      <v-stepper-item :color="step > 2 ? 'success' : ''" :complete="step > 2" :value="2" title="模组设置">
        <template #icon>
          <v-icon icon="ri-number-3" size="12"></v-icon>
        </template>
      </v-stepper-item>
      <v-divider></v-divider>

      <v-stepper-item :color="step > 3 ? 'success' : ''" :complete="step > 3" :value="3" title="设置完成">
        <template #icon>
          <v-icon icon="ri-number-4" size="12"></v-icon>
        </template>
      </v-stepper-item>
    </v-stepper-header>
    <v-stepper-window v-model="step">
      <v-stepper-window-item :value="0">
        <v-container height="700" style="overflow-y: auto">
          <v-form ref="clusterSettingFormRef">
            <v-row class="mt-4">
              <v-text-field v-model="clusterSettingForm.name" :rules="rules.require" label="房间名"></v-text-field>
            </v-row>
            <v-row class="mt-10">
              <v-text-field v-model="clusterSettingForm.description" label="房间描述"></v-text-field>
            </v-row>
            <v-row class="mt-10">
              <v-radio-group v-model="clusterSettingForm.gameMode" inline>
                <template #prepend>
                  <span>
                    游戏模式
                  </span>
                </template>
                <v-radio label="无尽" value="endless" class="mr-4"></v-radio>
                <v-radio label="生存" value="survival" class="mr-4"></v-radio>
                <v-radio label="熔炉" value="lavaarena" class="mr-4"></v-radio>
                <v-radio label="暴食" value="quagmire" class="mr-4"></v-radio>
              </v-radio-group>
            </v-row>
            <v-row class="mt-10">
              <v-radio-group v-model="clusterSettingForm.pvp" inline>
                <template #prepend>
                  <span>
                    玩家对战
                  </span>
                </template>
                <v-radio label="开启" :value="true" class="mr-4"></v-radio>
                <v-radio label="关闭" :value="false" class="mr-4"></v-radio>
              </v-radio-group>
            </v-row>
            <v-row class="mt-10">
              <v-radio-group v-model="clusterSettingForm.vote" inline>
                <template #prepend>
                  <span>
                    玩家投票
                  </span>
                </template>
                <v-radio label="开启" :value="true" class="mr-4"></v-radio>
                <v-radio label="关闭" :value="false" class="mr-4"></v-radio>
              </v-radio-group>
            </v-row>
            <v-row class="mt-10">
              <v-slider v-model="clusterSettingForm.playerNum" :max="100" :min="2" class="align-center" hide-details
                        step="1" style="margin-left: -1px">
                <template #label>
                  <span>玩家数量</span>
                </template>
                <template v-slot:append>
                  <v-chip label>
                    {{ clusterSettingForm.playerNum }}
                  </v-chip>
                </template>
              </v-slider>
            </v-row>
            <v-row class="mt-10">
              <v-slider v-model="clusterSettingForm.backDays" :max="50" :min="5" class="align-center" hide-details
                        step="1" style="margin-left: -1px">
                <template #label>
                  <span>回档天数</span>
                </template>
                <template v-slot:append>
                  <v-chip label>
                    {{ clusterSettingForm.backDays }}
                  </v-chip>
                </template>
              </v-slider>
            </v-row>
            <v-row class="mt-10">
              <v-text-field
                v-model="clusterSettingForm.password"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                :type="isPasswordVisible ? 'text' : 'password'"
                autocomplete="password"
                label="房间密码"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />
            </v-row>
            <v-row class="mt-10">
              <v-text-field
                v-model="clusterSettingForm.token"
                :rules="rules.require"
                :append-inner-icon="isTokenVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                :type="isTokenVisible ? 'text' : 'password'"
                autocomplete="password"
                label="游戏令牌"
                @click:append-inner="isTokenVisible = !isTokenVisible"
              />
            </v-row>
          </v-form>
        </v-container>
      </v-stepper-window-item>
      <v-stepper-window-item :value="1">
        <v-tabs v-model="worldTabName">
          <v-tab v-for="world in worldForm" :key="world.name" :value="world.name">
            {{world.name}}
            <v-btn icon="ri-delete-bin-5-line" variant="text"
                   @click="handleWorldTabsEdit(world.name, 'remove')"
                   class="ml-4" style="margin-right: -12px"></v-btn>
          </v-tab>
          <v-btn icon="ri-add-line" variant="text"
                 @click="handleWorldTabsEdit('', 'add')"></v-btn>
        </v-tabs>
        <v-tabs-window v-model="worldTabName" class="mx-8">
          <v-tabs-window-item v-for="world in worldForm" :key="world.name" :value="world.name">
            <v-form :ref="(el) => (dynamicWorldRefs[world.name] = el)">
              <v-row class="mt-4">
                <v-col>
                  <v-switch v-model="world.isMaster">
                    <template #prepend>
                      主世界
                    </template>
                  </v-switch>
                </v-col>
                <v-col>
                  <v-switch v-model="world.encodeUserPath">
                    <template #prepend>
                      用户路径编码
                    </template>
                  </v-switch>
                </v-col>
                <v-col>
                  <v-number-input v-model.number="world.id" :disabled="world.saved"
                                  :rules="rules.require"
                                  control-variant="hidden" inset label="世界ID"
                                  density="compact" variant="outlined">
                  </v-number-input>
                </v-col>
                <v-col>
                  <v-number-input v-model.number="world.serverPort"
                                  :rules="rules.require"
                                  control-variant="hidden" inset label="游戏端口"
                                  density="compact" variant="outlined">
                  </v-number-input>
                </v-col>
              </v-row>
              <v-row class="mt-2">
                <v-col>
                  <v-number-input v-model.number="world.shardMasterPort"
                                  :rules="rules.require"
                                  control-variant="hidden" inset label="主节点端口"
                                  density="compact" variant="outlined">
                  </v-number-input>
                </v-col>
                <v-col>
                  <v-number-input v-model.number="world.steamMasterPort"
                                  :rules="rules.require"
                                  control-variant="hidden" inset label="Steam连接端口"
                                  density="compact" variant="outlined">
                  </v-number-input>
                </v-col>
                <v-col>
                  <v-number-input v-model.number="world.steamAuthenticationPort"
                                  :rules="rules.require"
                                  control-variant="hidden" inset label="Steam认证端口"
                                  density="compact" variant="outlined">
                  </v-number-input>
                </v-col>
                <v-col>
                  <v-text-field v-model="world.shardMasterIp" :disabled="world.isMaster"
                                :rules="rules.require"
                                density="compact" label="主世界IP">
                  </v-text-field>
                </v-col>
              </v-row>
             <v-row class="mt-2">
               <v-col cols="3">
                 <v-text-field
                   v-model="world.clusterKey"
                   :rules="rules.require"
                   :append-inner-icon="isClusterKeyVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                   :type="isClusterKeyVisible ? 'text' : 'password'"
                   autocomplete="password"
                   label="游戏令牌" density="compact"
                   @click:append-inner="isClusterKeyVisible = !isClusterKeyVisible"
                 />
               </v-col>
               <v-spacer/>
             </v-row>
            </v-form>

            <v-tabs v-model="worldLevelDataTabName" @update:model-value="handleWorldTabChange" class="mt-4">
              <v-tab value="Code">
                配置文件
              </v-tab>
              <v-tab
                v-if="(clusterSettingForm.gameMode==='endless'||clusterSettingForm.gameMode==='survival') && world.levelData!==''"
                value="Visualization">
                可视化
              </v-tab>
            </v-tabs>
            <v-tabs-window v-model="worldLevelDataTabName">
              <v-tabs-window-item value="Code">
                <ScCodeEditor ref="editorGroundSettingRef" v-model="world.levelData" :height="400"
                              :theme="globalStore.theme === 'dark' ? 'darcula' : 'idea'" class="mt-4" mode="lua"
                              style="width: 100%"></ScCodeEditor>
              </v-tabs-window-item>
              <v-tabs-window-item value="Visualization">
                <template v-if="visualizationType==='forest' && Object.keys(overridesObj).length!==0">
                  <v-alert color="info" title="世界规则 - 全局" density="compact" class="mt-4"
                           variant="tonal" icon="ri-scales-3-fill"></v-alert>
                  <div class="item-container">
                    <template v-for="(i, key) in groundWorldRule.global">
                      <div>
                        <LevelDataSetting :key="key"
                                          v-model="overridesObj[i]"
                                          :configs="overrides[i]?.configs || ['undefined']"
                                          :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                          :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                          :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                          :image="overrides[i]?.image || 'undefined.png'"
                                          :name="i"
                                          @changeModelValue="handleModelValueChange"
                        />
                      </div>
                    </template>
                  </div>
                  <v-alert color="info" title="世界规则 - 活动" density="compact" class="mt-4"
                           variant="tonal" icon="ri-scales-3-fill"></v-alert>
                  <div class="item-container">
                    <template v-for="(i, key) in groundWorldRule.events">
                      <div>
                        <LevelDataSetting :key="key"
                                          v-model="overridesObj[i]"
                                          :configs="overrides[i]?.configs || ['undefined']"
                                          :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                          :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                          :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                          :image="overrides[i]?.image || 'undefined.png'"
                                          :name="i"
                                          @changeModelValue="handleModelValueChange"
                        />
                      </div>
                    </template>
                  </div>
                  <v-alert color="info" title="世界规则 - 冒险家" density="compact" class="mt-4"
                           variant="tonal" icon="ri-scales-3-fill"></v-alert>
                  <div class="item-container">
                    <template v-for="(i, key) in groundWorldRule.survivors">
                      <div>
                        <LevelDataSetting :key="key"
                                          v-model="overridesObj[i]"
                                          :configs="overrides[i]?.configs || ['undefined']"
                                          :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                          :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                          :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                          :image="overrides[i]?.image || 'undefined.png'"
                                          :name="i"
                                          @changeModelValue="handleModelValueChange"
                        />
                      </div>
                    </template>
                  </div>
                  <v-alert color="info" title="世界规则 - 世界" density="compact" class="mt-4"
                           variant="tonal" icon="ri-scales-3-fill"></v-alert>
                  <div class="item-container">
                    <template v-for="(i, key) in groundWorldRule.world">
                      <div>
                        <LevelDataSetting :key="key"
                                          v-model="overridesObj[i]"
                                          :configs="overrides[i]?.configs || ['undefined']"
                                          :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                          :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                          :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                          :image="overrides[i]?.image || 'undefined.png'"
                                          :name="i"
                                          @changeModelValue="handleModelValueChange"
                        />
                      </div>
                    </template>
                  </div>
                  <v-alert color="info" title="世界规则 - 资源再生" density="compact" class="mt-4"
                           variant="tonal" icon="ri-scales-3-fill"></v-alert>
                  <div class="item-container">
                    <template v-for="(i, key) in groundWorldRule.resourceRegrowth">
                      <div>
                        <LevelDataSetting :key="key"
                                          v-model="overridesObj[i]"
                                          :configs="overrides[i]?.configs || ['undefined']"
                                          :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                          :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                          :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                          :image="overrides[i]?.image || 'undefined.png'"
                                          :name="i"
                                          @changeModelValue="handleModelValueChange"
                        />
                      </div>
                    </template>
                  </div>
                  <v-alert color="info" title="世界规则 - 非自然传送门资源" density="compact" class="mt-4"
                           variant="tonal" icon="ri-scales-3-fill"></v-alert>
                  <div class="item-container">
                    <template v-for="(i, key) in groundWorldRule.unnaturalPortalResource">
                      <div>
                        <LevelDataSetting :key="key"
                                          v-model="overridesObj[i]"
                                          :configs="overrides[i]?.configs || ['undefined']"
                                          :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                          :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                          :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                          :image="overrides[i]?.image || 'undefined.png'"
                                          :name="i"
                                          @changeModelValue="handleModelValueChange"
                        />
                      </div>
                    </template>
                  </div>
                  <v-alert color="info" title="世界规则 - 生物" density="compact" class="mt-4"
                           variant="tonal" icon="ri-scales-3-fill"></v-alert>
                  <div class="item-container">
                    <template v-for="(i, key) in groundWorldRule.creatures">
                      <div>
                        <LevelDataSetting :key="key"
                                          v-model="overridesObj[i]"
                                          :configs="overrides[i]?.configs || ['undefined']"
                                          :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                          :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                          :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                          :image="overrides[i]?.image || 'undefined.png'"
                                          :name="i"
                                          @changeModelValue="handleModelValueChange"
                        />
                      </div>
                    </template>
                  </div>
                  <v-alert color="info" title="世界规则 - 敌对生物" density="compact" class="mt-4"
                           variant="tonal" icon="ri-scales-3-fill"></v-alert>
                  <div class="item-container">
                    <template v-for="(i, key) in groundWorldRule.hostileCreatures">
                      <div>
                        <LevelDataSetting :key="key"
                                          v-model="overridesObj[i]"
                                          :configs="overrides[i]?.configs || ['undefined']"
                                          :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                          :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                          :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                          :image="overrides[i]?.image || 'undefined.png'"
                                          :name="i"
                                          @changeModelValue="handleModelValueChange"
                        />
                      </div>
                    </template>
                  </div>
                  <v-alert color="info" title="世界规则 - 巨兽" density="compact" class="mt-4"
                           variant="tonal" icon="ri-scales-3-fill"></v-alert>
                  <div class="item-container">
                    <template v-for="(i, key) in groundWorldRule.giants">
                      <div>
                        <LevelDataSetting :key="key"
                                          v-model="overridesObj[i]"
                                          :configs="overrides[i]?.configs || ['undefined']"
                                          :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                          :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                          :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                          :image="overrides[i]?.image || 'undefined.png'"
                                          :name="i"
                                          @changeModelValue="handleModelValueChange"
                        />
                      </div>
                    </template>
                  </div>
                  <v-alert color="success" title="世界生成 - 全局" density="compact" class="mt-4"
                           variant="tonal" icon="ri-color-filter-ai-line"></v-alert>
                  <div class="item-container">
                    <template v-for="(i, key) in groundWorldGeneration.global">
                      <div>
                        <LevelDataSetting :key="key"
                                          v-model="overridesObj[i]"
                                          :configs="overrides[i]?.configs || ['undefined']"
                                          :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                          :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                          :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                          :image="overrides[i]?.image || 'undefined.png'"
                                          :name="i"
                                          @changeModelValue="handleModelValueChange"
                        />
                      </div>
                    </template>
                  </div>
                  <v-alert color="success" title="世界生成 - 世界" density="compact" class="mt-4"
                           variant="tonal" icon="ri-color-filter-ai-line"></v-alert>
                  <div class="item-container">
                    <template v-for="(i, key) in groundWorldGeneration.world">
                      <div>
                        <LevelDataSetting :key="key"
                                          v-model="overridesObj[i]"
                                          :configs="overrides[i]?.configs || ['undefined']"
                                          :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                          :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                          :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                          :image="overrides[i]?.image || 'undefined.png'"
                                          :name="i"
                                          @changeModelValue="handleModelValueChange"
                        />
                      </div>
                    </template>
                  </div>
                  <v-alert color="success" title="世界生成 - 资源" density="compact" class="mt-4"
                           variant="tonal" icon="ri-color-filter-ai-line"></v-alert>
                  <div class="item-container">
                    <template v-for="(i, key) in groundWorldGeneration.resources">
                      <div>
                        <LevelDataSetting :key="key"
                                          v-model="overridesObj[i]"
                                          :configs="overrides[i]?.configs || ['undefined']"
                                          :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                          :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                          :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                          :image="overrides[i]?.image || 'undefined.png'"
                                          :name="i"
                                          @changeModelValue="handleModelValueChange"
                        />
                      </div>
                    </template>
                  </div>
                  <v-alert color="success" title="世界生成 - 生物以及刷新点" density="compact" class="mt-4"
                           variant="tonal" icon="ri-color-filter-ai-line"></v-alert>
                  <div class="item-container">
                    <template v-for="(i, key) in groundWorldGeneration.creaturesAndSpawners">
                      <div>
                        <LevelDataSetting :key="key"
                                          v-model="overridesObj[i]"
                                          :configs="overrides[i]?.configs || ['undefined']"
                                          :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                          :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                          :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                          :image="overrides[i]?.image || 'undefined.png'"
                                          :name="i"
                                          @changeModelValue="handleModelValueChange"
                        />
                      </div>
                    </template>
                  </div>
                  <v-alert color="success" title="世界生成 - 敌对生物以及刷新点" density="compact" class="mt-4"
                           variant="tonal" icon="ri-color-filter-ai-line"></v-alert>
                  <div class="item-container">
                    <template v-for="(i, key) in groundWorldGeneration.hostileCreaturesAndSpawners">
                      <div>
                        <LevelDataSetting :key="key"
                                          v-model="overridesObj[i]"
                                          :configs="overrides[i]?.configs || ['undefined']"
                                          :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                          :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                          :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                          :image="overrides[i]?.image || 'undefined.png'"
                                          :name="i"
                                          @changeModelValue="handleModelValueChange"
                        />
                      </div>
                    </template>
                  </div>
                </template>
                <template v-if="visualizationType==='cave' && Object.keys(overridesObj).length!==0">
                  <v-alert color="info" title="世界规则 - 世界" density="compact" class="mt-4"
                           variant="tonal" icon="ri-scales-3-fill"></v-alert>
                  <div class="item-container">
                    <template v-for="(i, key) in cavesWorldRule.world">
                      <div>
                        <LevelDataSetting :key="key"
                                          v-model="overridesObj[i]"
                                          :configs="overrides[i]?.configs || ['undefined']"
                                          :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                          :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                          :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                          :image="overrides[i]?.image || 'undefined.png'"
                                          :name="i"
                                          @changeModelValue="handleModelValueChange"
                        />
                      </div>
                    </template>
                  </div>
                  <v-alert color="info" title="世界规则 - 资源再生" density="compact" class="mt-4"
                           variant="tonal" icon="ri-scales-3-fill"></v-alert>
                  <div class="item-container">
                    <template v-for="(i, key) in cavesWorldRule.resourceRegrowth">
                      <div>
                        <LevelDataSetting :key="key"
                                          v-model="overridesObj[i]"
                                          :configs="overrides[i]?.configs || ['undefined']"
                                          :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                          :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                          :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                          :image="overrides[i]?.image || 'undefined.png'"
                                          :name="i"
                                          @changeModelValue="handleModelValueChange"
                        />
                      </div>
                    </template>
                  </div>
                  <v-alert color="info" title="世界规则 - 生物" density="compact" class="mt-4"
                           variant="tonal" icon="ri-scales-3-fill"></v-alert>
                  <div class="item-container">
                    <template v-for="(i, key) in cavesWorldRule.creatures">
                      <div>
                        <LevelDataSetting :key="key"
                                          v-model="overridesObj[i]"
                                          :configs="overrides[i]?.configs || ['undefined']"
                                          :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                          :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                          :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                          :image="overrides[i]?.image || 'undefined.png'"
                                          :name="i"
                                          @changeModelValue="handleModelValueChange"
                        />
                      </div>
                    </template>
                  </div>
                  <v-alert color="info" title="世界规则 - 敌对生物" density="compact" class="mt-4"
                           variant="tonal" icon="ri-scales-3-fill"></v-alert>
                  <div class="item-container">
                    <template v-for="(i, key) in cavesWorldRule.hostileCreatures">
                      <div>
                        <LevelDataSetting :key="key"
                                          v-model="overridesObj[i]"
                                          :configs="overrides[i]?.configs || ['undefined']"
                                          :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                          :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                          :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                          :image="overrides[i]?.image || 'undefined.png'"
                                          :name="i"
                                          @changeModelValue="handleModelValueChange"
                        />
                      </div>
                    </template>
                  </div>
                  <v-alert color="info" title="世界规则 - 巨兽" density="compact" class="mt-4"
                           variant="tonal" icon="ri-scales-3-fill"></v-alert>
                  <div class="item-container">
                    <template v-for="(i, key) in cavesWorldRule.giants">
                      <div>
                        <LevelDataSetting :key="key"
                                          v-model="overridesObj[i]"
                                          :configs="overrides[i]?.configs || ['undefined']"
                                          :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                          :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                          :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                          :image="overrides[i]?.image || 'undefined.png'"
                                          :name="i"
                                          @changeModelValue="handleModelValueChange"
                        />
                      </div>
                    </template>
                  </div>
                  <v-alert color="success" title="世界生成 - 世界" density="compact" class="mt-4"
                           variant="tonal" icon="ri-color-filter-ai-line"></v-alert>
                  <div class="item-container">
                    <template v-for="(i, key) in cavesWorldGeneration.world">
                      <div>
                        <LevelDataSetting :key="key"
                                          v-model="overridesObj[i]"
                                          :configs="caveOverrideWorldGenerationWorld[i]?.configs || ['undefined']"
                                          :customConfigsValue="caveOverrideWorldGenerationWorld[i]?.customConfigsValue || {}"
                                          :defaultModelValue="caveOverrideWorldGenerationWorld[i]?.modelValue || 'undefined'"
                                          :i18n="caveOverrideWorldGenerationWorld[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                          :image="caveOverrideWorldGenerationWorld[i]?.image || 'undefined.png'"
                                          :name="i"
                                          @changeModelValue="handleModelValueChange"
                        />
                      </div>
                    </template>
                  </div>
                  <v-alert color="success" title="世界生成 - 资源" density="compact" class="mt-4"
                           variant="tonal" icon="ri-color-filter-ai-line"></v-alert>
                  <div class="item-container">
                    <template v-for="(i, key) in cavesWorldGeneration.resources">
                      <div>
                        <LevelDataSetting :key="key"
                                          v-model="overridesObj[i]"
                                          :configs="overrides[i]?.configs || ['undefined']"
                                          :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                          :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                          :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                          :image="overrides[i]?.image || 'undefined.png'"
                                          :name="i"
                                          @changeModelValue="handleModelValueChange"
                        />
                      </div>
                    </template>
                  </div>
                  <v-alert color="success" title="世界生成 - 生物以及刷新点" density="compact" class="mt-4"
                           variant="tonal" icon="ri-color-filter-ai-line"></v-alert>
                  <div class="item-container">
                    <template v-for="(i, key) in cavesWorldGeneration.creaturesAndSpawners">
                      <div>
                        <LevelDataSetting :key="key"
                                          v-model="overridesObj[i]"
                                          :configs="overrides[i]?.configs || ['undefined']"
                                          :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                          :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                          :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                          :image="overrides[i]?.image || 'undefined.png'"
                                          :name="i"
                                          @changeModelValue="handleModelValueChange"
                        />
                      </div>
                    </template>
                  </div>
                  <v-alert color="success" title="世界生成 - 敌对生物以及刷新点" density="compact" class="mt-4"
                           variant="tonal" icon="ri-color-filter-ai-line"></v-alert>
                  <div class="item-container">
                    <template v-for="(i, key) in cavesWorldGeneration.hostileCreaturesAndSpawners">
                      <div>
                        <LevelDataSetting :key="key"
                                          v-model="overridesObj[i]"
                                          :configs="overrides[i]?.configs || ['undefined']"
                                          :customConfigsValue="overrides[i]?.customConfigsValue || {}"
                                          :defaultModelValue="overrides[i]?.modelValue || 'undefined'"
                                          :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                                          :image="overrides[i]?.image || 'undefined.png'"
                                          :name="i"
                                          @changeModelValue="handleModelValueChange"
                        />
                      </div>
                    </template>
                  </div>
                </template>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-stepper-window-item>
    </v-stepper-window>
    <v-stepper-actions class="mx-8">
      <template #prev>
        <v-btn :disabled="step===0" color="grey-lighten-3" variant="elevated" @click="handlePrev">上一步</v-btn>
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
            <v-list-item title="保存"/>
            <v-list-item title="保存并重启"/>
            <v-list-item title="生成新世界"/>
          </v-list>
        </v-menu>
      </template>
    </v-stepper-actions>
  </v-stepper>
</template>

<script setup>
import {showSnackbar} from "@/utils/snackbar";
import useGlobalStore from "@/plugins/pinia/global";
import systemApi from "@/api/system"
import settingApi from "@/api/setting"
import ElectronApi from "@/utils/electronApi";
import luaparse from 'luaparse'
import luamin from 'lua-format'
import LevelDataSetting from "@/views/settings/components/levelDataSetting.vue";
import {endless, survival} from "@/views/settings/components/leveldataoverride.js"
import {
  caveOverrideWorldGenerationWorld,
  cavesWorldGeneration,
  cavesWorldRule,
  groundWorldGeneration,
  groundWorldRule,
  overrides
} from "@/views/settings/components/levelDataMap.js";


onMounted(async () => {
  await getAllClusters()
  await getClustersWorldPort()
  await getMaxWorlds()
  await handleGetClusterSetting()
  generateWorldFormRefs()
})



const globalStore = useGlobalStore()
const worldPortFactor = computed(() => {
  const clusters = allClusters.value || []
  const index = clusters.findIndex(c => c.clusterName === globalStore.selectedDstCluster)
  return index !== -1 ? index : 0
})
const route = useRoute();
const router = useRouter();
const loading = ref(false)
const isPasswordVisible = ref(false)
const isTokenVisible = ref(false)
const isClusterKeyVisible = ref(false)


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

const allClusters = ref([])
const getAllClusters = () => {
  settingApi.clusters.all.get().then(response => {
    allClusters.value = response.data
  })
}
const getClusters = () => {
  settingApi.clusters.get().then(response => {
    globalStore.dstClusters = response.data
    if (globalStore.selectedDstCluster === null && globalStore.dstClusters !== null) {
      globalStore.selectedDstCluster = globalStore.dstClusters[0].clusterName
    }
  })
}

const maxWorlds = ref(0)
const getMaxWorlds = () => {
  systemApi.userInfo.get().then(response => {
    maxWorlds.value = response.data.maxWorldsPerCluster
  })
}

const handleRefresh = () => {
  ElectronApi.window.reload()
}

const step = ref(0)
const nextButtonLoading = ref(false)
const handlePrev = () => {
  step.value--
}
const handleNext = async () => {
  if (step.value === 0) {
    const {valid} = await clusterSettingFormRef.value.validate();
    if (valid) {
      if (!hasWorlds.value) {
        worldTabIndex.value = 1
        worldTabName.value = 'World1'
        worldForm.value = [{
          id: 101,
          name: 'World1',
          isMaster: true,
          levelData: '',
          serverPort: 11001 + worldPortFactor.value * 10,
          shardMasterPort: 10888 + worldPortFactor.value * 10,
          steamMasterPort: 27018 + worldPortFactor.value * 10,
          steamAuthenticationPort: 8768 + worldPortFactor.value * 10,
          shardMasterIp: '127.0.0.1',
          clusterKey: 'supersecretkey',
          encodeUserPath: true,
          saved: false
        }]
      }
      step.value++
      return
    }
  }
  if (step.value === 1) {
    const worldPortKeys = ['serverPort', 'shardMasterPort', 'steamMasterPort', 'steamAuthenticationPort']
    for (let world of worldForm.value) {
      for (const clustersWorldPortItem of clustersWorldPort.value) {
        if (clustersWorldPortItem.clusterName !== globalStore.selectedDstCluster) {
          for (let worldPortKey of worldPortKeys) {
            if (clustersWorldPortItem.worldPort === null) {
              continue
            }
            if (clustersWorldPortItem.worldPort.includes(world[worldPortKey])) {
              showSnackbar(`[${t(`setting.roomWorldForm.${worldPortKey}`)}]:${world[worldPortKey]} 端口冲突，请检查并修改`, 'error')
              return
            }
          }
        }
      }
    }
    console.log(dynamicWorldRefs)
    for (let key in dynamicWorldRefs) {
      if (dynamicWorldRefs[key]) {
        const {valid} = await dynamicWorldRefs[key].validate()
        if (!valid) return
      }
    }
    for (let i of worldForm.value) {
      if (i.levelData === '') {
        showSnackbar('请输入世界配置', 'error')
        return
      }
      if (i.shardMasterPort !== worldForm.value[0].shardMasterPort) {
        showSnackbar('主节点端口必须一致', 'error')
        return
      }
      try {
        luaparse.parse(i.levelData)
      } catch (e) {
        showSnackbar('配置文件格式错误', 'error')
        return
      }
    }
    step.value++
    return
  }
  if (step.value === 2) {
    if (clusterModForm.value) {
      try {
        luaparse.parse(clusterModForm.value.mod);
        step.value++
      } catch (e) {
        showSnackbar('配置文件格式错误', 'error')
      }
    } else {
      step.value++
    }
  }
}

const clusterSettingFormRef = ref()
const clusterSettingForm = ref({
  clusterName: globalStore.selectedDstCluster,
  name: '',
  description: '',
  gameMode: '',
  pvp: false,
  playerNum: 6,
  backDays: 10,
  vote: false,
  consoleEnabled: true,
  password: '',
  token: '',
})
const rules = ref({
  require: [
    value => {
      if (!value) return '此项为必填项'
      return true
    }
  ],
})

const clusterModForm = ref({
  mod: '',
})

const hasWorlds = ref(false)
const handleGetClusterSetting = () => {
  const reqForm = {
    clusterName: globalStore.selectedDstCluster,
  }
  settingApi.cluster.get(reqForm).then(response => {
    clusterSettingForm.value = response.data.clusterSetting
    if (response.data.worlds) {
      worldForm.value = response.data.worlds
      let maxIndex = 1
      let minIndex = 999999
      for (let world of worldForm.value) {
        let index = parseInt(world.name.replace('World', ''))
        if (index > maxIndex) {
          maxIndex = index
        }
        if (index < minIndex) {
          minIndex = index
        }
        world['saved'] = true
      }
      worldTabIndex.value = maxIndex
      worldTabName.value = 'World' + minIndex.toString()
      hasWorlds.value = true
    } else {
      hasWorlds.value = false
    }
    clusterModForm.value.mod = response.data.mod
  })
}

const handleCommand = async (cmd) => {
  switch (cmd) {
    case 'save':
      handleSave()
      break;
    case 'saveAndRestart':
      handleSaveAndRestart()
      break;
    case 'generateNewWorld':
      handleGenerateNewWorld()
      break;
  }
}

const handleSave = () => {
  const reqForm = {
    clusterSetting: clusterSettingForm.value,
    worlds: worldForm.value,
    mod: clusterModForm.value.mod,
    sysSetting: {},
  }
  loading.value = true
  settingApi.cluster.save.post(reqForm).then(response => {
    showSnackbar(response.message)
    loading.value = false
    getClusters()
  }).finally(() => {
    loading.value = false
    nextTick(() => {
      handleRefresh()
    })
  })
}

const handleSaveAndRestart = () => {
  const reqForm = {
    clusterSetting: clusterSettingForm.value,
    worlds: worldForm.value,
    mod: clusterModForm.value.mod,
    sysSetting: {},
  }
  loading.value = true
  settingApi.cluster.saveRestart.post(reqForm).then(response => {
    showSnackbar(response.message)
    loading.value = false
    getClusters()
  }).finally(() => {
    loading.value = false
    nextTick(() => {
      handleRefresh()
    })
  })
}
const handleGenerateNewWorld = () => {
  const reqForm = {
    clusterSetting: clusterSettingForm.value,
    worlds: worldForm.value,
    mod: clusterModForm.value.mod,
    sysSetting: {},
  }
  loading.value = true
  settingApi.cluster.saveRegenerate.post(reqForm).then(response => {
    showSnackbar(response.message)
    loading.value = false
    getClusters()
  }).finally(() => {
    loading.value = false
    nextTick(() => {
      handleRefresh()
    })
  })
}

const overridesObj = ref({})

const generateOverridesObj = (levelData) => {
  if (levelData === '') {
    return
  }
  const ast = luaparse.parse(levelData)
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

const handleModelValueChange = debounce((data) => {
  const key = data.name
  const value = data.value
  for (let world of worldForm.value) {
    if (world.name === worldTabName.value) {
      const ast = luaparse.parse(world.levelData)
      // 提取 overrides 字段
      const overridesTable = extractOverrides(ast);
      for (let field of overridesTable.fields) {
        if (field.key.name === key) {
          field.value.raw = `"${value}"`
        }
      }
      world.levelData = astToLua(ast)
      break
    }
  }
}, 100)

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
    case 'TableKey':
      return `[${astToLua(astNode.key)}] = ${astToLua(astNode.value)}`;
    case 'TableValue':
      return astToLua(astNode.value);
    default:
      throw new Error(`Unsupported node type: ${astNode.type}`);
  }
}

const worldTabIndex = ref(1)
const worldTabName = ref('World1')
const worldForm = ref([{
  id: 101,
  name: 'World1',
  isMaster: true,
  levelData: '',
  serverPort: 11001 + worldPortFactor.value * 10,
  shardMasterPort: 10888 + worldPortFactor.value * 10,
  steamMasterPort: 27018 + worldPortFactor.value * 10,
  steamAuthenticationPort: 8768 + worldPortFactor.value * 10,
  shardMasterIp: '127.0.0.1',
  clusterKey: 'supersecretkey',
  encodeUserPath: true,
}])

const dynamicWorldRefs = {}
const generateWorldFormRefs = () => {
  for (let world of worldForm.value) {
    const worldIndex = worldForm.value.length
    worldTabIndex.value = worldIndex
    dynamicWorldRefs[`World${worldIndex}`] = ref()
  }
}
const handleWorldTabsEdit = (targetName, action) => {
  if (action === 'add') {
    worldTabIndex.value++
    const newTabName = `World${worldTabIndex.value}`
    dynamicWorldRefs[newTabName] = ref()
    worldForm.value.push({
      id: worldTabIndex.value + 100,
      name: newTabName,
      isMaster: false,
      levelData: '',
      serverPort: 11000 + worldTabIndex.value + worldPortFactor.value * 10,
      shardMasterPort: 10888 + worldPortFactor.value * 10,
      steamMasterPort: 27017 + worldTabIndex.value + worldPortFactor.value * 10,
      steamAuthenticationPort: 8767 + worldTabIndex.value + worldPortFactor.value * 10,
      shardMasterIp: '127.0.0.1',
      clusterKey: 'supersecretkey',
      encodeUserPath: true,
    })
    worldTabName.value = newTabName
  } else if (action === 'remove') {
    if (worldForm.value.length === 1) {
      showSnackbar('每个房间至少含有一个世界', 'error')
      return
    }
    const tabs = worldForm.value
    // let activeName = worldTabName.value
    // tabs.forEach((tab, index) => {
    //   if (tab.name === targetName) {
    //     const nextTab = tabs[index + 1] || tabs[index - 1]
    //     if (nextTab) {
    //       activeName = nextTab.name
    //     }
    //   }
    // })
    // worldTabName.value = activeName
    worldForm.value = tabs.filter((tab) => tab.name !== targetName)
    delete dynamicWorldRefs[targetName]
  }
  worldLevelDataTabName.value = 'Code'
}

const worldLevelDataTabName = ref('Code')

const handleCreateWorld = (cmd) => {
  for (let world of worldForm.value) {
    if (world.name === worldTabName.value) {
      if (cmd.clusterType === 'endless') {
        if (cmd.worldType === 'ground') {
          world.levelData = endless.master
        }
        if (cmd.worldType === 'cave') {
          world.levelData = endless.caves
        }
      }
      if (cmd.clusterType === 'survival') {
        if (cmd.worldType === 'ground') {
          world.levelData = survival.master
        }
        if (cmd.worldType === 'cave') {
          world.levelData = survival.caves
        }
      }
    }
  }
}

const visualizationType = ref('')

const handleWorldTabChange = async (name) => {
  if (name === 'Visualization') {
    try {
      for (let world of worldForm.value) {
        if (world.name === worldTabName.value) {
          visualizationType.value = getWorldType(world.levelData)
          await generateOverridesObj(world.levelData)
          break
        }
      }
    } catch {
      showSnackbar('可视化配置加载失败', 'error')
    }
  }
  if (name === 'Code') {
    await nextTick(() => {
      for (let world of worldForm.value) {
        if (world.name === worldTabName.value) {
          world.levelData = beautifyLua(world.levelData)
          break
        }
      }
    })
  }
}

const getWorldType = (levelData) => {
  const regex = /location\s*=\s*"([^"]*)"/;
  const match = levelData.match(regex);

  if (match) {
    return match[1]
  } else {
    return ""
  }
}

const handleWorldTabsEditChange = () => {
  worldLevelDataTabName.value = 'Code'
}

const multiWorldModAddDialog = ref(false)
const multiWorldModContent = ref('')
const multiWorldModForm = ref([])

const openMultiWorldModAddDialog = () => {
  multiWorldModForm.value = [
    {
      ID: undefined,
      name: '',
      maxPlayers: undefined
    }
  ]
  multiWorldModContent.value = ''
  multiWorldModAddDialog.value = true
}

const handleGenerateModSetting = () => {
  let worldName = ""
  let worldMaxPlayers = ""
  for (let world of multiWorldModForm.value) {
    if (!world.ID) {
      showSnackbar('世界ID未填写', 'error')
      return
    }
    if (!world.name) {
      showSnackbar('世界名未填写', 'error')
      return
    }
    if (!world.maxPlayers) {
      showSnackbar('世界最大玩家数未填写', 'error')
      return
    }

    worldName = worldName + `["${world.ID}"]="${world.name}",`
    worldMaxPlayers = worldMaxPlayers +`["${world.ID}"]="${world.maxPlayers}",`
  }

  multiWorldModContent.value = `
  ["workshop-1438233888"]={
    configuration_options={
      auto_balancing=true,
      extra_worlds={},
      ignore_sinkholes=false,
      invisible_worlds={},
      language="auto",
      migration_postern=false,
      no_bat=true,
      population_limit={${worldMaxPlayers}},
      say_dest=true,
      world_name={${worldName}},
      world_prompt=true
    },
    enabled=true
  }`
  multiWorldModContent.value = '```lua ::open\n' + multiWorldModContent.value
}

const clustersWorldPort = ref([])
const getClustersWorldPort = () => {
  settingApi.clustersWorldPort.get().then(response => {
    clustersWorldPort.value = response.data
  })
}

watch(worldTabName, (v) => {
  if (!v) {
    worldTabName.value = worldForm.value[worldForm.value.length - 1].name
  }
  worldLevelDataTabName.value = 'Code'
})

</script>

<style scoped>
.item-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240.5px, 1fr));
  gap: 10px;
}
</style>