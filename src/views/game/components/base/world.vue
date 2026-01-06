<template>
  <v-tabs v-model="worldTabName">
    <v-tab
      v-for="world in worldForm"
      :value="world.name"
    >
      {{ world.name }}
      <v-btn
        icon="ri-delete-bin-5-line"
        variant="text"
        class="ml-4"
        @click="handleWorldTabsEdit(world.name, 'remove')"
      />
      <confirm-box
        v-model="deleteWorldDialog"
        type="warning"
        :title="t('game.base.step2.deleteModTip.title')"
        :content="t('game.base.step2.deleteModTip.title')"
        :cancel-text="t('game.base.step2.deleteModTip.cancel')"
        :confirm-text="t('game.base.step2.deleteModTip.confirm')"
        @cancel="deleteWorldConfirm=false"
        @confirm="deleteWorldConfirm=true"
      />
    </v-tab>
    <v-btn
      prepend-icon="ri-function-add-line"
      variant="text"
      color="success"
      :disabled="!canCreateWorld"
      @click="handleWorldTabsEdit('', 'add')"
    >
      {{ t('game.base.step2.addWorld') }}
    </v-btn>
    <v-menu
      v-if="!(props.gameMode==='custom' || props.gameMode === 'lavaarena' || props.gameMode === 'quagmire' )"
      open-on-click
    >
      <template #activator="{ props }">
        <v-btn
          variant="text"
          color="info"
          prepend-icon="ri-menu-add-line"
          :disabled="worldLevelDataTabName!=='Code'"
          v-bind="props"
          class="ml-4"
        >
          {{ t('game.base.step2.oneClickSet.name') }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-if="props.gameMode==='endless'"
          :title="`${t('game.base.step1.gameMode.modes.endless')}-${t('game.base.step2.oneClickSet.ground')}`"
          @click="handleCreateWorld({clusterType: 'endless', worldType: 'ground'})"
        />
        <v-list-item
          v-if="props.gameMode==='endless'"
          :title="`${t('game.base.step1.gameMode.modes.endless')}-${t('game.base.step2.oneClickSet.cave')}`"
          @click="handleCreateWorld({clusterType: 'endless', worldType: 'cave'})"
        />

        <v-list-item
          v-if="props.gameMode==='survival'"
          :title="`${t('game.base.step1.gameMode.modes.survival')}-${t('game.base.step2.oneClickSet.ground')}`"
          @click="handleCreateWorld({clusterType: 'survival', worldType: 'ground'})"
        />
        <v-list-item
          v-if="props.gameMode==='survival'"
          :title="`${t('game.base.step1.gameMode.modes.survival')}-${t('game.base.step2.oneClickSet.cave')}`"
          @click="handleCreateWorld({clusterType: 'survival', worldType: 'cave'})"
        />

        <v-list-item
          v-if="props.gameMode==='relaxed'"
          :title="`${t('game.base.step1.gameMode.modes.relaxed')}-${t('game.base.step2.oneClickSet.ground')}`"
          @click="handleCreateWorld({clusterType: 'relaxed', worldType: 'ground'})"
        />
        <v-list-item
          v-if="props.gameMode==='relaxed'"
          :title="`${t('game.base.step1.gameMode.modes.relaxed')}-${t('game.base.step2.oneClickSet.cave')}`"
          @click="handleCreateWorld({clusterType: 'relaxed', worldType: 'cave'})"
        />

        <v-list-item
          v-if="props.gameMode==='wilderness'"
          :title="`${t('game.base.step1.gameMode.modes.wilderness')}-${t('game.base.step2.oneClickSet.ground')}`"
          @click="handleCreateWorld({clusterType: 'wilderness', worldType: 'ground'})"
        />
        <v-list-item
          v-if="props.gameMode==='wilderness'"
          :title="`${t('game.base.step1.gameMode.modes.wilderness')}-${t('game.base.step2.oneClickSet.cave')}`"
          @click="handleCreateWorld({clusterType: 'wilderness', worldType: 'cave'})"
        />

        <v-list-item
          v-if="props.gameMode==='lightsOut'"
          :title="`${t('game.base.step1.gameMode.modes.lightsOut')}-${t('game.base.step2.oneClickSet.ground')}`"
          @click="handleCreateWorld({clusterType: 'lightsOut', worldType: 'ground'})"
        />
        <v-list-item
          v-if="props.gameMode==='lightsOut'"
          :title="`${t('game.base.step1.gameMode.modes.lightsOut')}-${t('game.base.step2.oneClickSet.cave')}`"
          @click="handleCreateWorld({clusterType: 'lightsOut', worldType: 'cave'})"
        />
      </v-list>
    </v-menu>
  </v-tabs>
  <v-tabs-window v-model="worldTabName">
    <v-tabs-window-item
      v-for="world in worldForm"
      :key="world.name"
      :value="world.name"
    >
      <v-form :ref="(el) => (dynamicWorldRefs[world.name] = el)">
        <v-row class="mt-4">
          <v-col :cols="mobile?12:4">
            <v-radio-group
              v-model="world.isMaster"
              inline
              @update:model-value="handleIsMasterChange"
            >
              <template #prepend>
                <v-chip v-tooltip="t('game.base.step2.isMaster.tip')">
                  {{ t('game.base.step2.isMaster.name') }}
                </v-chip>
              </template>
              <v-radio
                :label="t('game.base.step2.isMaster.radio.yes')"
                :value="true"
                class="mr-4"
              />
              <v-radio
                :label="t('game.base.step2.isMaster.radio.no')"
                :value="false"
                class="mr-4"
              />
            </v-radio-group>
          </v-col>
          <v-col :cols="mobile?12:4">
            <v-radio-group
              v-model="world.encodeUserPath"
              inline
            >
              <template #prepend>
                <v-chip v-tooltip="t('game.base.step2.encodeUserPath.tip')">
                  {{ t('game.base.step2.encodeUserPath.name') }}
                </v-chip>
              </template>
              <v-radio
                :label="t('game.base.step2.encodeUserPath.radio.yes')"
                :value="true"
                class="mr-4"
              />
              <v-radio
                :label="t('game.base.step2.encodeUserPath.radio.no')"
                :value="false"
                class="mr-4"
              />
            </v-radio-group>
          </v-col>
          <v-col :cols="mobile?12:4">
            <v-text-field
              v-model="world.worldName"
              v-tooltip="t('game.base.step2.worldName.tip')"
              :disabled="(props.formData?.length||0) !== 0"
              :rules="worldFormRules.worldName"
              :label="t('game.base.step2.worldName.name')"
            />
          </v-col>
        </v-row>
        <v-row class="mt-4">
          <v-col :cols="mobile?12:3">
            <v-number-input
              v-model="world.gameID"
              v-tooltip="t('game.base.step2.gameID.tip')"
              :disabled="(props.formData?.length||0) !== 0"
              :rules="worldFormRules.gameID"
              :label="t('game.base.step2.gameID.name')"
              :min="1"
              :max="65535"
              style="margin-bottom: -1.25rem"
            />
          </v-col>
          <v-col :cols="mobile?12:3">
            <v-number-input
              v-model="world.serverPort"
              v-tooltip="t('game.base.step2.serverPort.tip')"
              :rules="worldFormRules.serverPort"
              :label="t('game.base.step2.serverPort.name')"
              :min="1"
              :max="65535"
              style="margin-bottom: -1.25rem"
            />
          </v-col>
          <v-col :cols="mobile?12:3">
            <v-number-input
              v-model="world.masterServerPort"
              v-tooltip="t('game.base.step2.masterServerPort.tip')"
              :rules="worldFormRules.masterServerPort"
              :label="t('game.base.step2.masterServerPort.name')"
              :min="1"
              :max="65535"
              style="margin-bottom: -1.25rem"
            />
          </v-col>
          <v-col :cols="mobile?12:3">
            <v-number-input
              v-model="world.authenticationPort"
              v-tooltip="t('game.base.step2.authenticationPort.tip')"
              :rules="worldFormRules.authenticationPort"
              :label="t('game.base.step2.authenticationPort.name')"
              :min="1"
              :max="65535"
              style="margin-bottom: -1.25rem"
            />
          </v-col>
        </v-row>
      </v-form>
      <v-tabs
        v-model="worldLevelDataTabName"
        class="mt-4"
        @update:model-value="handleWorldTabChange"
      >
        <v-tab value="Code">
          <v-icon
            icon="ri-code-s-slash-line"
            class="mr-2"
          />
          {{ t('game.base.step2.code') }}
        </v-tab>
        <v-tab
          v-if="(props.gameMode==='endless'||
            props.gameMode==='relaxed'||
            props.gameMode==='wilderness'||
            props.gameMode==='lightsOut'||
            props.gameMode==='survival')&&
            world.levelData!==''"
          value="Visualization"
        >
          <v-icon
            icon="ri-image-ai-line"
            class="mr-2"
          />
          {{ t('game.base.step2.visualization') }}
        </v-tab>
      </v-tabs>
      <v-tabs-window v-model="worldLevelDataTabName">
        <v-tabs-window-item value="Code">
          <code-editor
            v-model="world.levelData"
            :height="mobile?300:props.tabWindowHeight"
            :theme="props.theme === 'dark' ? 'lucario' : 'idea'"
            class="mt-4"
            mode="lua"
            style="width: 100%"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="Visualization">
          <template v-if="visualizationType==='forest' && Object.keys(overridesObj).length!==0">
            <v-alert
              color="info"
              :title="t('game.base.step2.worldRule.worldRule')+' - '+t('game.base.step2.worldRule.global')"
              density="compact"
              class="mt-4 mb-2"
              variant="tonal"
              icon="ri-scales-3-fill"
            />
            <div class="item-container">
              <template v-for="(i, key) in groundWorldRule.global">
                <div>
                  <level-data-setting
                    :key="key"
                    v-model="overridesObj[i]"
                    :configs="overrides[i]?.configs || ['undefined']"
                    :custom-configs-value="overrides[i]?.customConfigsValue || {}"
                    :default-model-value="overrides[i]?.modelValue || 'undefined'"
                    :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                    :image="overrides[i]?.image || 'undefined.png'"
                    :name="i"
                    @change-model-value="handleModelValueChange"
                  />
                </div>
              </template>
            </div>
            <v-alert
              color="info"
              :title="t('game.base.step2.worldRule.worldRule')+' - '+t('game.base.step2.worldRule.events')"
              density="compact"
              class="mt-4 mb-2"
              variant="tonal"
              icon="ri-scales-3-fill"
            />
            <div class="item-container">
              <template v-for="(i, key) in groundWorldRule.events">
                <div>
                  <level-data-setting
                    :key="key"
                    v-model="overridesObj[i]"
                    :configs="overrides[i]?.configs || ['undefined']"
                    :custom-configs-value="overrides[i]?.customConfigsValue || {}"
                    :default-model-value="overrides[i]?.modelValue || 'undefined'"
                    :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                    :image="overrides[i]?.image || 'undefined.png'"
                    :name="i"
                    @change-model-value="handleModelValueChange"
                  />
                </div>
              </template>
            </div>
            <v-alert
              color="info"
              :title="t('game.base.step2.worldRule.worldRule')+' - '+t('game.base.step2.worldRule.survivors')"
              density="compact"
              class="mt-4 mb-2"
              variant="tonal"
              icon="ri-scales-3-fill"
            />
            <div class="item-container">
              <template v-for="(i, key) in groundWorldRule.survivors">
                <div>
                  <level-data-setting
                    :key="key"
                    v-model="overridesObj[i]"
                    :configs="overrides[i]?.configs || ['undefined']"
                    :custom-configs-value="overrides[i]?.customConfigsValue || {}"
                    :default-model-value="overrides[i]?.modelValue || 'undefined'"
                    :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                    :image="overrides[i]?.image || 'undefined.png'"
                    :name="i"
                    @change-model-value="handleModelValueChange"
                  />
                </div>
              </template>
            </div>
            <v-alert
              color="info"
              :title="t('game.base.step2.worldRule.worldRule')+' - '+t('game.base.step2.worldRule.world')"
              density="compact"
              class="mt-4 mb-2"
              variant="tonal"
              icon="ri-scales-3-fill"
            />
            <div class="item-container">
              <template v-for="(i, key) in groundWorldRule.world">
                <div>
                  <level-data-setting
                    :key="key"
                    v-model="overridesObj[i]"
                    :configs="overrides[i]?.configs || ['undefined']"
                    :custom-configs-value="overrides[i]?.customConfigsValue || {}"
                    :default-model-value="overrides[i]?.modelValue || 'undefined'"
                    :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                    :image="overrides[i]?.image || 'undefined.png'"
                    :name="i"
                    @change-model-value="handleModelValueChange"
                  />
                </div>
              </template>
            </div>
            <v-alert
              color="info"
              :title="t('game.base.step2.worldRule.worldRule')+' - '+t('game.base.step2.worldRule.resourceRegrowth')"
              density="compact"
              class="mt-4 mb-2"
              variant="tonal"
              icon="ri-scales-3-fill"
            />
            <div class="item-container">
              <template v-for="(i, key) in groundWorldRule.resourceRegrowth">
                <div>
                  <level-data-setting
                    :key="key"
                    v-model="overridesObj[i]"
                    :configs="overrides[i]?.configs || ['undefined']"
                    :custom-configs-value="overrides[i]?.customConfigsValue || {}"
                    :default-model-value="overrides[i]?.modelValue || 'undefined'"
                    :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                    :image="overrides[i]?.image || 'undefined.png'"
                    :name="i"
                    @change-model-value="handleModelValueChange"
                  />
                </div>
              </template>
            </div>
            <v-alert
              color="info"
              :title="t('game.base.step2.worldRule.worldRule')+' - '+t('game.base.step2.worldRule.unnaturalPortalResource')"
              density="compact"
              class="mt-4 mb-2"
              variant="tonal"
              icon="ri-scales-3-fill"
            />
            <div class="item-container">
              <template v-for="(i, key) in groundWorldRule.unnaturalPortalResource">
                <div>
                  <level-data-setting
                    :key="key"
                    v-model="overridesObj[i]"
                    :configs="overrides[i]?.configs || ['undefined']"
                    :custom-configs-value="overrides[i]?.customConfigsValue || {}"
                    :default-model-value="overrides[i]?.modelValue || 'undefined'"
                    :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                    :image="overrides[i]?.image || 'undefined.png'"
                    :name="i"
                    @change-model-value="handleModelValueChange"
                  />
                </div>
              </template>
            </div>
            <v-alert
              color="info"
              :title="t('game.base.step2.worldRule.worldRule')+' - '+t('game.base.step2.worldRule.creatures')"
              density="compact"
              class="mt-4 mb-2"
              variant="tonal"
              icon="ri-scales-3-fill"
            />
            <div class="item-container">
              <template v-for="(i, key) in groundWorldRule.creatures">
                <div>
                  <level-data-setting
                    :key="key"
                    v-model="overridesObj[i]"
                    :configs="overrides[i]?.configs || ['undefined']"
                    :custom-configs-value="overrides[i]?.customConfigsValue || {}"
                    :default-model-value="overrides[i]?.modelValue || 'undefined'"
                    :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                    :image="overrides[i]?.image || 'undefined.png'"
                    :name="i"
                    @change-model-value="handleModelValueChange"
                  />
                </div>
              </template>
            </div>
            <v-alert
              color="info"
              :title="t('game.base.step2.worldRule.worldRule')+' - '+t('game.base.step2.worldRule.hostileCreatures')"
              density="compact"
              class="mt-4 mb-2"
              variant="tonal"
              icon="ri-scales-3-fill"
            />
            <div class="item-container">
              <template v-for="(i, key) in groundWorldRule.hostileCreatures">
                <div>
                  <level-data-setting
                    :key="key"
                    v-model="overridesObj[i]"
                    :configs="overrides[i]?.configs || ['undefined']"
                    :custom-configs-value="overrides[i]?.customConfigsValue || {}"
                    :default-model-value="overrides[i]?.modelValue || 'undefined'"
                    :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                    :image="overrides[i]?.image || 'undefined.png'"
                    :name="i"
                    @change-model-value="handleModelValueChange"
                  />
                </div>
              </template>
            </div>
            <v-alert
              color="info"
              :title="t('game.base.step2.worldRule.worldRule')+' - '+t('game.base.step2.worldRule.giants')"
              density="compact"
              class="mt-4 mb-2"
              variant="tonal"
              icon="ri-scales-3-fill"
            />
            <div class="item-container">
              <template v-for="(i, key) in groundWorldRule.giants">
                <div>
                  <level-data-setting
                    :key="key"
                    v-model="overridesObj[i]"
                    :configs="overrides[i]?.configs || ['undefined']"
                    :custom-configs-value="overrides[i]?.customConfigsValue || {}"
                    :default-model-value="overrides[i]?.modelValue || 'undefined'"
                    :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                    :image="overrides[i]?.image || 'undefined.png'"
                    :name="i"
                    @change-model-value="handleModelValueChange"
                  />
                </div>
              </template>
            </div>
            <v-alert
              color="info"
              :title="t('game.base.step2.worldRule.worldRule')+' - '+t('game.base.step2.worldRule.moonMutated')"
              density="compact"
              class="mt-4 mb-2"
              variant="tonal"
              icon="ri-scales-3-fill"
            />
            <div class="item-container">
              <template v-for="(i, key) in groundWorldRule.moonMutated">
                <div>
                  <level-data-setting
                    :key="key"
                    v-model="overridesObj[i]"
                    :configs="overrides[i]?.configs || ['undefined']"
                    :custom-configs-value="overrides[i]?.customConfigsValue || {}"
                    :default-model-value="overrides[i]?.modelValue || 'undefined'"
                    :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                    :image="overrides[i]?.image || 'undefined.png'"
                    :name="i"
                    @change-model-value="handleModelValueChange"
                  />
                </div>
              </template>
            </div>
            <v-alert
              color="success"
              :title="t('game.base.step2.worldGeneration.worldGeneration')+' - '+t('game.base.step2.worldGeneration.global')+t('game.base.step2.worldGeneration.tip')"
              density="compact"
              class="mt-4 mb-2"
              variant="tonal"
              icon="ri-color-filter-ai-line"
            />
            <div class="item-container">
              <template v-for="(i, key) in groundWorldGeneration.global">
                <div>
                  <level-data-setting
                    :key="key"
                    v-model="overridesObj[i]"
                    :configs="overrides[i]?.configs || ['undefined']"
                    :custom-configs-value="overrides[i]?.customConfigsValue || {}"
                    :default-model-value="overrides[i]?.modelValue || 'undefined'"
                    :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                    :image="overrides[i]?.image || 'undefined.png'"
                    :name="i"
                    @change-model-value="handleModelValueChange"
                  />
                </div>
              </template>
            </div>
            <v-alert
              color="success"
              :title="t('game.base.step2.worldGeneration.worldGeneration')+' - '+t('game.base.step2.worldGeneration.world')+t('game.base.step2.worldGeneration.tip')"
              density="compact"
              class="mt-4 mb-2"
              variant="tonal"
              icon="ri-color-filter-ai-line"
            />
            <div class="item-container">
              <template v-for="(i, key) in groundWorldGeneration.world">
                <div>
                  <level-data-setting
                    :key="key"
                    v-model="overridesObj[i]"
                    :configs="overrides[i]?.configs || ['undefined']"
                    :custom-configs-value="overrides[i]?.customConfigsValue || {}"
                    :default-model-value="overrides[i]?.modelValue || 'undefined'"
                    :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                    :image="overrides[i]?.image || 'undefined.png'"
                    :name="i"
                    @change-model-value="handleModelValueChange"
                  />
                </div>
              </template>
            </div>
            <v-alert
              color="success"
              :title="t('game.base.step2.worldGeneration.worldGeneration')+' - '+t('game.base.step2.worldGeneration.resources')+t('game.base.step2.worldGeneration.tip')"
              density="compact"
              class="mt-4 mb-2"
              variant="tonal"
              icon="ri-color-filter-ai-line"
            />
            <div class="item-container">
              <template v-for="(i, key) in groundWorldGeneration.resources">
                <div>
                  <level-data-setting
                    :key="key"
                    v-model="overridesObj[i]"
                    :configs="overrides[i]?.configs || ['undefined']"
                    :custom-configs-value="overrides[i]?.customConfigsValue || {}"
                    :default-model-value="overrides[i]?.modelValue || 'undefined'"
                    :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                    :image="overrides[i]?.image || 'undefined.png'"
                    :name="i"
                    @change-model-value="handleModelValueChange"
                  />
                </div>
              </template>
            </div>
            <v-alert
              color="success"
              :title="t('game.base.step2.worldGeneration.worldGeneration')+' - '+t('game.base.step2.worldGeneration.creaturesAndSpawners')+t('game.base.step2.worldGeneration.tip')"
              density="compact"
              class="mt-4 mb-2"
              variant="tonal"
              icon="ri-color-filter-ai-line"
            />
            <div class="item-container">
              <template v-for="(i, key) in groundWorldGeneration.creaturesAndSpawners">
                <div>
                  <level-data-setting
                    :key="key"
                    v-model="overridesObj[i]"
                    :configs="overrides[i]?.configs || ['undefined']"
                    :custom-configs-value="overrides[i]?.customConfigsValue || {}"
                    :default-model-value="overrides[i]?.modelValue || 'undefined'"
                    :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                    :image="overrides[i]?.image || 'undefined.png'"
                    :name="i"
                    @change-model-value="handleModelValueChange"
                  />
                </div>
              </template>
            </div>
            <v-alert
              color="success"
              :title="t('game.base.step2.worldGeneration.worldGeneration')+' - '+t('game.base.step2.worldGeneration.hostileCreaturesAndSpawners')+t('game.base.step2.worldGeneration.tip')"
              density="compact"
              class="mt-4 mb-2"
              variant="tonal"
              icon="ri-color-filter-ai-line"
            />
            <div class="item-container">
              <template v-for="(i, key) in groundWorldGeneration.hostileCreaturesAndSpawners">
                <div>
                  <level-data-setting
                    :key="key"
                    v-model="overridesObj[i]"
                    :configs="overrides[i]?.configs || ['undefined']"
                    :custom-configs-value="overrides[i]?.customConfigsValue || {}"
                    :default-model-value="overrides[i]?.modelValue || 'undefined'"
                    :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                    :image="overrides[i]?.image || 'undefined.png'"
                    :name="i"
                    @change-model-value="handleModelValueChange"
                  />
                </div>
              </template>
            </div>
          </template>
          <template v-if="visualizationType==='cave' && Object.keys(overridesObj).length!==0">
            <v-alert
              color="info"
              :title="t('game.base.step2.worldRule.worldRule')+' - '+t('game.base.step2.worldRule.world')"
              density="compact"
              class="mt-4 mb-2"
              variant="tonal"
              icon="ri-scales-3-fill"
            />
            <div class="item-container">
              <template v-for="(i, key) in cavesWorldRule.world">
                <div>
                  <level-data-setting
                    :key="key"
                    v-model="overridesObj[i]"
                    :configs="overrides[i]?.configs || ['undefined']"
                    :custom-configs-value="overrides[i]?.customConfigsValue || {}"
                    :default-model-value="overrides[i]?.modelValue || 'undefined'"
                    :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                    :image="overrides[i]?.image || 'undefined.png'"
                    :name="i"
                    @change-model-value="handleModelValueChange"
                  />
                </div>
              </template>
            </div>
            <v-alert
              color="info"
              :title="t('game.base.step2.worldRule.worldRule')+' - '+t('game.base.step2.worldRule.resourceRegrowth')"
              density="compact"
              class="mt-4 mb-2"
              variant="tonal"
              icon="ri-scales-3-fill"
            />
            <div class="item-container">
              <template v-for="(i, key) in cavesWorldRule.resourceRegrowth">
                <div>
                  <level-data-setting
                    :key="key"
                    v-model="overridesObj[i]"
                    :configs="overrides[i]?.configs || ['undefined']"
                    :custom-configs-value="overrides[i]?.customConfigsValue || {}"
                    :default-model-value="overrides[i]?.modelValue || 'undefined'"
                    :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                    :image="overrides[i]?.image || 'undefined.png'"
                    :name="i"
                    @change-model-value="handleModelValueChange"
                  />
                </div>
              </template>
            </div>
            <v-alert
              color="info"
              :title="t('game.base.step2.worldRule.worldRule')+' - '+t('game.base.step2.worldRule.creatures')"
              density="compact"
              class="mt-4 mb-2"
              variant="tonal"
              icon="ri-scales-3-fill"
            />
            <div class="item-container">
              <template v-for="(i, key) in cavesWorldRule.creatures">
                <div>
                  <level-data-setting
                    :key="key"
                    v-model="overridesObj[i]"
                    :configs="overrides[i]?.configs || ['undefined']"
                    :custom-configs-value="overrides[i]?.customConfigsValue || {}"
                    :default-model-value="overrides[i]?.modelValue || 'undefined'"
                    :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                    :image="overrides[i]?.image || 'undefined.png'"
                    :name="i"
                    @change-model-value="handleModelValueChange"
                  />
                </div>
              </template>
            </div>
            <v-alert
              color="info"
              :title="t('game.base.step2.worldRule.worldRule')+' - '+t('game.base.step2.worldRule.hostileCreatures')"
              density="compact"
              class="mt-4 mb-2"
              variant="tonal"
              icon="ri-scales-3-fill"
            />
            <div class="item-container">
              <template v-for="(i, key) in cavesWorldRule.hostileCreatures">
                <div>
                  <level-data-setting
                    :key="key"
                    v-model="overridesObj[i]"
                    :configs="overrides[i]?.configs || ['undefined']"
                    :custom-configs-value="overrides[i]?.customConfigsValue || {}"
                    :default-model-value="overrides[i]?.modelValue || 'undefined'"
                    :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                    :image="overrides[i]?.image || 'undefined.png'"
                    :name="i"
                    @change-model-value="handleModelValueChange"
                  />
                </div>
              </template>
            </div>
            <v-alert
              color="info"
              :title="t('game.base.step2.worldRule.worldRule')+' - '+t('game.base.step2.worldRule.giants')"
              density="compact"
              class="mt-4 mb-2"
              variant="tonal"
              icon="ri-scales-3-fill"
            />
            <div class="item-container">
              <template v-for="(i, key) in cavesWorldRule.giants">
                <div>
                  <level-data-setting
                    :key="key"
                    v-model="overridesObj[i]"
                    :configs="overrides[i]?.configs || ['undefined']"
                    :custom-configs-value="overrides[i]?.customConfigsValue || {}"
                    :default-model-value="overrides[i]?.modelValue || 'undefined'"
                    :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                    :image="overrides[i]?.image || 'undefined.png'"
                    :name="i"
                    @change-model-value="handleModelValueChange"
                  />
                </div>
              </template>
            </div>
            <v-alert
              color="info"
              :title="t('game.base.step2.worldRule.worldRule')+' - '+t('game.base.step2.worldRule.moonMutated')"
              density="compact"
              class="mt-4 mb-2"
              variant="tonal"
              icon="ri-scales-3-fill"
            />
            <div class="item-container">
              <template v-for="(i, key) in cavesWorldRule.moonMutated">
                <div>
                  <level-data-setting
                    :key="key"
                    v-model="overridesObj[i]"
                    :configs="overrides[i]?.configs || ['undefined']"
                    :custom-configs-value="overrides[i]?.customConfigsValue || {}"
                    :default-model-value="overrides[i]?.modelValue || 'undefined'"
                    :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                    :image="overrides[i]?.image || 'undefined.png'"
                    :name="i"
                    @change-model-value="handleModelValueChange"
                  />
                </div>
              </template>
            </div>
            <v-alert
              color="success"
              :title="t('game.base.step2.worldGeneration.worldGeneration')+' - '+t('game.base.step2.worldGeneration.world')+t('game.base.step2.worldGeneration.tip')"
              density="compact"
              class="mt-4 mb-2"
              variant="tonal"
              icon="ri-color-filter-ai-line"
            />
            <div class="item-container">
              <template v-for="(i, key) in cavesWorldGeneration.world">
                <div>
                  <level-data-setting
                    :key="key"
                    v-model="overridesObj[i]"
                    :configs="caveOverrideWorldGenerationWorld[i]?.configs || ['undefined']"
                    :custom-configs-value="caveOverrideWorldGenerationWorld[i]?.customConfigsValue || {}"
                    :default-model-value="caveOverrideWorldGenerationWorld[i]?.modelValue || 'undefined'"
                    :i18n="caveOverrideWorldGenerationWorld[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                    :image="caveOverrideWorldGenerationWorld[i]?.image || 'undefined.png'"
                    :name="i"
                    @change-model-value="handleModelValueChange"
                  />
                </div>
              </template>
            </div>
            <v-alert
              color="success"
              :title="t('game.base.step2.worldGeneration.worldGeneration')+' - '+t('game.base.step2.worldGeneration.resources')+t('game.base.step2.worldGeneration.tip')"
              density="compact"
              class="mt-4 mb-2"
              variant="tonal"
              icon="ri-color-filter-ai-line"
            />
            <div class="item-container">
              <template v-for="(i, key) in cavesWorldGeneration.resources">
                <div>
                  <level-data-setting
                    :key="key"
                    v-model="overridesObj[i]"
                    :configs="overrides[i]?.configs || ['undefined']"
                    :custom-configs-value="overrides[i]?.customConfigsValue || {}"
                    :default-model-value="overrides[i]?.modelValue || 'undefined'"
                    :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                    :image="overrides[i]?.image || 'undefined.png'"
                    :name="i"
                    @change-model-value="handleModelValueChange"
                  />
                </div>
              </template>
            </div>
            <v-alert
              color="success"
              :title="t('game.base.step2.worldGeneration.worldGeneration')+' - '+t('game.base.step2.worldGeneration.creaturesAndSpawners')+t('game.base.step2.worldGeneration.tip')"
              density="compact"
              class="mt-4 mb-2"
              variant="tonal"
              icon="ri-color-filter-ai-line"
            />
            <div class="item-container">
              <template v-for="(i, key) in cavesWorldGeneration.creaturesAndSpawners">
                <div>
                  <level-data-setting
                    :key="key"
                    v-model="overridesObj[i]"
                    :configs="overrides[i]?.configs || ['undefined']"
                    :custom-configs-value="overrides[i]?.customConfigsValue || {}"
                    :default-model-value="overrides[i]?.modelValue || 'undefined'"
                    :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                    :image="overrides[i]?.image || 'undefined.png'"
                    :name="i"
                    @change-model-value="handleModelValueChange"
                  />
                </div>
              </template>
            </div>
            <v-alert
              color="success"
              :title="t('game.base.step2.worldGeneration.worldGeneration')+' - '+t('game.base.step2.worldGeneration.hostileCreaturesAndSpawners')+t('game.base.step2.worldGeneration.tip')"
              density="compact"
              class="mt-4 mb-2"
              variant="tonal"
              icon="ri-color-filter-ai-line"
            />
            <div class="item-container">
              <template v-for="(i, key) in cavesWorldGeneration.hostileCreaturesAndSpawners">
                <div>
                  <level-data-setting
                    :key="key"
                    v-model="overridesObj[i]"
                    :configs="overrides[i]?.configs || ['undefined']"
                    :custom-configs-value="overrides[i]?.customConfigsValue || {}"
                    :default-model-value="overrides[i]?.modelValue || 'undefined'"
                    :i18n="overrides[i]?.i18n || {zh: '平台未识别', en: 'undefined'}"
                    :image="overrides[i]?.image || 'undefined.png'"
                    :name="i"
                    @change-model-value="handleModelValueChange"
                  />
                </div>
              </template>
            </div>
          </template>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script setup>
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import { GamePortFactor } from "@/config/index.js"
import { showSnackbar } from "@/utils/snackbar.js"
import { debounce } from "@/utils/tools.js"
import luaparse from 'luaparse'
import luamin from 'lua-format'
import CodeEditor from "@/components/CodeEditor.vue"
import { endless, survival, relaxed, wilderness, lightsOut, lavaarena, quagmire } from "./leveldataoverride.js"
import LevelDataSetting from "./levelDataSetting.vue"
import {
  caveOverrideWorldGenerationWorld,
  cavesWorldGeneration,
  cavesWorldRule,
  groundWorldGeneration,
  groundWorldRule,
  overrides,
} from "./levelDataMap.js"
import ConfirmBox from "@/components/ConfirmBox.vue"


