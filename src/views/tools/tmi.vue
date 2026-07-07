<template>
  <!-- 游戏是否安装 -->
  <template v-if="globalStore.gameVersion.local!==0">
    <!-- 房间是否选择 -->
    <template v-if="globalStore.room.id!==0">
      <!-- 插件是否启用 -->
      <template v-if="pluginStatus">
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>
                <div class="card-header">
                  <div>
                    <span v-if="!mobile">
                      {{ t('tools.tmi.cardPlayerAndWorld.playerSelect.selected') }}
                    </span>
                    <v-chip
                      v-if="selectPlayer"
                      color="info"
                      label
                    >
                      {{ selectPlayer.nickname }}
                    </v-chip>
                    <v-chip
                      v-else
                      color="warning"
                      label
                    >
                      {{ t('tools.tmi.cardPlayerAndWorld.playerSelect.noSelected') }}
                    </v-chip>
                  </div>
                  <div class="fcc">
                    <v-chip
                      v-if="!(selectWorldID||mobile)"
                      color="warning"
                      label
                      class="mr-4"
                    >
                      {{ t('tools.tmi.cardPlayerAndWorld.worldSelect.noSelected') }}
                    </v-chip>
                    <v-select
                      v-model="selectWorldID"
                      min-width="150px"
                      density="compact"
                      item-title="worldName"
                      item-value="id"
                      :items="baseInfo.worlds"
                      :label="t('tools.tmi.cardPlayerAndWorld.worldSelect.world')"
                    />
                  </div>
                </div>
              </v-card-title>
              <v-card-text>
                <v-btn
                  v-for="(player, i) in baseInfo.players"
                  v-if="baseInfo.players.length"
                  :key="i"
                  color="primary"
                  variant="text"
                  :text="player.nickname"
                  class="mr-4"
                  @click="selectPlayer=player"
                />
                <v-alert
                  v-else
                  color="x"
                  density="compact"
                >
                  {{ t('tools.tmi.cardPlayerAndWorld.playerSelect.noOnlinePlayer') }}
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            md="8"
          >
            <v-card
              :height="calculateContainerSize()"
              class="d-flex flex-column"
            >
              <v-card-text>
                <v-tabs
                  v-model="selectedCategory"
                  align-tabs="start"
                  color="primary"
                  show-arrows
                  @update:model-value="handleCategoryClick"
                >
                  <v-tab
                    v-for="items in categories"
                    :key="items"
                    :value="items"
                  >
                    {{ t(`tools.tmi.categories.${items}`) }}
                  </v-tab>
                </v-tabs>
                <div class="flex-fill overflow-y-auto pa-4 align-self-stretch">
                  <template v-if="categoryItems.length > 0">
                    <div class="items-grid">
                      <v-tooltip
                        v-for="item in categoryItems"
                        :key="item.id"
                        location="top"
                      >
                        <template #activator="{ props }">
                          <v-img
                            v-bind="props"
                            :src="'data:image/png;base64,'+item.image"
                            class="cursor-pointer tmi-item"
                            width="64"
                            height="64"
                            @click="handleCmd('generate', item.prefab, 1)"
                            @contextmenu.prevent="handleItemRightClick($event, item)"
                          >
                            <template #error>
                              <div
                                class="fcc"
                                style="height: 64px; width: 64px;"
                              >
                                <template v-if="globalStore.language === 'zh'">
                                  <span v-if="item.name_zh !== ''">
                                    {{ item.name_zh }}
                                  </span>
                                  <span v-else>
                                    {{ item.prefab }}
                                  </span>
                                </template>
                                <template v-if="globalStore.language === 'en'">
                                  <span v-if="item.name_en !== ''">
                                    {{ item.name_en }}
                                  </span>
                                  <span v-else>
                                    {{ item.prefab }}
                                  </span>
                                </template>
                              </div>
                            </template>
                          </v-img>
                        </template>
                        <span>{{ globalStore.language === 'zh' ? item.name_zh : item.name_en }}</span>
                      </v-tooltip>
                    </div>
                    <v-menu
                      v-model="showMenu"
                      :target="[RightClickX, RightClickY]"
                      location-strategy="connected"
                      scrim="false"
                      @focusout="showMenu = false"
                    >
                      <v-list>
                        <v-list-item @click="handleMenuItemClick(5)">
                          <v-list-item-title>
                            {{ t('tools.tmi.cardItems.menu.list5') }}
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="handleMenuItemClick(10)">
                          <v-list-item-title>
                            {{ t('tools.tmi.cardItems.menu.list10') }}
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="handleMenuItemClick(99)">
                          <v-list-item-title>
                            {{ t('tools.tmi.cardItems.menu.list99') }}
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </template>
                  <div
                    v-else-if="itemsLoading"
                    class="fcc"
                    :style="{height: `${calculateContainerSize()-64}px`}"
                  >
                    <v-progress-circular
                      :size="64"
                      indeterminate
                    />
                  </div>
                  <div
                    v-else
                    class="d-flex justify-center align-center fill-height text-medium-emphasis"
                  >
                    {{ t('global.noData') }}
                  </div>
                </div>
                <v-pagination
                  v-if="totalPages > 1"
                  v-model="page"
                  :length="totalPages"
                  class="pa-2"
                  density="compact"
                  @update:model-value="onPageChange"
                />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-card :height="calculateContainerSize()">
              <v-card-text style="height: 100%; overflow-y: auto">
                <v-row>
                  <v-col cols="12">
                    <v-alert
                      color="info"
                      density="compact"
                    >
                      {{ t('tools.tmi.cardCmd.character.title') }}
                    </v-alert>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('hunger', '', 100)"
                    >
                      {{ t('tools.tmi.cardCmd.character.hungerFull') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('hunger', '', 1)"
                    >
                      {{ t('tools.tmi.cardCmd.character.hungerZero') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('sanity', '', 100)"
                    >
                      {{ t('tools.tmi.cardCmd.character.sanFull') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('sanity', '', 1)"
                    >
                      {{ t('tools.tmi.cardCmd.character.sanZero') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('health', '', 100)"
                    >
                      {{ t('tools.tmi.cardCmd.character.healthFull') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('health', '', 1)"
                    >
                      {{ t('tools.tmi.cardCmd.character.healthZero') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('healthLock', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.character.healthLock') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('moisture', '', 100)"
                    >
                      {{ t('tools.tmi.cardCmd.character.moistureFull') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('moisture', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.character.moistureZero') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('playerTemperature', '', 25)"
                    >
                      {{ t('tools.tmi.cardCmd.character.playerTemperature25') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('playerTemperature', '', 70)"
                    >
                      {{ t('tools.tmi.cardCmd.character.playerTemperature70') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('playerTemperature', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.character.playerTemperature0') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('godMode', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.character.godMode') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('creativeMode', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.character.creativeMode') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('oneHitKill', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.character.oneHitKill') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('invisible', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.character.invisible') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('clearInventory', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.character.clearInventory') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('clearBackpack', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.character.clearBackpack') }}
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-alert
                      color="info"
                      density="compact"
                    >
                      {{ t('tools.tmi.cardCmd.season.title') }}
                    </v-alert>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('season', 'spring', 0, false)"
                    >
                      {{ t('tools.tmi.cardCmd.season.spring') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('season', 'summer', 0, false)"
                    >
                      {{ t('tools.tmi.cardCmd.season.summer') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('season', 'autumn', 0, false)"
                    >
                      {{ t('tools.tmi.cardCmd.season.autumn') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('season', 'winter', 0, false)"
                    >
                      {{ t('tools.tmi.cardCmd.season.winter') }}
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-alert
                      color="info"
                      density="compact"
                    >
                      {{ t('tools.tmi.cardCmd.time.title') }}
                    </v-alert>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('nextPhase', '', 0, false)"
                    >
                      {{ t('tools.tmi.cardCmd.time.nextPhase') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('skipDays', '', 1, false)"
                    >
                      {{ t('tools.tmi.cardCmd.time.skipDays', { n: 1 }) }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('skipDays', '', 5, false)"
                    >
                      {{ t('tools.tmi.cardCmd.time.skipDays', { n: 5 }) }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('skipDays', '', 10, false)"
                    >
                      {{ t('tools.tmi.cardCmd.time.skipDays', { n: 10 }) }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('timeScale', '', 50, false)"
                    >
                      {{ t('tools.tmi.cardCmd.time.timeScale', { n: '0.5' }) }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('timeScale', '', 100, false)"
                    >
                      {{ t('tools.tmi.cardCmd.time.timeScale', { n: '1' }) }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('timeScale', '', 200, false)"
                    >
                      {{ t('tools.tmi.cardCmd.time.timeScale', { n: '2' }) }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('timeScale', '', 300, false)"
                    >
                      {{ t('tools.tmi.cardCmd.time.timeScale', { n: '3' }) }}
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-alert
                      color="info"
                      density="compact"
                    >
                      {{ t('tools.tmi.cardCmd.speed.title') }}
                    </v-alert>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('speed', '', 50)"
                    >
                      {{ t('tools.tmi.cardCmd.speed.slow') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('speed', '', 100)"
                    >
                      {{ t('tools.tmi.cardCmd.speed.normal') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('speed', '', 200)"
                    >
                      {{ t('tools.tmi.cardCmd.speed.fast') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('speed', '', 300)"
                    >
                      {{ t('tools.tmi.cardCmd.speed.veryFast') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('speed', '', 400)"
                    >
                      {{ t('tools.tmi.cardCmd.speed.superFast') }}
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-alert
                      color="info"
                      density="compact"
                    >
                      {{ t('tools.tmi.cardCmd.weather.title') }}
                    </v-alert>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('lightning', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.weather.lightning') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('rainOn', '', 0, false)"
                    >
                      {{ t('tools.tmi.cardCmd.weather.rain') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('rainOff', '', 0, false)"
                    >
                      {{ t('tools.tmi.cardCmd.weather.clear') }}
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-alert
                      color="info"
                      density="compact"
                    >
                      {{ t('tools.tmi.cardCmd.playerAction.title') }}
                    </v-alert>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('kill', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.playerAction.kill') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('resurrect', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.playerAction.resurrect') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('despawn', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.playerAction.despawn') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('gatherPlayers', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.playerAction.gather') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('unlockTech', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.playerAction.unlockTech') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('penaltyReduce', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.playerAction.healthUp') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('penaltyAdd', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.playerAction.healthDown') }}
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-alert
                      color="info"
                      density="compact"
                    >
                      {{ t('tools.tmi.cardCmd.entity.title') }}
                    </v-alert>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('deleteAround', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.entity.delete') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('fertilize', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.entity.fertilize') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('growth', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.entity.growth') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('harvest', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.entity.harvest') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('pickup', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.entity.pickup') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('freeze', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.entity.freeze') }}
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-alert
                      color="info"
                      density="compact"
                    >
                      {{ t('tools.tmi.cardCmd.beefalo.title') }}
                    </v-alert>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('beefalo', 'TENDENCY.ORNERY', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.beefalo.battle') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('beefalo', 'TENDENCY.RIDER', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.beefalo.rider') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('beefalo', 'TENDENCY.PUDGY', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.beefalo.pet') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('beefalo', 'TENDENCY.DEFAULT', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.beefalo.default') }}
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-alert
                      color="info"
                      density="compact"
                    >
                      {{ t('tools.tmi.cardCmd.follower.title') }}
                    </v-alert>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('followerAdd', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.follower.recruit') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('followerExpel', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.follower.expel') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('followerHealth', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.follower.health') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('followerHunger', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.follower.hunger') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('followerLoyal', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.follower.loyalty') }}
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-alert
                      color="info"
                      density="compact"
                    >
                      {{ t('tools.tmi.cardCmd.server.title') }}
                    </v-alert>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('regenerateWorld', '', 0, false)"
                    >
                      {{ t('tools.tmi.cardCmd.server.reset') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('save', '', 0, false)"
                    >
                      {{ t('tools.tmi.cardCmd.server.save') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('revealMap', '', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.server.revealMap') }}
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-alert
                      color="info"
                      density="compact"
                    >
                      {{ t('tools.tmi.cardCmd.surfaceTeleport.title') }}
                    </v-alert>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('teleport', 'multiplayer_portal', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.surfaceTeleport.floridPostern') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('teleport', 'cave_entrance_open', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.surfaceTeleport.caveEntrance') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('teleport', 'pigking', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.surfaceTeleport.pigKing') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('teleport', 'moonbase', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.surfaceTeleport.moonBase') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('teleport', 'oasislake', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.surfaceTeleport.oasis') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('teleport', 'critterlab', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.surfaceTeleport.critterLab') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('teleport', 'chester_eyebone', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.surfaceTeleport.eyebone') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('teleport', 'stagehand', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.surfaceTeleport.stagehand') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('teleport', 'moon_fissure', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.surfaceTeleport.moonFissure') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('teleport', 'beequeenhive', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.surfaceTeleport.beeQueen') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('teleport', 'klaus_sack', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.surfaceTeleport.klausSack') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('teleport', 'mooseegg', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.surfaceTeleport.mooseEgg') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('teleport', 'dragonfly', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.surfaceTeleport.dragonfly') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('teleport', 'antlion', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.surfaceTeleport.antlion') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('teleport', 'crabking', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.surfaceTeleport.crabKing') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('teleport', 'hermitcrab', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.surfaceTeleport.hermitCrab') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('teleport', 'walrus_camp', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.surfaceTeleport.walrusCamp') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('teleport', 'statueglommer', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.surfaceTeleport.glommerStatue') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('teleport', 'statuemaxwell', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.surfaceTeleport.maxwellStatue') }}
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-alert
                      color="info"
                      density="compact"
                    >
                      {{ t('tools.tmi.cardCmd.caveTeleport.title') }}
                    </v-alert>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('teleport', 'cave_exit', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.caveTeleport.stairs') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('teleport', 'atrium_gate', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.caveTeleport.atrium') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('teleport', 'ancient_altar', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.caveTeleport.ancientAltar') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('teleport', 'hutch_fishbowl', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.caveTeleport.hutch') }}
                    </v-btn>
                    <v-btn
                      density="compact"
                      color="x"
                      class="ml-2 mb-2"
                      @click="handleCmd('teleport', 'toadstool_cap', 0)"
                    >
                      {{ t('tools.tmi.cardCmd.caveTeleport.toadstool') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <result
          v-if="userStore.userInfo.role==='admin'"
          :title="t('global.noPlugin.title')"
          :sub-title="t('global.noPlugin.subTitle')"
          :height="calculateContainerSize()"
          type="error"
        >
          <v-btn
            to="/platform"
            class="mt-4"
          >
            {{ t('global.noPlugin.button') }}
          </v-btn>
        </result>
        <result
          v-else
          :title="t('global.noPluginNoAdmin.title')"
          :sub-title="t('global.noPluginNoAdmin.subTitle')"
          :height="calculateContainerSize()"
          type="error"
        />
      </template>
    </template>
    <template v-else>
      <result
        :title="t('global.noRoomSelected.title')"
        :sub-title="t('global.noRoomSelected.subTitle')"
        type="error"
        :height="calculateContainerSize()"
      >
        <v-btn
          to="/rooms"
          class="mt-4"
        >
          {{ t('global.noRoomSelected.button') }}
        </v-btn>
      </result>
    </template>
  </template>
  <template v-else>
    <result
      v-if="userStore.userInfo.role==='admin'"
      :title="t('global.noGame.title')"
      :sub-title="t('global.noGame.subTitle')"
      :height="calculateContainerSize()"
      type="error"
    >
      <v-btn
        to="/install"
        class="mt-4"
      >
        {{ t('global.noGame.button') }}
      </v-btn>
    </result>
    <result
      v-else
      :title="t('global.noGameNoAdmin.title')"
      :sub-title="t('global.noGameNoAdmin.subTitle')"
      :height="calculateContainerSize()"
      type="error"
    />
  </template>
</template>

<script setup>
import platformApi from "@/api/platform.js"
import toolsApi from "@/api/tools.js"
import dashboardApi from "@/api/dashboard.js"
import useGlobalStore from "@store/global.js"
import useUserStore from "@store/user.js"
import { useI18n } from "vue-i18n"
import { useDisplay } from "vuetify/framework"
import { debounce } from "@/utils/tools.js"
import { showSnackbar } from "@/utils/snackbar.js"


const globalStore = useGlobalStore()
const userStore = useUserStore()
const { t } = useI18n()
const { mobile } = useDisplay()
const windowHeight = ref(window.innerHeight)
const windowWidth = ref(window.innerWidth)

const baseInfo = ref()

const getBaseInfo = async () => {
  if (globalStore.room.id === 0) {
    return
  }

  const reqForm = {
    roomID: globalStore.room.id,
  }

  const response = await dashboardApi.info.base.get(reqForm)

  baseInfo.value = response.data
}

const pluginStatus = ref(false)
const pluginStatusLoading = ref(false)

const getPluginStatus = async () => {
  pluginStatusLoading.value = true

  const response = await platformApi.plugin.status.get({ name: 'tmi' })

  pluginStatus.value = response.data || false
}

const categories = ref([])

const getCategories = async () => {
  if (!pluginStatus.value) {
    return
  }

  const response = await toolsApi.tmi.category.get()

  categories.value = response.data || []

  return response
}

const categoryItems = ref([])
const itemsLoading = ref(false)
const page = ref(1)
const totalItems = ref(0)
const selectedCategory = ref('')
const selectWorldID = ref(undefined)
const selectPlayer = ref()

const pageSize = computed(() => {
  const gap = 8
  const itemSize = 64 + gap

  // ~260px sidebar + layout margins, 32px card padding
  const contentWidth = (windowWidth.value - (mobile.value ? 32 : 350)) * 0.6
  const cols = Math.max(3, Math.floor(contentWidth / itemSize))

  // ~120px for tabs + divider + pagination + padding
  const rows = Math.max(1, Math.floor((calculateContainerSize() - 120) / itemSize))

  return cols * rows
})

const totalPages = computed(() => {
  return Math.ceil(totalItems.value / pageSize.value) || 1
})

const getCategoryItems = async () => {
  if (!pluginStatus.value || !selectedCategory.value) {
    return
  }

  categoryItems.value = []

  itemsLoading.value = true

  try {
    const response = await toolsApi.tmi.category.items.get({
      page: page.value,
      pageSize: pageSize.value,
      category: selectedCategory.value,
    })

    categoryItems.value = response.data?.rows || []
    totalItems.value = response.data?.total || 0
  } finally {
    itemsLoading.value = false
  }
}

const onPageChange = () => {
  getCategoryItems()
}

const handleCategoryClick = () => {
  page.value = 1
  getCategoryItems()
}

const handleItemClick = item => {
  // TODO: use item.prefab for subsequent click actions
  console.log('Clicked item:', item.prefab, item)
}

const showMenu = ref(false)
const RightClickX = ref(0)
const RightClickY = ref(0)
const rightClickItem = ref(null)

const handleItemRightClick = (event, item) => {
  RightClickX.value = event.clientX
  RightClickY.value = event.clientY
  rightClickItem.value = item
  showMenu.value = true
}

const handleMenuItemClick = action => {
  if (!rightClickItem.value) return
  handleCmd('generate', rightClickItem.value.prefab, action)
  showMenu.value = false
}

const handleCmd = (type, prefab, num, uidRequired=true) => {
  if (!selectWorldID.value) {
    showSnackbar('请选择一个世界', 'error')

    return
  }

  if (uidRequired && !selectPlayer.value) {
    showSnackbar('请选择一个玩家', 'error')

    return
  }

  const reqForm = {
    roomID: globalStore.room.id,
    worldID: selectWorldID.value,
    type: type,
    prefab: prefab,
    num: num,
    uid: selectPlayer.value.uid,
  }

  toolsApi.tmi.console.post(reqForm).then(response => {
    showSnackbar(response.message)
  })
}

const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
  windowWidth.value = window.innerWidth
}, 200)

const calculateContainerSize = () => {
  // 64(navbar) + 37(tab header) + 20(card padding) + 16(card padding) = 137
  const other = 200 + 72

  return Math.max(2, Math.floor(windowHeight.value - other))
}

watch(pageSize, (newVal, oldVal) => {
  if (newVal !== oldVal && selectedCategory.value) {
    page.value = 1
    getCategoryItems()
  }
})

onMounted(async () => {
  window.addEventListener('resize', handleResize)
  await getBaseInfo()
  await getPluginStatus()
  await getCategories()
  if (categories.value.length > 0) {
    selectedCategory.value = categories.value[0]
    getCategoryItems()
  }
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 64px);
  gap: 8px;
  justify-content: start;
}

.tmi-item {
  border-radius: 4px;
  transition: background-color 0.5s ease;
}

.tmi-item:hover {
  background-color: #16B1FF;
}
</style>