const props = defineProps({
  formData: {
    type: Array,
    default: () => ([]),
  },
  worldCount: {
    type: Number,
    default: 0,
  },
  maxWorlds: {
    type: Number,
    default: 0,
  },
  gameMode: {
    type: String,
    default: 'endless',
  },
  theme: {
    type: String,
    default: 'light',
  },
  tabWindowHeight: {
    type: Number,
    default: 600,
  },
})

const { mobile } = useDisplay()
const { t } = useI18n()

onMounted(async () => {
  portFactor.value = props.worldCount + 1

  if ((props.formData?.length||0) !== 0) {
    globalWorldIndex.value = props.formData.length
    worldForm.value = props.formData
    worldForm.value.forEach((world, index) => {
      world.name = `World${index+1}`
    })
  } else {
    globalWorldIndex.value = 1
    worldForm.value[0].name = 'World1'
    worldForm.value[0].isMaster = true
    worldForm.value[0].gameID = 101
    worldForm.value[0].worldName = 'Master'
    worldForm.value[0].serverPort = portFactor.value + GamePortFactor.serverPort
    worldForm.value[0].masterServerPort = portFactor.value + GamePortFactor.masterServerPort
    worldForm.value[0].authenticationPort = portFactor.value + GamePortFactor.authenticationPort

    if (!(props.gameMode === 'lavaarena' || props.gameMode === 'quagmire' || props.gameMode === 'custom')) {
      worldForm.value[0].levelData = eval(props.gameMode).master
      await handleWorldTabsEdit('', 'add')
      worldForm.value[1].levelData = eval(props.gameMode).caves
    }
    if (props.gameMode === 'lavaarena' || props.gameMode === 'quagmire') {
      worldForm.value[0].levelData = eval(props.gameMode).master
    }

  }

  worldTabName.value = worldForm.value[0].name
})

const worldTabName = ref('')

const worldForm = ref([{
  name: '', // 仅作为tabName
  gameID: 0,
  worldName: '',
  serverPort: 0,
  masterServerPort: 0,
  authenticationPort: 0,
  isMaster: false,
  encodeUserPath: true,
  levelData: '',
  modData: '',
}])

const worldFormRules = ref({
  gameID: [
    value => {
      if (value) return true

      return t('game.base.step2.gameID.required')
    },
  ],
  worldName: [
    value => {
      if (value) return true

      return t('game.base.step2.worldName.required')
    },
  ],
  serverPort: [
    value => {
      if (value) return true

      return t('game.base.step2.serverPort.required')
    },
  ],
  masterServerPort: [
    value => {
      if (value) return true

      return t('game.base.step2.masterServerPort.required')
    },
  ],
  authenticationPort: [
    value => {
      if (value) return true

      return t('game.base.step2.authenticationPort.required')
    },
  ],
})

// name: ref
const dynamicWorldRefs = {}

// 防止 name 重复
const globalWorldIndex = ref(0)

// 防止端口冲突
const portFactor = ref(0)

// 删除世界确认
const deleteWorldDialog = ref(false)
const deleteWorldConfirm = ref(undefined)

const handleWorldTabsEdit = async (targetName, action) => {
  if (action === 'add') {
    globalWorldIndex.value = globalWorldIndex.value + 1
    portFactor.value = portFactor.value + 1

    const newWorldName = `World${globalWorldIndex.value}`

    let hasNameCaves = false

    for (let world of worldForm.value) {
      if (world.worldName === 'Caves') {
        hasNameCaves = true
      }
    }

    dynamicWorldRefs[newWorldName] = ref()
    worldForm.value.push({
      name: newWorldName,
      gameID: worldForm.value[worldForm.value.length-1].gameID + 1,
      worldName: hasNameCaves?`Caves${worldForm.value[worldForm.value.length-1].gameID + 1}`:'Caves',
      serverPort: GamePortFactor.serverPort + portFactor.value,
      masterServerPort: GamePortFactor.masterServerPort + portFactor.value,
      authenticationPort: GamePortFactor.authenticationPort + portFactor.value,
      isMaster: false,
      encodeUserPath: true,
      levelData: '',
      modData: '',
    })
    worldTabName.value = newWorldName

    worldLevelDataTabName.value = 'Code'
  } else if (action === 'remove') {
    if (worldForm.value.length === 1) {
      showSnackbar('每个房间至少含有一个世界', 'error')

      return
    }

    deleteWorldDialog.value = true
    deleteWorldConfirm.value = undefined

    return new Promise(resolve => {
      const unwatch = watch(deleteWorldConfirm, value => {
        if (value === true) {
          // 用户确认，执行删除
          const tabs = worldForm.value

          worldForm.value = tabs.filter(tab => tab.name !== targetName)
          delete dynamicWorldRefs[targetName]

          worldLevelDataTabName.value = 'Code'
          worldTabName.value = undefined

          // 清理
          deleteWorldConfirm.value = undefined
          deleteWorldDialog.value = false
          unwatch() // 停止监听
          resolve(true)
        } else if (value === false) {
          // 清理
          deleteWorldConfirm.value = undefined
          deleteWorldDialog.value = false
          unwatch() // 停止监听
          resolve(false)
        }
      })
    })
  }
}

const handleCreateWorld = cmd => {
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

      if (cmd.clusterType === 'relaxed') {
        if (cmd.worldType === 'ground') {
          world.levelData = relaxed.master
        }
        if (cmd.worldType === 'cave') {
          world.levelData = relaxed.caves
        }
      }

      if (cmd.clusterType === 'wilderness') {
        if (cmd.worldType === 'ground') {
          world.levelData = wilderness.master
        }
        if (cmd.worldType === 'cave') {
          world.levelData = wilderness.caves
        }
      }

      if (cmd.clusterType === 'lightsOut') {
        if (cmd.worldType === 'ground') {
          world.levelData = lightsOut.master
        }
        if (cmd.worldType === 'cave') {
          world.levelData = lightsOut.caves
        }
      }

      if (cmd.clusterType === 'lavaarena') {
        if (cmd.worldType === 'ground') {
          world.levelData = lavaarena.master
        }
      }

      if (cmd.clusterType === 'quagmire') {
        if (cmd.worldType === 'ground') {
          world.levelData = quagmire.master
        }
      }
    }
  }
}

const worldLevelDataTabName = ref('Code')
const visualizationType = ref('')

const handleWorldTabChange = async name => {
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

const getWorldType = levelData => {
  const regex = /location\s*=\s*"([^"]*)"/
  const match = levelData.match(regex)

  if (match) {
    return match[1]
  } else {
    return ""
  }
}

const overridesObj = ref({})

const generateOverridesObj = levelData => {
  if (levelData === '') {
    return
  }
  const ast = luaparse.parse(levelData)

  // 提取 overrides 字段
  const overridesTable = extractOverrides(ast)


  // 将 Lua 表转换为 JavaScript 对象
  overridesObj.value = convertLuaTableToObject(overridesTable)
}

function extractOverrides(ast) {
  // 找到 return 语句中的 overrides 字段
  const returnStatement = ast.body[0] // 假设只有一个 return 语句
  const returnTable = returnStatement.arguments[0] // return 语句的参数是一个表

  // 遍历表中的字段，找到 overrides 字段
  for (const field of returnTable.fields) {
    if (field.key.type === 'Identifier' && field.key.name === 'overrides') {
      return field.value
    }
  }

  return null
}

function convertLuaTableToObject(luaTable) {
  const obj = {}
  for (const field of luaTable.fields) {
    const key = field.key.name

    obj[key] = field.value.raw.replace(/"/g, '')
  }

  return obj
}

const beautifyLua = luaScript => {
  let removedWatermark = luamin.Beautify(luaScript, {
    RenameVariables: false,
    RenameGlobals: false,
    SolveMath: false,
  })
  removedWatermark = removedWatermark.replace(/--\[\[\n\t.+\n\t.+\n--\]\]\n\n\n\n\n/g, "")
  removedWatermark = removedWatermark.replace(/ = /g, "=")
  removedWatermark = removedWatermark.replace(/\t/g, "  ")

  removedWatermark = removedWatermark.replace(/overrides=\{ +(.+)\n/g, "overrides={\n    $1\n")
  removedWatermark = removedWatermark.replace(/^(\w+)=(.+)\n/gm, "    $1=$2\n")
  removedWatermark = removedWatermark.replace(/(.+)\},\n/g, "$1\n  },\n")
  removedWatermark = removedWatermark.replace(/^ +\n/gm, "")

  return removedWatermark
}

const handleModelValueChange = debounce(data => {
  const key = data.name
  const value = data.value
  for (let world of worldForm.value) {
    if (world.name === worldTabName.value) {
      const ast = luaparse.parse(world.levelData)

      // 提取 overrides 字段
      const overridesTable = extractOverrides(ast)
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
  const indent = '    '.repeat(indentLevel)
  switch (astNode.type) {
  case 'Chunk':
    return astNode.body.map(node => astToLua(node, indentLevel)).join('\n')
  case 'LocalStatement':
    return `${indent}local ${astNode.variables.map(astToLua).join(', ')} = ${astNode.init.map(astToLua).join(', ')}`
  case 'FunctionDeclaration':
    return `${indent}function ${astToLua(astNode.identifier)}(${astNode.parameters.map(astToLua).join(', ')}) \n${astToLua(astNode.body, indentLevel + 1)}\n${indent}end`
  case 'ReturnStatement':
    return `${indent}return ${astNode.arguments.map(astToLua).join(', ')}`
  case 'BinaryExpression':
    return `${astToLua(astNode.left)} ${astNode.operator} ${astToLua(astNode.right)}`
  case 'CallStatement':
    return `${indent}${astToLua(astNode.expression)}`
  case 'Identifier':
    return astNode.name
  case 'StringLiteral':
    return `${astNode.raw}`
  case 'NumericLiteral':
    return astNode.raw
  case 'VarargLiteral':
    return '...'
  case 'TableConstructorExpression':
    return `${indent}{ ${astNode.fields.map(field => astToLua(field, indentLevel + 1)).join(',\n' + indent)} }`
  case 'Field':
    return astNode.key ? `${astToLua(astNode.key)} = ${astToLua(astNode.value)}` : astToLua(astNode.value)
  case 'AssignmentStatement':
    return `${indent}${astNode.variables.map(astToLua).join(', ')} = ${astNode.init.map(astToLua).join(', ')}`
  case 'CallExpression':
    return `${astToLua(astNode.base)}(${astNode.arguments.map(astToLua).join(', ')})`
  case 'TableKeyString':
    return `${astToLua(astNode.key)} = ${astToLua(astNode.value)}`
  case 'BooleanLiteral':
    return astNode.raw
  case 'TableKey':
    return `[${astToLua(astNode.key)}] = ${astToLua(astNode.value)}`
  case 'TableValue':
    return astToLua(astNode.value)
  default:
    throw new Error(`Unsupported node type: ${astNode.type}`)
  }
}

const handleIsMasterChange = () => {
  for (let world of worldForm.value) {
    if (world.name === worldTabName.value) {
      if (world.isMaster) {
        world.worldName = 'Master'
      } else {
        if (worldForm.value.length < 3) {
          world.worldName = 'Caves'
        }
      }
    }
  }
}

const canCreateWorld = ref(false)

const validate = async () => {
  const returnData = {
    validate: false,
    formData: {},
  }

  for (let key in dynamicWorldRefs) {
    if (dynamicWorldRefs[key]) {
      const { valid } = await dynamicWorldRefs[key].validate()
      if (!valid) {
        return returnData
      }
    }
  }
  for (let i of worldForm.value) {
    if (i.levelData === '') {
      showSnackbar(t('game.base.step2.levelData.required'), 'error')
      
      return returnData
    }
    try {
      luaparse.parse(i.levelData)
    } catch (e) {
      showSnackbar(t('game.base.step2.levelData.lua'), 'error')
      
      return returnData
    }
  }

  returnData.validate = true
  returnData.formData = worldForm.value

  return returnData
}

defineExpose({
  validate,
})

watch(worldTabName, v => {
  if (!v) {
    worldTabName.value = worldForm.value[worldForm.value.length - 1].name
  }
  worldLevelDataTabName.value = 'Code'
}, { immediate: true })

watch(() => worldForm.value.length, l => {
  if (props.maxWorlds === 0) {
    canCreateWorld.value = true
  } else {
    canCreateWorld.value = l < props.maxWorlds
  }
}, { immediate: true },
)
</script>

<style scoped>
.item-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240.5px, 1fr));
  gap: 10px;
  min-width: 360px;
}
</style>
